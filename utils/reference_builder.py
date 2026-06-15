import argparse
import csv
import json
import statistics
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from utils.background_remover import extract_hsv_with_rembg_fallback, is_rembg_enabled
from utils.input_validator import validate_and_compress
from utils.zscore import (
    EXPECTED_BASELINE_SCOPE,
    REFERENCE_PIPELINE_VERSION,
    choose_fresh_reference,
    classify_score,
)


CHANNELS = ("H", "S", "V")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
FRESH_LIGHTING_GROUPS = (
    "just_flash",
    "warm_lighting",
    "cool_lighting",
    "red_lighting",
)

DATASET_CATEGORIES = {"fresh", "experimental", "suspicious", "stale"}

SPECIES_TO_CUTS = {
    "beef": {"beef_shank", "beef_sirloin"},
    "pork": {"pork_belly", "pork_chop"},
    "chicken": {"chicken_drumstick", "chicken_breast"},
}

CSV_FIELDS = (
    "status",
    "error",
    "species",
    "cut",
    "dataset_category",
    "freshness_label",
    "lighting",
    "condition",
    "exposure_time",
    "filename",
    "path",
    "hsv_method",
    "H",
    "S",
    "V",
    "z_H",
    "z_S",
    "z_V",
    "deviation_score",
    "computed_classification",
)


def normalize_label(value: str) -> str:
    return value.strip().lower().replace(" ", "_").replace("-", "_")


def parse_baseline_lightings(value: str) -> set[str]:
    return {
        normalize_label(item)
        for item in value.split(",")
        if item.strip()
    }


def find_image_paths(dataset_dir: Path) -> list[Path]:
    return sorted(
        path
        for path in dataset_dir.rglob("*")
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
    )


def empty_record(path: Path, dataset_dir: Path) -> dict:
    relative_path = path.relative_to(dataset_dir)
    return {
        "status": "pending",
        "error": "",
        "species": "",
        "cut": "",
        "dataset_category": "",
        "freshness_label": "",
        "lighting": "unspecified",
        "condition": "none",
        "exposure_time": "none",
        "filename": path.name,
        "path": relative_path.as_posix(),
        "hsv_method": "",
        "H": None,
        "S": None,
        "V": None,
        "z_H": None,
        "z_S": None,
        "z_V": None,
        "deviation_score": None,
        "computed_classification": "",
    }


def build_record_from_path(path: Path, dataset_dir: Path) -> dict:
    relative_path = path.relative_to(dataset_dir)
    folders = relative_path.parts[:-1]
    record = empty_record(path, dataset_dir)

    if len(folders) < 3:
        record["status"] = "error"
        record["error"] = (
            "Expected folder structure: "
            "species/cut/(fresh|experimental)/metadata/image"
        )
        return record

    species, cut, category = (normalize_label(part) for part in folders[:3])
    record["species"] = species
    record["cut"] = cut

    if species not in SPECIES_TO_CUTS:
        record["status"] = "error"
        record["error"] = "Unsupported species folder."
        return record

    if cut not in SPECIES_TO_CUTS[species]:
        record["status"] = "error"
        record["error"] = "Unsupported or mismatched cut folder."
        return record

    if category not in DATASET_CATEGORIES:
        record["status"] = "error"
        record["error"] = "Unsupported dataset category folder."
        return record

    if category == "experimental":
        record["dataset_category"] = "experimental"
        record["freshness_label"] = ""
        if len(folders) >= 4:
            record["condition"] = normalize_label(folders[3])
        if len(folders) >= 5:
            record["lighting"] = normalize_label(folders[4])
        if len(folders) >= 6:
            record["exposure_time"] = "/".join(
                normalize_label(part) for part in folders[5:]
            )
        return record

    record["dataset_category"] = "fresh" if category == "fresh" else "labeled"
    record["freshness_label"] = category

    if len(folders) >= 4:
        record["lighting"] = normalize_label(folders[3])

    if len(folders) >= 5:
        record["condition"] = "/".join(normalize_label(part) for part in folders[4:])

    return record


