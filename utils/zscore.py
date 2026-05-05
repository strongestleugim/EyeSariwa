import json
import math
from pathlib import Path


CHANNELS = ("H", "S", "V")
EPSILON = 1e-6
OPENCV_HUE_RANGE = 180.0
MIN_HUE_STD = 5.0
FRESH_SCORE_THRESHOLD = 2.0
SUSPICIOUS_SCORE_THRESHOLD = 4.0
REFERENCE_DATA_PATH = Path(__file__).resolve().parents[1] / "reference_data.json"


def load_reference_data():
    try:
        with REFERENCE_DATA_PATH.open("r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError as exc:
        raise ValueError("Reference data file is missing.") from exc
    except json.JSONDecodeError as exc:
        raise ValueError("Reference data file contains invalid JSON.") from exc


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
    if channel == "H":
        return max(abs(reference_std), MIN_HUE_STD)
    return abs(reference_std) if reference_std != 0 else EPSILON


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
    return math.sqrt(sum(z_score**2 for z_score in z_scores.values()))


def score_against_reference(hsv_means: dict, fresh_reference: dict) -> dict:
    z_scores = calculate_z_scores(hsv_means, fresh_reference)
    score = calculate_score(z_scores)
    return {
        "score": score,
        "z_scores": z_scores,
    }


def candidate_fresh_references(fresh_reference: dict) -> list[dict]:
    lighting_baselines = fresh_reference.get("lighting_baselines")
    if isinstance(lighting_baselines, dict) and lighting_baselines:
        return [
            {
                "name": lighting,
                "reference": reference,
            }
            for lighting, reference in sorted(lighting_baselines.items())
            if isinstance(reference, dict)
        ]

    return [
        {
            "name": fresh_reference.get("selection_method", "fresh"),
            "reference": fresh_reference,
        }
    ]


def choose_best_fresh_reference(hsv_means: dict, fresh_reference: dict) -> dict:
    candidates = candidate_fresh_references(fresh_reference)
    if not candidates:
        raise ValueError("Fresh lighting reference data is missing for selected meat cut.")

    scored_candidates = []
    for candidate in candidates:
        scored = score_against_reference(hsv_means, candidate["reference"])
        scored["reference_name"] = candidate["name"]
        scored_candidates.append(scored)

    return min(scored_candidates, key=lambda candidate: candidate["score"])


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

    best_reference = choose_best_fresh_reference(hsv_means, fresh_reference)
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
