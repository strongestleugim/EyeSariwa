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
4. Try background removal with `rembg` unless `EYESARIWA_ENABLE_REMBG=false`.
5. Resize the image passed to `rembg` to a maximum edge of 768px by default to reduce inference time.
6. Keep the largest foreground component from the rembg mask.
7. Crop to the foreground bounding box with padding so off-center meat is analyzed around the detected object.
8. Extract HSV mean values from the foreground meat region.
9. Fall back to center-crop HSV extraction if background removal fails or if `rembg` is disabled.
10. Compute calibrated Z-scores against the single aggregate fresh baseline for the selected species/cut.
11. Return Fresh, Suspicious, or Stale.

The current reference values are cut-specific aggregate fresh baselines generated from the collected dataset. Lighting-group baselines remain in `reference_data.json` for analysis only and are not used by `/classify`. The values should still be treated as preliminary until validated.

The current calibration compares each uploaded image against the selected species/cut aggregate Fresh reference distribution. It uses circular Hue distance for OpenCV HSV values, applies minimum standard-deviation floors for H, S, and V, and uses a weighted Euclidean anomaly score with a provisional lower weight for V because brightness is highly illumination-dependent. Current score thresholds remain `<= 2.0` for Fresh, `> 2.0` and `<= 4.0` for Suspicious, and `> 4.0` for Stale.

For deployment reliability, the image passed into `rembg` is downsized using `EYESARIWA_REMBG_MAX_DIMENSION` with a default of `768`. If Render still cannot return results reliably, set `EYESARIWA_ENABLE_REMBG=false` as an emergency fallback. That fallback is faster, but it should be paired with a matching center-crop generated baseline before final study use.

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
- a cut-specific aggregate `reference_data.generated.json` baseline candidate
- a copy-ready `reference_data.json` baseline candidate in the output folder
- a QA report for failed images, missing groups, and low sample counts

Only verified `fresh` records are used to generate each species/cut backend baseline. Fresh records are also grouped by lighting for analysis, but `/classify` uses the aggregate species/cut Fresh baseline only. `experimental` folders are treated as study metadata and are not treated as validated Suspicious or Stale labels.

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
