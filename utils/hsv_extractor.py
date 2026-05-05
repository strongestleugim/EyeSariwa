from io import BytesIO

import cv2
import numpy as np
from PIL import Image


FOREGROUND_ALPHA_THRESHOLD = 10
MIN_FOREGROUND_PIXELS = 100


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

        h_mean, s_mean, v_mean = np.mean(crop, axis=(0, 1))
        return {
            "H": float(h_mean),
            "S": float(s_mean),
            "V": float(v_mean),
        }
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

        h_mean, s_mean, v_mean = np.mean(foreground_pixels, axis=0)
        return {
            "H": float(h_mean),
            "S": float(s_mean),
            "V": float(v_mean),
        }
    except Exception as exc:
        raise ValueError("Could not extract HSV values from foreground.") from exc