def process_image(path: Path, dataset_dir: Path) -> dict:
    record = build_record_from_path(path, dataset_dir)
    if record["status"] == "error":
        return record

    try:
        image_bytes = path.read_bytes()
        compressed_bytes = validate_and_compress(image_bytes)
        hsv_means, hsv_method = extract_hsv_with_rembg_fallback(compressed_bytes)
    except OSError as error:
        record["status"] = "error"
        record["error"] = f"Could not read image file: {error}"
        return record
    except ValueError as error:
        record["status"] = "error"
        record["error"] = str(error)
        return record

    record["status"] = "ok"
    record["hsv_method"] = hsv_method
    for channel in CHANNELS:
        record[channel] = float(hsv_means[channel])
    return record


def summarize_records(records: list[dict]) -> dict:
    summary = {"n": len(records)}
    for channel in CHANNELS:
        values = [float(record[channel]) for record in records]
        summary[channel] = {
            "mean": round(statistics.fmean(values), 4),
            "std": round(statistics.stdev(values), 4) if len(values) > 1 else 0.0,
        }
    return summary


def grouped_statistics(successful_records: list[dict]) -> dict:
    groups = {
        "by_species": defaultdict(list),
        "by_species_cut": defaultdict(list),
        "by_dataset_category": defaultdict(list),
        "by_species_cut_category": defaultdict(list),
        "by_species_cut_category_lighting": defaultdict(list),
        "by_experimental_condition": defaultdict(list),
    }

    for record in successful_records:
        groups["by_species"][record["species"]].append(record)
        groups["by_species_cut"][(record["species"], record["cut"])].append(record)
        groups["by_dataset_category"][record["dataset_category"]].append(record)
        groups["by_species_cut_category"][
            (record["species"], record["cut"], record["dataset_category"])
        ].append(record)
        groups["by_species_cut_category_lighting"][
            (
                record["species"],
                record["cut"],
                record["dataset_category"],
                record["lighting"],
            )
        ].append(record)

        if record["dataset_category"] == "experimental":
            groups["by_experimental_condition"][
                (
                    record["species"],
                    record["cut"],
                    record["condition"],
                    record["lighting"],
                    record["exposure_time"],
                )
            ].append(record)

    return {
        "by_species": {
            species: summarize_records(records)
            for species, records in sorted(groups["by_species"].items())
        },
        "by_species_cut": [
            {
                "species": species,
                "cut": cut,
                "stats": summarize_records(records),
            }
            for (species, cut), records in sorted(groups["by_species_cut"].items())
        ],
        "by_dataset_category": {
            category: summarize_records(records)
            for category, records in sorted(groups["by_dataset_category"].items())
        },
        "by_species_cut_category": [
            {
                "species": species,
                "cut": cut,
                "dataset_category": category,
                "stats": summarize_records(records),
            }
            for (species, cut, category), records in sorted(
                groups["by_species_cut_category"].items()
            )
        ],
        "by_species_cut_category_lighting": [
            {
                "species": species,
                "cut": cut,
                "dataset_category": category,
                "lighting": lighting,
                "stats": summarize_records(records),
            }
            for (species, cut, category, lighting), records in sorted(
                groups["by_species_cut_category_lighting"].items()
            )
        ],
        "by_experimental_condition": [
            {
                "species": species,
                "cut": cut,
                "condition": condition,
                "lighting": lighting,
                "exposure_time": exposure_time,
                "stats": summarize_records(records),
            }
            for (
                species,
                cut,
                condition,
                lighting,
                exposure_time,
            ), records in sorted(groups["by_experimental_condition"].items())
        ],
    }


def fresh_baseline_records(
    successful_records: list[dict],
    species: str,
    cut: str,
) -> list[dict]:
    fresh_records = [
        record
        for record in successful_records
        if record["species"] == species
        and record["cut"] == cut
        and record["dataset_category"] == "fresh"
        and record["freshness_label"] == "fresh"
    ]
    return fresh_records


def fresh_lighting_baselines(
    successful_records: list[dict],
    species: str,
    cut: str,
    baseline_lightings: set[str],
) -> dict:
    grouped_records = defaultdict(list)
    for record in successful_records:
        if (
            record["species"] == species
            and record["cut"] == cut
            and record["dataset_category"] == "fresh"
            and record["freshness_label"] == "fresh"
            and record["lighting"] in baseline_lightings
        ):
            grouped_records[record["lighting"]].append(record)

    return {
        lighting: summarize_records(records)
        for lighting, records in sorted(grouped_records.items())
    }


