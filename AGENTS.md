# AGENTS.md - EyeSariwa Development Rules

This file contains permanent development instructions for Codex and contributors working on EyeSariwa.

## Project Scope

EyeSariwa is a mobile-first Progressive Web Application for visual meat surface freshness assessment.

EyeSariwa checks visible surface freshness signals only. It does not determine complete food safety and does not replace official meat inspection.

## Scope-Safe Wording

Never use these phrases in user-facing product wording:

- safe to eat
- safe to purchase

Use wording that makes the limit clear:

- visible surface freshness
- surface freshness signal
- surface color appears consistent with fresh meat
- use caution before purchase
- avoid purchase
- does not replace official meat inspection
- based on visible surface freshness signals only

## Classification States

Use only these classifications:

- Fresh
- Suspicious
- Stale

Backend API values may use uppercase:

- FRESH
- SUSPICIOUS
- STALE

Do not add other classification labels without explicit approval.

## Supported Stack

Keep the stack simple and beginner-maintainable:

- Backend: Flask, Flask-CORS, Gunicorn
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Data: JSON files
- History: browser localStorage
- Testing: local Flask server and Postman
- Deployment: Render

Do not add React, Vue, Angular, Django, FastAPI, Firebase, a database, authentication, native mobile tooling, machine learning training, or cloud file storage unless explicitly requested.

## Ownership

Codex owns backend and system files unless otherwise instructed:

- app.py
- utils/
- requirements.txt
- Procfile
- reference_data.json
- backend API behavior
- deployment readiness

Claude may later own frontend and UI files:

- templates/index.html
- static/css/style.css
- static/js/main.js
- static/js/sw.js
- static/offline.html
- manifest.json

## API Contract

The API contract must not change without explicit approval.

Future primary endpoint:

POST /classify

Required multipart/form-data fields:

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

Expected classification values:

- FRESH
- SUSPICIOUS
- STALE

## Development Rules

- Build in small modules.
- Keep code simple, readable, and beginner-maintainable.
- Do not implement future phases early.
- Do not change architecture without explicit approval.
- Do not introduce dependencies without explaining why.
- Before edits, inspect the repository and read project instruction files.
- After each task, summarize files changed, what was implemented, how to test, known limitations, and assumptions.
