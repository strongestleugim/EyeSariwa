# CLAUDE.md - EyeSariwa Frontend Instructions

This file contains permanent frontend development instructions for Claude working on EyeSariwa.

---

## 1. Project Identity

EyeSariwa is a mobile-first Progressive Web Application for visual meat surface freshness assessment. It helps wet market consumers assess visible surface freshness signals from selected raw beef, pork, and chicken cuts. It is a supplementary consumer-side tool and does not replace official meat inspection.

---

## 2. Frontend Stack

Build only with:

- HTML5
- CSS3
- Vanilla JavaScript
- MediaDevices Web API (camera capture)
- Fetch API (backend communication)
- Service Worker (PWA offline support)
- localStorage (scan history)

---

## 3. Do Not Add

Never introduce:

- React
- Vue
- Angular
- Tailwind
- Bootstrap
- jQuery
- Any CSS framework or component library
- Any database or backend store
- Authentication or user accounts
- Native app tooling (Capacitor, Cordova, Expo, React Native)
- Backend classification logic
- Machine learning model training or inference
- Cloud file storage

---

## 4. UI Direction

- Mobile-first layout. Design for a 390px viewport first, then scale up.
- Clean white background (`#ffffff`).
- Green primary brand color (`#16803c`).
- Dark readable text (`#1f2933`).
- Muted secondary text (`#52606d`).
- Rounded cards with subtle shadow for content grouping.
- Large, touch-friendly buttons (minimum 48px tap target height).
- Modern, consumer-facing UI. Friendly public-health utility style.
- No school branding.
- No government seals.
- No university logos.
- No bottom navigation bar.
- No framework-specific component patterns.

---

## 5. Status Colors

Map classification values to these UI colors:

| Classification | Color family   | Use for                                   |
|---------------|----------------|-------------------------------------------|
| FRESH         | Green          | Icon, badge, result card accent           |
| SUSPICIOUS    | Amber / yellow-orange | Icon, badge, result card accent    |
| STALE         | Red            | Icon, badge, result card accent           |

Keep exact hex values consistent with the design system defined in `style.css`.

---

## 6. Scope-Safe Wording

### Never use these phrases in any user-facing text:

- safe to eat
- safe to purchase
- guaranteed fresh
- detects bacteria
- detects botcha
- detects formalin
- detects chemicals
- replaces official inspection
- food safety test
- certified fresh

### Always use scope-safe alternatives:

- visible surface freshness
- surface freshness signal
- surface color appears consistent with fresh meat
- still inspect carefully before purchase
- use caution before purchase
- avoid purchase
- does not replace official meat inspection
- based on visible surface freshness signals only
- supplementary consumer tool

Apply these rules to all screens, result cards, tooltips, modals, disclaimers, and error messages.

---

## 7. Supported Meat Types and Cuts

Species and their valid cuts:

| Species  | Cut               | Display label      |
|----------|-------------------|--------------------|
| beef     | beef_shank        | Beef Shank         |
| beef     | beef_sirloin      | Beef Sirloin       |
| pork     | pork_belly        | Pork Belly         |
| pork     | pork_chop         | Pork Chop          |
| chicken  | chicken_drumstick | Chicken Drumstick  |
| chicken  | chicken_breast    | Chicken Breast     |

Do not add more species or cuts without explicit approval.

---

## 8. Fixed Backend API Contract

Do not change the API contract without explicit approval.

**Endpoint:**

```
POST /classify
```

**Request type:**

```
multipart/form-data
```

**Required fields:**

| Field   | Type        | Values                                                              |
|---------|-------------|---------------------------------------------------------------------|
| image   | file        | Image file (JPEG or PNG)                                            |
| species | string      | `beef`, `pork`, or `chicken`                                        |
| cut     | string      | `beef_shank`, `beef_sirloin`, `pork_belly`, `pork_chop`, `chicken_drumstick`, or `chicken_breast` |

**Success response (HTTP 200):**

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

**Classification values returned by the backend:**

- `FRESH`
- `SUSPICIOUS`
- `STALE`

**Error response (HTTP 400):**

```json
{
  "error": "Clear human-readable error message"
}
```

**Routes served by Flask:**

| Method | Path       | Description                      |
|--------|------------|----------------------------------|
| GET    | `/`        | Serves `templates/index.html`    |
| GET    | `/health`  | Returns `{ "status": "ok" }`     |
| POST   | `/classify`| Classification endpoint          |

---

## 9. Final Frontend Screens and States

Implement all of these screens and states. Do not skip any.

| Screen / State                      | Description                                                                    |
|-------------------------------------|--------------------------------------------------------------------------------|
| Loading Screen                      | Shown briefly while the app initialises                                        |
| Main Screen                         | Home screen with Scan and History entry points                                 |
| History — no data                   | History view when localStorage has no saved scans                              |
| History — with data                 | History view listing past scan results from localStorage                       |
| Select Meat Type                    | Step 1 of scan flow — user picks beef, pork, or chicken                        |
| Select Cut                          | Step 2 of scan flow — user picks a cut matching the selected species           |
| Before You Scan                     | Pre-scan guidance screen with framing tips and scope disclaimer                |
| Scan Meat Surface                   | Camera capture screen using MediaDevices Web API                               |
| Analyzing Image                     | Loading/processing state shown while the Fetch request is in flight            |
| Scan Result — Fresh                 | Result screen when classification is FRESH                                     |
| Scan Result — Suspicious            | Result screen when classification is SUSPICIOUS                                |
| Scan Result — Stale                 | Result screen when classification is STALE                                     |
| PWA — Offline                       | Shown by service worker when the device is offline (`static/offline.html`)     |
| PWA — Page Did Not Load             | Shown when the page fails to load (network error, not offline)                 |
| PWA — Taking Too Long               | Shown when the server response exceeds a timeout threshold                     |
| PWA — Server Temporarily Unavailable | Shown when the backend returns a 5xx error                                   |

---

## 10. Frontend File Ownership

Claude owns and is responsible for:

- `templates/index.html`
- `static/css/style.css`
- `static/js/main.js`
- `static/js/sw.js`
- `static/offline.html`
- `manifest.json` (when needed for PWA installability)
- `static/assets/*` (icons, images, and other static assets)

Claude must not modify backend-owned files unless there is a small API path or CORS compatibility issue that cannot be fixed from the frontend. If a backend change is needed, explain it clearly before making the edit.

Backend-owned files (do not edit):

- `app.py`
- `utils/`
- `requirements.txt`
- `Procfile`
- `reference_data.json`

---

## 11. Development Rules

- Inspect the repository and read all project instruction files before editing.
- Build in small, testable increments. Implement one screen or state at a time.
- Keep code simple and beginner-maintainable. No clever abstractions.
- Do not implement future screens or phases before their assigned task.
- Do not change architecture without explicit approval.
- Do not introduce external dependencies.
- After each task, summarize: files changed, what was implemented, how to test, known limitations, and assumptions made.
- Always apply scope-safe wording rules. Review user-facing text before committing.
- Test on a 390px mobile viewport before reporting a task complete.