def build_reference_data(
    successful_records: list[dict],
    baseline_lightings: set[str],
) -> tuple[dict, list[str]]:
    reference_data = {
        "_note": (
            "Generated from verified fresh dataset images using the EyeSariwa "
            "backend pipeline. Experimental records are excluded from the "
            "baseline and kept for analysis only. Treat these values as "
            "preliminary until validated."
        ),
        "_pipeline_version": REFERENCE_PIPELINE_VERSION,
        "_rembg_enabled": is_rembg_enabled(),
        "_baseline_rule": {
            "baseline_scope": EXPECTED_BASELINE_SCOPE,
            "source_dataset_category": "fresh",
            "source_freshness_label": "fresh",
            "excluded_dataset_categories": ["experimental", "labeled"],
            "hsv_pipeline": (
                "rembg foreground extraction with largest-component bounding-box "
                "crop and center-crop fallback"
            ),
            "classification_rule": (
                "Compares uploads against the just_flash daylight fresh baseline "
                "for the selected species/cut."
            ),
            "lighting_baselines_usage": "just_flash_used_by_classify_others_analysis_only",
            "lighting_groups": sorted(baseline_lightings),
        },
    }
    warnings = []

    for species, cuts in sorted(SPECIES_TO_CUTS.items()):
        reference_data[species] = {"cuts": {}}
        for cut in sorted(cuts):
            selected_records = fresh_baseline_records(
                successful_records,
                species,
                cut,
            )
            if not selected_records:
                warnings.append(f"No verified fresh records found for {species}/{cut}.")
                continue

            fresh_stats = summarize_records(selected_records)
            fresh_stats["selection_method"] = "all_verified_fresh_records"
            fresh_stats["lighting_baselines"] = fresh_lighting_baselines(
                successful_records,
                species,
                cut,
                baseline_lightings,
            )
            reference_data[species]["cuts"][cut] = {"fresh": fresh_stats}

    return reference_data, warnings


def add_deviation_scores(successful_records: list[dict], reference_data: dict) -> None:
    for record in successful_records:
        species_reference = reference_data.get(record["species"], {})
        cuts_reference = species_reference.get("cuts", {})
        cut_reference = cuts_reference.get(record["cut"], {})
        fresh_reference = cut_reference.get("fresh")
        if not isinstance(fresh_reference, dict):
            continue

        hsv_means = {channel: record[channel] for channel in CHANNELS}
        best_reference = choose_fresh_reference(hsv_means, fresh_reference)
        z_scores = best_reference["z_scores"]
        score = best_reference["score"]
        for channel in CHANNELS:
            record[f"z_{channel}"] = round(z_scores[channel], 4)
        record["deviation_score"] = round(score, 4)
        record["computed_classification"] = classify_score(score)


def build_analysis_report(successful_records: list[dict]) -> dict:
    category_counts = defaultdict(int)
    classification_counts = defaultdict(int)
    category_classification_counts = defaultdict(lambda: defaultdict(int))
    category_scores = defaultdict(list)
    category_lighting_counts = defaultdict(int)
    category_lighting_classification_counts = defaultdict(lambda: defaultdict(int))
    category_lighting_scores = defaultdict(list)
    experimental_counts = defaultdict(int)

    for record in successful_records:
        category_counts[record["dataset_category"]] += 1
        category_lighting_key = (record["dataset_category"], record["lighting"])
        category_lighting_counts[category_lighting_key] += 1
        if record["computed_classification"]:
            classification_counts[record["computed_classification"]] += 1
            category_classification_counts[record["dataset_category"]][
                record["computed_classification"]
            ] += 1
            category_lighting_classification_counts[category_lighting_key][
                record["computed_classification"]
            ] += 1
        if record["deviation_score"] is not None:
            category_scores[record["dataset_category"]].append(
                float(record["deviation_score"])
            )
            category_lighting_scores[category_lighting_key].append(
                float(record["deviation_score"])
            )

        if record["dataset_category"] == "experimental":
            key = (
                record["species"],
                record["cut"],
                record["condition"],
                record["lighting"],
                record["exposure_time"],
            )
            experimental_counts[key] += 1

    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "record_count": len(successful_records),
        "dataset_category_counts": dict(sorted(category_counts.items())),
        "computed_classification_counts": dict(sorted(classification_counts.items())),
        "classification_summary_by_dataset_category": {
            category: {
                "n": category_counts[category],
                "computed_classification_counts": dict(
                    sorted(category_classification_counts[category].items())
                ),
                "median_score": (
                    round(statistics.median(category_scores[category]), 4)
                    if category_scores[category]
                    else None
                ),
            }
            for category in sorted(category_counts)
        },
        "classification_summary_by_dataset_category_lighting": [
            {
                "dataset_category": category,
                "lighting": lighting,
                "n": category_lighting_counts[(category, lighting)],
                "computed_classification_counts": dict(
                    sorted(
                        category_lighting_classification_counts[
                            (category, lighting)
                        ].items()
                    )
                ),
                "median_score": (
                    round(
                        statistics.median(
                            category_lighting_scores[(category, lighting)]
                        ),
                        4,
                    )
                    if category_lighting_scores[(category, lighting)]
                    else None
                ),
            }
            for category, lighting in sorted(category_lighting_counts)
        ],
        "experimental_condition_counts": [
            {
                "species": species,
                "cut": cut,
                "condition": condition,
                "lighting": lighting,
                "exposure_time": exposure_time,
                "n": count,
            }
            for (
                species,
                cut,
                condition,
                lighting,
                exposure_time,
            ), count in sorted(experimental_counts.items())
        ],
    }


