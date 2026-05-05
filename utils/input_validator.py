from io import BytesIO

from PIL import Image, UnidentifiedImageError


MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
TARGET_MAX_DIMENSION = 1280
JPEG_QUALITY = 85


def validate_and_compress(image_bytes: bytes) -> bytes:
    if not image_bytes:
        raise ValueError("Image file is empty.")

    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise ValueError("Image too large. Maximum allowed size is 5 MB.")

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            image.load()
            image = image.convert("RGB")

            width, height = image.size
            longest_edge = max(width, height)
            if longest_edge > TARGET_MAX_DIMENSION:
                scale = TARGET_MAX_DIMENSION / longest_edge
                new_size = (round(width * scale), round(height * scale))
                image = image.resize(new_size, Image.LANCZOS)

            output = BytesIO()
            image.save(output, format="JPEG", quality=JPEG_QUALITY)
            return output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError("Invalid image file. Please upload a valid image.") from exc
