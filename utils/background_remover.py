import os
from io import BytesIO

import cv2
import numpy as np
from PIL import Image

from utils.hsv_extractor import (
    FOREGROUND_ALPHA_THRESHOLD,
    MIN_FOREGROUND_PIXELS,
    extract_hsv_means,
    extract_hsv_means_from_foreground,
)


REMBG_MODEL = os.getenv("EYESARIWA_REMBG_MODEL", "u2netp")
ENABLE_REMBG_VALUES = {"1", "true", "yes", "on"}
COMPONENT_ALPHA_THRESHOLD = 128
FOREGROUND_CROP_PADDING_RATIO = 0.08
FOREGROUND_CROP_MIN_PADDING = 12

_SESSION = None


def get_positive_int_env(name: str, default: int) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        return default
    return value if value > 0 else default


REMBG_MAX_DIMENSION = get_positive_int_env("EYESARIWA_REMBG_MAX_DIMENSION", 768)


def is_rembg_enabled() -> bool:
    return os.getenv("EYESARIWA_ENABLE_REMBG", "true").strip().lower() in ENABLE_REMBG_VALUES


def get_rembg_session():
    global _SESSION
    if _SESSION is None:
        try:
            from rembg import new_session
        except ImportError as exc:
            raise ValueError("Background removal dependency is not installed.") from exc

        _SESSION = new_session(REMBG_MODEL)
    return _SESSION


def remove_background(image_bytes: bytes) -> bytes:
    if not image_bytes:
        raise ValueError("Image file is empty.")

    try:
        from rembg import remove

        foreground_bytes = remove(resize_for_rembg(image_bytes), session=get_rembg_session())
        return keep_largest_foreground_component(foreground_bytes)
    except Exception as exc:
        raise ValueError("Background removal failed.") from exc


def resize_for_rembg(image_bytes: bytes) -> bytes:
    with Image.open(BytesIO(image_bytes)) as image:
        image.load()
        image_rgb = image.convert("RGB")

    longest_edge = max(image_rgb.size)
    if longest_edge <= REMBG_MAX_DIMENSION:
        return image_bytes

    scale = REMBG_MAX_DIMENSION / longest_edge
    new_size = (
        max(1, int(image_rgb.width * scale)),
        max(1, int(image_rgb.height * scale)),
    )
    resized_image = image_rgb.resize(new_size, Image.LANCZOS)

    output = BytesIO()
    resized_image.save(output, format="JPEG", quality=90)
    return output.getvalue()


def keep_largest_foreground_component(image_bytes: bytes) -> bytes:
    with Image.open(BytesIO(image_bytes)) as image:
        image.load()
        image_rgba = image.convert("RGBA")

    rgba_array = np.array(image_rgba)
    alpha_mask = (rgba_array[:, :, 3] > COMPONENT_ALPHA_THRESHOLD).astype("uint8")

    label_count, labels, stats, _centroids = cv2.connectedComponentsWithStats(
        alpha_mask,
        connectivity=8,
    )
    if label_count <= 1:
        raise ValueError("No foreground region found after background removal.")

    foreground_areas = stats[1:, cv2.CC_STAT_AREA]
    largest_label = int(np.argmax(foreground_areas)) + 1
    largest_area = int(foreground_areas[largest_label - 1])
    if largest_area < MIN_FOREGROUND_PIXELS:
        raise ValueError("Foreground region is too small after background removal.")

    largest_mask = (labels == largest_label).astype("uint8")
    kernel = np.ones((5, 5), dtype="uint8")
    largest_mask = cv2.dilate(largest_mask, kernel, iterations=2).astype(bool)

    rgba_array[:, :, 3] = np.where(largest_mask, rgba_array[:, :, 3], 0)
    cropped_rgba = crop_to_foreground_bounds(rgba_array, largest_mask)

    output = BytesIO()
    Image.fromarray(cropped_rgba, mode="RGBA").save(output, format="PNG")
    return output.getvalue()


def crop_to_foreground_bounds(
    rgba_array: np.ndarray,
    foreground_mask: np.ndarray,
) -> np.ndarray:
    foreground_points = np.argwhere(foreground_mask)
    if foreground_points.size == 0:
        raise ValueError("No foreground region found after background removal.")

    y_min, x_min = foreground_points.min(axis=0)
    y_max, x_max = foreground_points.max(axis=0)

    foreground_height = int(y_max - y_min + 1)
    foreground_width = int(x_max - x_min + 1)
    padding = max(
        FOREGROUND_CROP_MIN_PADDING,
        int(max(foreground_height, foreground_width) * FOREGROUND_CROP_PADDING_RATIO),
    )

    image_height, image_width = foreground_mask.shape
    top = max(int(y_min) - padding, 0)
    bottom = min(int(y_max) + padding + 1, image_height)
    left = max(int(x_min) - padding, 0)
    right = min(int(x_max) + padding + 1, image_width)

    if top >= bottom or left >= right:
        raise ValueError("Foreground crop is invalid after background removal.")

    return rgba_array[top:bottom, left:right, :]


def extract_hsv_with_rembg_fallback(image_bytes: bytes) -> tuple[dict, str]:
    if not is_rembg_enabled():
        hsv_means = extract_hsv_means(image_bytes)
        return hsv_means, "center_crop_rembg_disabled"

    try:
        foreground_bytes = remove_background(image_bytes)
        hsv_means = extract_hsv_means_from_foreground(foreground_bytes)
        return hsv_means, "rembg"
    except ValueError:
        hsv_means = extract_hsv_means(image_bytes)
        return hsv_means, "center_crop_fallback"
