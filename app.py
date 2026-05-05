from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS

from utils.background_remover import extract_hsv_with_rembg_fallback
from utils.input_validator import validate_and_compress
from utils.zscore import classify_hsv


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
CORS(app)


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
        compressed_image_bytes = validate_and_compress(image_bytes)
        hsv_means, _hsv_method = extract_hsv_with_rembg_fallback(compressed_image_bytes)
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
