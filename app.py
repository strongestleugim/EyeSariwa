import logging

from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS

from utils.background_remover import (
    extract_hsv_with_rembg_fallback,
    get_rembg_session,
    is_rembg_enabled,
)
from utils.hsv_extractor import extract_hsv_means
from utils.input_validator import validate_and_compress
from utils.zscore import classify_hsv, load_reference_data, reference_requires_rembg


ALLOWED_SPECIES = {"beef", "pork", "chicken"}

ALLOWED_CUTS = {
    "beef_shank",
    "beef_sirloin",
    "pork_belly",
    "pork_chop",
    "chicken_drumstick",
    "chicken_breast",
}

SPECIES_TO_CUTS = {
    "beef": {"beef_shank", "beef_sirloin"},
    "pork": {"pork_belly", "pork_chop"},
    "chicken": {"chicken_drumstick", "chicken_breast"},
}

app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app)


REMBG_CONTRACT_ERROR = (
    "The meat surface could not be isolated from the background. "
    "Please try again in better lighting."
)


def warm_up_rembg() -> None:
    if not is_rembg_enabled():
        app.logger.warning(
            "rembg warmup skipped because EYESARIWA_ENABLE_REMBG is disabled."
        )
        return

    try:
        get_rembg_session()
    except ValueError as error:
        app.logger.error("rembg startup warmup failed: %s", error)
    else:
        app.logger.info("rembg startup warmup completed.")


warm_up_rembg()


@app.get("/")
def index():
    return render_template("index.html")


# Serve the service worker from the root path so its scope covers the
# entire origin (/). A SW at /static/js/sw.js would be limited to the
# /static/js/ sub-path by default, which is too narrow.
@app.get("/sw.js")
def service_worker():
    return send_from_directory("static/js", "sw.js",
                               mimetype="application/javascript")


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/classify")
def classify():
    image = request.files.get("image")
    if image is None or image.filename == "":
        return jsonify({"error": "No image file provided."}), 400

    species = request.form.get("species", "").strip()
    if not species:
        return jsonify({"error": "No meat type provided."}), 400

    if species not in ALLOWED_SPECIES:
        return jsonify({"error": "Invalid meat type. Must be beef, pork, or chicken."}), 400

    cut = request.form.get("cut", "").strip()
    if not cut:
        return jsonify({"error": "No cut provided."}), 400

    if cut not in ALLOWED_CUTS:
        return jsonify({"error": "Invalid cut selected."}), 400

    if cut not in SPECIES_TO_CUTS[species]:
        return jsonify({"error": "Selected cut does not match selected meat type."}), 400

    image_bytes = image.read()
    try:
        reference_data = load_reference_data()
        requires_rembg = reference_requires_rembg(reference_data)
        compressed_image_bytes = validate_and_compress(image_bytes)

        if requires_rembg:
            hsv_means, hsv_method = extract_hsv_with_rembg_fallback(compressed_image_bytes)
            app.logger.info(
                "HSV extraction method=%s for species=%s cut=%s.",
                hsv_method,
                species,
                cut,
            )
            if hsv_method != "rembg":
                app.logger.warning(
                    "HSV extraction contract mismatch method=%s for species=%s cut=%s; "
                    "active baseline requires rembg.",
                    hsv_method,
                    species,
                    cut,
                )
                raise ValueError(REMBG_CONTRACT_ERROR)
        else:
            hsv_means = extract_hsv_means(compressed_image_bytes)
            hsv_method = "center_crop_baseline"
            app.logger.info(
                "HSV extraction method=%s for species=%s cut=%s.",
                hsv_method,
                species,
                cut,
            )
        result = classify_hsv(hsv_means, species, cut)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(
        {
            "species": species,
            "cut": cut,
            "classification": result["classification"],
            "score": result["score"],
            "z_scores": result["z_scores"],
            "hsv_means": hsv_means,
        }
    )


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
