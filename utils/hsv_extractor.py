from io import BytesIO

import cv2
import numpy as np
from PIL import Image


FOREGROUND_ALPHA_THRESHOLD = 10
MIN_FOREGROUND_PIXELS = 100
OPENCV_HUE_RANGE = 180.0
RED_WRAP_CANONICAL_THRESHOLD = 150.0


def canonicalize_hue_mean(hue_mean: float) -> float:
    if hue_mean > RED_WRAP_CANONICAL_THRESHOLD:
        return OPENCV_HUE_RANGE - hue_mean
    return hue_mean


def calculate_circular_hue_mean(hue_values) -> float:
    hue = np.asarray(hue_values, dtype=np.float64)
    # OpenCV hue uses 0..180 for a full 0..360 degree color wheel, so Hue
    # must be averaged circularly.
    angles = hue * (2.0 * np.pi / OPENCV_HUE_RANGE)
    mean_angle = np.arctan2(np.sin(angles).mean(), np.cos(angles).mean())
    h_mean = (np.degrees(mean_angle) % 360.0) / 2.0
    return float(canonicalize_hue_mean(h_mean))


def calculate_hsv_means(hsv_pixels: np.ndarray) -> dict:
    return {
        "H": calculate_circular_hue_mean(hsv_pixels[..., 0]),
        "S": float(hsv_pixels[..., 1].mean()),
        "V": float(hsv_pixels[..., 2].mean()),
    }


def extract_hsv_means(image_bytes: bytes) -> dict:
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image.load()
            image_rgb = image.convert("RGB")

        rgb_array = np.array(image_rgb)
        # Pillow gives RGB channel order; OpenCV needs that stated explicitly.
        hsv_image = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2HSV)

        height, width = hsv_image.shape[:2]
        crop = hsv_image[height // 4 : 3 * height // 4, width // 4 : 3 * width // 4]
        if crop.size == 0:
            raise ValueError

        return calculate_hsv_means(crop)
    except Exception as exc:
        raise ValueError("Could not extract HSV values from image.") from exc


def extract_hsv_means_from_foreground(image_bytes: bytes) -> dict:
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image.load()
            image_rgba = image.convert("RGBA")

        rgba_array = np.array(image_rgba)
        rgb_array = rgba_array[:, :, :3]
        alpha_mask = rgba_array[:, :, 3] > FOREGROUND_ALPHA_THRESHOLD

        if int(np.count_nonzero(alpha_mask)) < MIN_FOREGROUND_PIXELS:
            raise ValueError

        # Convert only after building the alpha mask so transparent background
        # pixels do not influence the HSV mean.
        hsv_image = cv2.cvtColor(rgb_array, cv2.COLOR_RGB2HSV)
        foreground_pixels = hsv_image[alpha_mask]

        return calculate_hsv_means(foreground_pixels)
    except Exception as exc:
        raise ValueError("Could not extract HSV values from foreground.") from exc
