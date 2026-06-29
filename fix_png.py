import os
from PIL import Image

filepath = r"d:\Android app\bus_tracker\src\screens\assets\iubat-logo.png"

try:
    img = Image.open(filepath)
    img.save(filepath, format="PNG")
    print("Successfully re-saved image as a valid PNG.")
except Exception as e:
    print(f"Error: {e}")
