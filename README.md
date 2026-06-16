# EyeSariwa

EyeSariwa is a mobile-first Progressive Web Application for visual meat surface freshness assessment.

It is intended to help wet market consumers assess visible surface freshness signals from selected raw beef, pork, and chicken cuts. EyeSariwa is a supplementary tool and does not replace official meat inspection.

## Scope Limitations

EyeSariwa checks visible surface freshness signals only.

It does not:

- determine complete meat safety
- detect chemical adulterants
- detect bacteria
- detect internal spoilage
- replace official meat inspection
- support unsupported meat types or cuts

## Supported Meat Types and Cuts

Beef:

- Beef Shank
- Beef Sirloin

Pork:

- Pork Belly
- Pork Chop

Chicken:

- Chicken Drumstick
- Chicken Breast

## Stack

Backend:

- Python 3.11+
- Flask 3.x
- Flask-CORS
- Gunicorn
- Pillow
- OpenCV headless
- NumPy

Frontend later:

- HTML5
- CSS3
- Vanilla JavaScript

Data:

- reference_data.json

Deployment and testing:

- Render
- Postman

## Local Setup

Create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

## How to Run

Start the local Flask server:

```powershell
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

Then test:

```text
http://127.0.0.1:5000/health
```

## Health Endpoint

GET `/health`

Expected response:

```json
{
  "status": "ok"
}
```

## Classify Endpoint

POST `/classify`

Request type:

```text
multipart/form-data
```

Required fields:

- `image`: image file
- `species`: `beef`, `pork`, or `chicken`
- `cut`: `beef_shank`, `beef_sirloin`, `pork_belly`, `pork_chop`, `chicken_drumstick`, or `chicken_breast`

Expected success response:

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

Expected classification values:

- FRESH
- SUSPICIOUS
- STALE

Expected error response:

```json
{
  "error": "Clear human-readable error message"
}
```

The current backend validates the request, validates and compresses the image, extracts center-crop HSV values from the user-framed meat crop, and classifies against the cut-specific `just_flash` daylight Fresh baseline in `reference_data.json`.

The frontend asks the user to aim the meat inside a fixed crop box before submitting. The backend receives that meat-filled crop and no longer uses `rembg` at runtime.

The current baseline values were originally generated with offline `rembg` meat isolation, but the runtime manual-aim center-crop path is metadata-stamped as compatible with that baseline:

```text
_pipeline_version: eyesariwa-hsv-zscore-v4
_rembg_enabled: false
runtime_extraction_method: manual_aim_center_crop
```

Classification compares the uploaded HSV values against the `just_flash` Fresh baseline for the selected species/cut. Other lighting baselines are retained in `reference_data.json` for analysis only and do not affect `/classify`. The score uses circular Hue distance, minimum standard-deviation floors for H, S, and V, and a weighted Euclidean anomaly score with a provisional lower weight for V because brightness is highly illumination-dependent. Current score thresholds remain `FRESH <= 2.0`, `SUSPICIOUS <= 4.0`, and `STALE > 4.0`.

## Postman Test

Use `POST http://127.0.0.1:5000/classify` with body type `form-data`.

Required fields:

- `image`: file upload
- `species`: `beef`, `pork`, or `chicken`
- `cut`: one supported cut matching the selected species

Example valid values:

```text
species: beef
cut: beef_sirloin
```

The response should include `species`, `cut`, `classification`, `score`, `z_scores`, and `hsv_means`.

## Reference Data Builder

The backend includes a utility script for building HSV analysis outputs from collected study images.

Expected image folder structure:

```text
dataset/
  beef/
    beef_shank/
      fresh/
        just_flash/
          image-001.jpg
        cool_lighting/
          image-002.jpg
      experimental/
        air_exposure/
          just_flash/
            1hr/
              image-003.jpg
    beef_sirloin/
      fresh/
        just_flash/
          image-004.jpg
  pork/
    pork_belly/
      fresh/
        just_flash/
          image-005.jpg
  chicken/
    chicken_breast/
      fresh/
        just_flash/
          image-006.jpg
```

The first three folder levels are required:

- `species`: `beef`, `pork`, or `chicken`
- `cut`: one supported cut matching the species
- `dataset_category`: `fresh` or `experimental`

Fresh records use lighting folders:

```text
dataset/species/cut/fresh/lighting/image.jpg
```

Experimental records are treated as study metadata, not final labels:

```text
dataset/species/cut/experimental/condition/lighting/exposure_time/image.jpg
```

Run the builder:

```powershell
python -m utils.reference_builder --dataset-dir dataset --output-dir outputs/reference_builder
```

Reference rebuilding from the raw dataset is a developer-only workflow and requires `rembg` installed locally. The deployed runtime does not need `rembg` or ONNX Runtime.

By default, the generated runtime baseline uses the verified `fresh/just_flash` records for each species/cut. The generated `reference_data.json` also includes separate fresh lighting baselines for `warm_lighting`, `cool_lighting`, and `red_lighting`, but those non-daylight groups are analysis-only and are not used by `/classify`. `experimental` records are excluded from the baseline and kept for per-image analysis only.

Outputs:

- `per_image_hsv.csv`: per-image HSV values, metadata, Z-scores, deviation scores, and computed classifications for spreadsheet analysis
- `per_image_hsv.json`: per-image HSV values, metadata, Z-scores, deviation scores, and computed classifications for JSON analysis
- `hsv_method`: included per image for development reference-building analysis
- `grouped_statistics.json`: grouped means and standard deviations by species, cut, dataset category, lighting, and experimental condition
- `analysis_report.json`: dataset-category and lighting-level computed-classification counts, median scores, and experimental condition counts
- `reference_data.generated.json`: generated daylight baseline candidate for the backend
- `reference_data.json`: copy-ready generated baseline candidate in the output folder
- `qa_report.json`: failed images, missing groups, and low-sample warnings

Review `qa_report.json` before replacing the root `reference_data.json`. The current root reference values are generated from the collected dataset and should still be treated as preliminary until validated.

## Render Deployment

Create a Render Web Service from the GitHub repository.

Use these settings:

```text
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

No `rembg` or ONNX Runtime environment variables are required.

The repository also includes this `Procfile`:

```text
web: gunicorn app:app
```

After deployment, test:

```text
https://your-render-service.onrender.com/
https://your-render-service.onrender.com/health
```

Then test `/classify` in Postman using the deployed URL:

```text
POST https://your-render-service.onrender.com/classify
```

Render free-tier services may sleep after inactivity. The first request after sleep may take longer while the server starts again.

No `.env` file or secrets are required for the current prototype.