def build_qa_report(
    all_records: list[dict],
    reference_data: dict,
    reference_warnings: list[str],
    min_samples: int,
) -> dict:
    successful_records = [record for record in all_records if record["status"] == "ok"]
    failed_records = [record for record in all_records if record["status"] == "error"]
    warnings = list(reference_warnings)
    method_counts = defaultdict(int)
    category_counts = defaultdict(int)

    for record in successful_records:
        method_counts[record.get("hsv_method") or "unknown"] += 1
        category_counts[record["dataset_category"]] += 1

    for species, cuts in sorted(SPECIES_TO_CUTS.items()):
        species_reference = reference_data.get(species)
        if not isinstance(species_reference, dict):
            warnings.append(f"Generated reference data is missing {species}.")
            continue

        cuts_reference = species_reference.get("cuts")
        if not isinstance(cuts_reference, dict):
            warnings.append(f"Generated reference data is missing cuts for {species}.")
            continue

        for cut in sorted(cuts):
            cut_reference = cuts_reference.get(cut)
            if not isinstance(cut_reference, dict):
                warnings.append(f"Generated reference data is missing {species}/{cut}.")
                continue

            fresh_reference = cut_reference.get("fresh")
            if not isinstance(fresh_reference, dict):
                warnings.append(
                    f"Generated reference data is missing fresh baseline for {species}/{cut}."
                )
                continue

            n = fresh_reference["n"]
            if n < min_samples:
                warnings.append(
                    f"Fresh baseline for {species}/{cut} has n={n}; "
                    f"target minimum is {min_samples}."
                )

            lighting_baselines = fresh_reference.get("lighting_baselines")
            if isinstance(lighting_baselines, dict):
                for lighting, lighting_reference in sorted(lighting_baselines.items()):
                    lighting_n = lighting_reference.get("n", 0)
                    if lighting_n < min_samples:
                        warnings.append(
                            f"Fresh baseline for {species}/{cut}/{lighting} has "
                            f"n={lighting_n}; target minimum is {min_samples}."
                        )

            has_cut = any(
                record["species"] == species
                and record["cut"] == cut
                and record["dataset_category"] == "fresh"
                and record["freshness_label"] == "fresh"
                for record in successful_records
            )
            if not has_cut:
                warnings.append(f"No successful fresh records found for {species}/{cut}.")

    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "total_images": len(all_records),
        "successful_images": len(successful_records),
        "failed_images": len(failed_records),
        "dataset_category_counts": dict(sorted(category_counts.items())),
        "hsv_method_counts": dict(sorted(method_counts.items())),
        "warnings": warnings,
        "failed_records": failed_records,
    }


