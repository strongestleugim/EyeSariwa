import json
import math
from pathlib import Path


CHANNELS = ("H", "S", "V")
EPSILON = 1e-6
OPENCV_HUE_RANGE = 180.0
REFERENCE_PIPELINE_VERSION = "eyesariwa-hsv-zscore-v3"
EXPECTED_BASELINE_SCOPE = "species_cut_fresh_daylight"
DAYLIGHT_BASELINE_KEY = "just_flash"
MIN_HUE_STD = 5.0
# S and V floors are provisional tunables until expert-labeled samples exist.
MIN_S_STD = 8.0
MIN_V_STD = 10.0
CHANNEL_WEIGHTS = {"H": 1.0, "S": 1.0, "V": 0.5}
FRESH_SCORE_THRESHOLD = 2.0
SUSPICIOUS_SCORE_THRESHOLD = 4.0
REFERENCE_DATA_PATH = Path(__file__).resolve().parents[1] / "reference_data.json"


def load_reference_data():
    try:
        with REFERENCE_DATA_PATH.open("r", encoding="utf-8") as file:
            reference_data = json.load(file)
    except FileNotFoundError as exc:
        raise ValueError("Reference data file is missing.") from exc
    except json.JSONDecodeError as exc:
        raise ValueError("Reference data file contains invalid JSON.") from exc

    validate_reference_schema(reference_data)
    return reference_data


def validate_reference_schema(reference_data: dict) -> None:
    if not isinstance(reference_data, dict):
        raise ValueError("Reference data must be a JSON object.")

    if reference_data.get("_pipeline_version") != REFERENCE_PIPELINE_VERSION:
        raise ValueError(
            "Reference data pipeline version is missing or unsupported. "
            "Regenerate reference_data.json with utils.reference_builder."
        )

    if not isinstance(reference_data.get("_rembg_enabled"), bool):
        raise ValueError("Reference data must include a valid _rembg_enabled stamp.")

    baseline_rule = reference_data.get("_baseline_rule")
    if not isinstance(baseline_rule, dict):
        raise ValueError("Reference data baseline rule is missing or invalid.")

    if baseline_rule.get("baseline_scope") != EXPECTED_BASELINE_SCOPE:
        raise ValueError(
            "Reference data baseline scope is unsupported. "
            "Regenerate reference_data.json with utils.reference_builder."
        )


def reference_requires_rembg(reference_data: dict | None = None) -> bool:
    if reference_data is None:
        reference_data = load_reference_data()
    return bool(reference_data["_rembg_enabled"])


def signed_hue_difference(observed_hue: float, reference_hue: float) -> float:
    return (
        (observed_hue - reference_hue + OPENCV_HUE_RANGE / 2)
        % OPENCV_HUE_RANGE
    ) - OPENCV_HUE_RANGE / 2


def channel_difference(channel: str, observed_mean: float, reference_mean: float) -> float:
    if channel == "H":
        return signed_hue_difference(observed_mean, reference_mean)
    return observed_mean - reference_mean


def effective_reference_std(channel: str, reference_std: float) -> float:
    std = abs(reference_std)
    if channel == "H":
        return max(std, MIN_HUE_STD)
    if channel == "S":
        return max(std, MIN_S_STD)
    if channel == "V":
        return max(std, MIN_V_STD)
    return std if std != 0 else EPSILON


def classify_score(score: float) -> str:
    if score <= FRESH_SCORE_THRESHOLD:
        return "FRESH"
    if score <= SUSPICIOUS_SCORE_THRESHOLD:
        return "SUSPICIOUS"
    return "STALE"


def calculate_z_scores(hsv_means: dict, fresh_reference: dict) -> dict:
    z_scores = {}
    for channel in CHANNELS:
        if channel not in hsv_means:
            raise ValueError("HSV means must include H, S, and V.")

        channel_reference = fresh_reference.get(channel)
        if not isinstance(channel_reference, dict):
            raise ValueError(f"Reference data for {channel} is missing.")

        if "mean" not in channel_reference or "std" not in channel_reference:
            raise ValueError(f"Reference data for {channel} must include mean and std.")

        try:
            observed_mean = float(hsv_means[channel])
            reference_mean = float(channel_reference["mean"])
            reference_std = float(channel_reference["std"])
        except (TypeError, ValueError) as exc:
            raise ValueError(f"HSV and reference values for {channel} must be numeric.") from exc

        difference = channel_difference(channel, observed_mean, reference_mean)
        z_scores[channel] = difference / effective_reference_std(channel, reference_std)

    return z_scores


def calculate_score(z_scores: dict) -> float:
    # The V weight is provisional and must be validated against expert-labeled samples.
    return math.sqrt(
        sum(CHANNEL_WEIGHTS[channel] * z_scores[channel] ** 2 for channel in CHANNELS)
    )


def score_against_reference(hsv_means: dict, fresh_reference: dict) -> dict:
    z_scores = calculate_z_scores(hsv_means, fresh_reference)
    score = calculate_score(z_scores)
    return {
        "score": score,
        "z_scores": z_scores,
    }


def select_daylight_reference(fresh_reference: dict) -> dict:
    if not isinstance(fresh_reference, dict):
        raise ValueError("Fresh reference data is missing for selected meat cut.")

    lighting_baselines = fresh_reference.get("lighting_baselines")
    if not isinstance(lighting_baselines, dict):
        raise ValueError("Fresh daylight reference data is missing for selected meat cut.")

    daylight_reference = lighting_baselines.get(DAYLIGHT_BASELINE_KEY)
    if not isinstance(daylight_reference, dict):
        raise ValueError("Fresh daylight reference data is missing for selected meat cut.")

    for channel in CHANNELS:
        channel_reference = daylight_reference.get(channel)
        if not isinstance(channel_reference, dict):
            raise ValueError(f"Fresh daylight reference data for {channel} is missing.")

    return daylight_reference


def choose_fresh_reference(hsv_means: dict, fresh_reference: dict) -> dict:
    daylight_reference = select_daylight_reference(fresh_reference)
    scored = score_against_reference(hsv_means, daylight_reference)
    scored["reference_name"] = DAYLIGHT_BASELINE_KEY
    return scored


def classify_hsv(hsv_means: dict, species: str, cut: str) -> dict:
    reference_data = load_reference_data()

    if not isinstance(hsv_means, dict):
        raise ValueError("HSV means must include H, S, and V.")

    if not isinstance(reference_data, dict):
        raise ValueError("Reference data must be a JSON object.")

    if species not in reference_data:
        raise ValueError("No reference data found for selected meat type.")

    species_reference = reference_data[species]
    if not isinstance(species_reference, dict):
        raise ValueError("Reference data for selected meat type is invalid.")

    cuts_reference = species_reference.get("cuts")
    if not isinstance(cuts_reference, dict):
        raise ValueError("Cut-specific reference data is missing for selected meat type.")

    cut_reference = cuts_reference.get(cut)
    if not isinstance(cut_reference, dict):
        raise ValueError("No cut-specific reference data found for selected meat cut.")

    fresh_reference = cut_reference.get("fresh")
    if not isinstance(fresh_reference, dict):
        raise ValueError("Fresh reference data is missing for selected meat cut.")

    best_reference = choose_fresh_reference(hsv_means, fresh_reference)
    score = best_reference["score"]
    z_scores = best_reference["z_scores"]

    return {
        "classification": classify_score(score),
        "score": round(score, 4),
        "z_scores": {
            channel: round(z_scores[channel], 4)
            for channel in CHANNELS
        },
    }
