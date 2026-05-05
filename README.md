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
- rembg
- ONNX Runtime

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

The current backend validates the request, validates and compresses the image, tries `rembg` foreground extraction, keeps the largest foreground component, crops to the foreground bounding box with padding, falls back to center-crop HSV extraction if needed, and classifies against cut-specific fresh lighting baselines in `reference_data.json`.

Classification compares the uploaded HSV values against `just_flash`, `warm_lighting`, `cool_lighting`, and `red_lighting` fresh baselines for the selected species/cut, then uses the lowest anomaly score. It uses circular Hue distance for OpenCV HSV values and a minimum Hue standard deviation so small Hue changes do not dominate the result. Current score thresholds are `FRESH <= 2.0`, `SUSPICIOUS <= 4.0`, and `STALE > 4.0`.

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

By default, the generated fresh baseline uses only verified `fresh` records and groups them by species, cut, and lighting. The generated `reference_data.json` includes separate fresh lighting baselines for `just_flash`, `warm_lighting`, `cool_lighting`, and `red_lighting`. `experimental` records are excluded from the baseline and kept for per-image analysis only.

Outputs:

- `per_image_hsv.csv`: per-image HSV values, metadata, Z-scores, deviation scores, and computed classifications for spreadsheet analysis
- `per_image_hsv.json`: per-image HSV values, metadata, Z-scores, deviation scores, and computed classifications for JSON analysis
- `hsv_method`: included per image as `rembg` or `center_crop_fallback`
- `grouped_statistics.json`: grouped means and standard deviations by species, cut, dataset category, lighting, and experimental condition
- `analysis_report.json`: dataset-category counts, computed-classification counts, and experimental condition counts
- `reference_data.generated.json`: generated lighting-aware baseline candidate for the backend
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

The first request that uses background removal may also take longer because `rembg` downloads and loads the `u2netp` model.

No `.env` file or secrets are required for the current prototype.
