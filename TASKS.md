# TASKS.md - EyeSariwa Backend-First Task List

EyeSariwa must be built in small, testable backend-first phases. Do not implement frontend UI screens, camera capture, upload, HSV extraction, classification, or PWA behavior before their assigned tasks.

## Required Task Sequence

1. Project foundation
2. Backend API skeleton
3. Backend input validation utility
4. HSV extraction utility
5. Z-score classification utility
6. Backend QA and API contract report
7. Render deployment readiness

## 1. Project Foundation

Goal:

Create the initial Flask repository structure and placeholder files.

Required files:

- app.py
- requirements.txt
- Procfile
- reference_data.json
- AGENTS.md
- PROJECT_CONTEXT.md
- TASKS.md
- README.md
- templates/index.html
- static/css/style.css
- static/js/main.js
- static/js/sw.js
- static/offline.html
- utils/__init__.py

Acceptance criteria:

- `python app.py` runs locally.
- GET `/` displays a placeholder EyeSariwa page.
- GET `/health` returns `{ "status": "ok" }`.
- `requirements.txt` contains only Flask, Flask-CORS, and Gunicorn.
- `Procfile` contains exactly `web: gunicorn app:app`.
- No image processing is implemented.
- No frontend app UI is implemented.
- No service worker behavior is implemented.

## 2. Backend API Skeleton

Goal:

Add the future `/classify` endpoint with request-field validation and placeholder output.

Acceptance criteria:

- POST `/classify` accepts multipart/form-data.
- Missing image, species, or cut returns a clear JSON error.
- Invalid species or cut returns a clear JSON error.
- Invalid species/cut pairing returns a clear JSON error.
- Valid requests return placeholder classification JSON.
- No image processing is implemented in this phase.

## 3. Backend Input Validation Utility

Goal:

Add backend image validation and compression in `utils/input_validator.py`.

Acceptance criteria:

- Enforces an image size limit.
- Rejects empty or invalid images.
- Converts valid images into a consistent compressed format.
- Integrates with `/classify`.

## 4. HSV Extraction Utility

Goal:

Add HSV extraction in `utils/hsv_extractor.py`.

Acceptance criteria:

- Decodes validated image bytes.
- Extracts center-crop HSV means.
- Returns H, S, and V values.
- Integrates with `/classify`.

## 5. Z-Score Classification Utility

Goal:

Add statistical classification in `utils/zscore.py`.

Acceptance criteria:

- Loads `reference_data.json`.
- Computes H, S, and V Z-scores.
- Computes an anomaly score.
- Returns FRESH, SUSPICIOUS, or STALE.
- Preserves the API response contract.

## 6. Backend QA and API Contract Report

Goal:

Test backend behavior and document contract compliance.

Acceptance criteria:

- `/health` test passes.
- `/classify` validation tests pass in Postman or equivalent.
- Success and error response shapes match the contract.
- Scope-safe wording is preserved.

## 7. Render Deployment Readiness

Goal:

Prepare the backend for Render deployment.

Acceptance criteria:

- `Procfile` is correct.
- `requirements.txt` is complete for the current backend phase.
- Flask app instance is named `app`.
- Static and template files are served correctly.
- Render deployment notes are documented.
