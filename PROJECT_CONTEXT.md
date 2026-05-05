# PROJECT_CONTEXT.md - EyeSariwa

## Project Purpose

EyeSariwa is a mobile-first Progressive Web Application for visual meat surface freshness assessment.

It helps wet market consumers assess visible surface freshness signals from selected raw beef, pork, and chicken cuts. The app is a supplementary consumer-side tool and does not determine complete food safety.

## Supported Meat Types and Cuts

### Beef

- Beef Shank
- Beef Sirloin

### Pork

- Pork Belly
- Pork Chop

### Chicken

- Chicken Drumstick
- Chicken Breast

Do not add more meat types or cuts without explicit approval.

## Classification States

EyeSariwa uses only three classifications:

- Fresh
- Suspicious
- Stale

Backend API responses may use:

- FRESH
- SUSPICIOUS
- STALE

## Scope Limitations

EyeSariwa checks visible surface freshness signals only.

It does not:

- determine complete meat safety
- detect chemical adulterants
- detect bacteria
- detect internal spoilage
- replace official meat inspection
- support unsupported meat types or cuts

Public-facing wording must preserve these limits.

## Backend Pipeline

The current backend pipeline is:

1. Receive an image and metadata from the frontend.
2. Validate the uploaded image and request fields.
3. Compress and resize the image if needed.
4. Try background removal with `rembg`.
5. Keep the largest foreground component from the rembg mask.
6. Crop to the foreground bounding box with padding so off-center meat is analyzed around the detected object.
7. Extract HSV mean values from the foreground meat region.
8. Fall back to center-crop HSV extraction if background removal fails.
9. Compute calibrated Z-scores against every fresh lighting baseline for the selected cut and use the lowest anomaly score.
10. Return Fresh, Suspicious, or Stale.

The current reference values are cut-specific and lighting-aware fresh baselines generated from the collected dataset. They should still be treated as preliminary until validated.

The current calibration compares each uploaded image against `just_flash`, `warm_lighting`, `cool_lighting`, and `red_lighting` fresh baselines for the selected species/cut. It uses circular Hue distance for OpenCV HSV values, applies a minimum Hue standard deviation to reduce sensitivity to very small Hue variance in the baseline, and uses score thresholds of `<= 2.0` for Fresh, `> 2.0` and `<= 4.0` for Suspicious, and `> 4.0` for Stale.

## Reference Data Workflow

Study images should be organized by species, cut, dataset category, and capture metadata before generating updated reference data.

Recommended folder pattern:

```text
dataset/species/cut/fresh/lighting/image.jpg
dataset/species/cut/experimental/condition/lighting/exposure_time/image.jpg
```

The backend utility `utils/reference_builder.py` can generate:

- per-image HSV CSV and JSON outputs for analysis
- per-image HSV method labels showing `rembg` or `center_crop_fallback`
- per-image Z-scores, deviation scores, and computed classifications against the generated fresh baseline
- grouped HSV statistics by species, cut, dataset category, lighting, and experimental condition
- a cut-specific and lighting-aware `reference_data.generated.json` baseline candidate
- a copy-ready `reference_data.json` baseline candidate in the output folder
- a QA report for failed images, missing groups, and low sample counts

Only verified `fresh` records are used to generate each species/cut backend baseline. Fresh records are grouped by lighting so `/classify` can choose the closest fresh lighting baseline at runtime. `experimental` folders are treated as study metadata and are not treated as validated Suspicious or Stale labels.

The generated reference data should be reviewed before replacing the root `reference_data.json`.

## API Contract

Primary endpoint:

POST /classify

Request type:

multipart/form-data

Required fields:

- image
- species
- cut

Allowed species:

- beef
- pork
- chicken

Allowed cuts:

- beef_shank
- beef_sirloin
- pork_belly
- pork_chop
- chicken_drumstick
- chicken_breast

Expected success response shape:

```json
{
  "species": "beef",
  "cut": "beef_sirloin",
  "classification": "FRESH",
  "score": 0.82,
  "z_scores": {
    "H": 0.2,
    "S": -0.4,
    "V": 0.6
  },
  "hsv_means": {
    "H": 10.2,
    "S": 145.7,
    "V": 180.4
  }
}
```

Expected error response shape:

```json
{
  "error": "Clear human-readable error message"
}
```

The API contract must not change without explicit approval.

## Stack

Backend:

- Python 3.11+
- Flask 3.x
- Flask-CORS
- Gunicorn

Frontend:

- HTML5
- CSS3
- Vanilla JavaScript

Data:

- reference_data.json

Deployment and testing:

- Render
- Postman
- Chrome Android mobile browser testing

## Unsafe Wording Rules

Do not claim that EyeSariwa determines complete meat safety.

Do not use wording that implies complete food safety, purchase certainty, direct contaminant detection, or replacement of official inspection.

Use scope-safe wording such as:

- visible surface freshness
- surface freshness signal
- based on visible surface freshness signals only
- does not replace official meat inspection