def write_csv(records: list[dict], output_path: Path) -> None:
    with output_path.open("w", encoding="utf-8", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for record in records:
            row = record.copy()
            for field in ("H", "S", "V", "z_H", "z_S", "z_V", "deviation_score"):
                if row[field] is not None:
                    row[field] = round(float(row[field]), 4)
            writer.writerow({field: row.get(field, "") for field in CSV_FIELDS})


def write_json(data, output_path: Path) -> None:
    with output_path.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
        file.write("\n")


def build_outputs(
    dataset_dir: Path,
    output_dir: Path,
    baseline_lightings: set[str],
    min_samples: int,
    max_images: int | None = None,
) -> dict:
    if not dataset_dir.exists():
        raise ValueError(f"Dataset directory does not exist: {dataset_dir}")

    image_paths = find_image_paths(dataset_dir)
    if not image_paths:
        raise ValueError(f"No supported image files found in: {dataset_dir}")
    total_discovered_images = len(image_paths)

    if max_images is not None:
        if max_images <= 0:
            raise ValueError("Maximum image count must be greater than 0.")
        image_paths = image_paths[:max_images]

    output_dir.mkdir(parents=True, exist_ok=True)

    records = [process_image(path, dataset_dir) for path in image_paths]
    successful_records = [record for record in records if record["status"] == "ok"]
    reference_data, reference_warnings = build_reference_data(
        successful_records,
        baseline_lightings,
    )
    add_deviation_scores(successful_records, reference_data)

    stats = grouped_statistics(successful_records)
    analysis_report = build_analysis_report(successful_records)
    qa_report = build_qa_report(
        records,
        reference_data,
        reference_warnings,
        min_samples,
    )

    csv_path = output_dir / "per_image_hsv.csv"
    per_image_json_path = output_dir / "per_image_hsv.json"
    stats_path = output_dir / "grouped_statistics.json"
    analysis_path = output_dir / "analysis_report.json"
    generated_reference_path = output_dir / "reference_data.generated.json"
    reference_path = output_dir / "reference_data.json"
    qa_path = output_dir / "qa_report.json"

    write_csv(records, csv_path)
    write_json(records, per_image_json_path)
    write_json(stats, stats_path)
    write_json(analysis_report, analysis_path)
    write_json(reference_data, generated_reference_path)
    write_json(reference_data, reference_path)
    write_json(qa_report, qa_path)

    return {
        "csv": csv_path,
        "per_image_json": per_image_json_path,
        "grouped_statistics": stats_path,
        "analysis_report": analysis_path,
        "reference_data_generated": generated_reference_path,
        "reference_data": reference_path,
        "qa_report": qa_path,
        "successful_images": len(successful_records),
        "failed_images": len(records) - len(successful_records),
        "processed_images": len(records),
        "total_discovered_images": total_discovered_images,
        "warnings": qa_report["warnings"],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build EyeSariwa HSV analysis files and reference data from images."
    )
    parser.add_argument(
        "--dataset-dir",
        default="dataset",
        help="Dataset folder with species/cut/(fresh|experimental) images.",
    )
    parser.add_argument(
        "--output-dir",
        default="outputs/reference_builder",
        help="Folder where CSV, JSON, reference data, and QA outputs will be written.",
    )
    parser.add_argument(
        "--baseline-lighting",
        default=",".join(FRESH_LIGHTING_GROUPS),
        help=(
            "Comma-separated fresh lighting folders to include in analysis-only "
            "lighting baselines."
        ),
    )
    parser.add_argument(
        "--min-samples",
        type=int,
        default=5,
        help="Minimum successful fresh records expected per generated fresh baseline group.",
    )
    parser.add_argument(
        "--max-images",
        type=int,
        default=None,
        help="Optional cap for lightweight smoke tests. Avoid for final reference generation.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        outputs = build_outputs(
            dataset_dir=Path(args.dataset_dir),
            output_dir=Path(args.output_dir),
            baseline_lightings=parse_baseline_lightings(args.baseline_lighting),
            min_samples=args.min_samples,
            max_images=args.max_images,
        )
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 1

    print("EyeSariwa reference builder completed.")
    print(f"Discovered images: {outputs['total_discovered_images']}")
    print(f"Processed images: {outputs['processed_images']}")
    print(f"Successful images: {outputs['successful_images']}")
    print(f"Failed images: {outputs['failed_images']}")
    print(f"Per-image CSV: {outputs['csv']}")
    print(f"Per-image JSON: {outputs['per_image_json']}")
    print(f"Grouped statistics: {outputs['grouped_statistics']}")
    print(f"Analysis report: {outputs['analysis_report']}")
    print(f"Generated reference data: {outputs['reference_data_generated']}")
    print(f"Copy-ready reference data: {outputs['reference_data']}")
    print(f"QA report: {outputs['qa_report']}")

    if outputs["warnings"]:
        print("Warnings:")
        for warning in outputs["warnings"]:
            print(f"- {warning}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
