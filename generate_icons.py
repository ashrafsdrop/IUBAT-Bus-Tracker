import os
from PIL import Image

src = r"C:\Users\User\.gemini\antigravity\brain\587854b7-0ffe-4569-9bd3-25f3693ada83\media__1782715202200.png"
dst_base = r"d:\Android app\bus_tracker\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

try:
    img = Image.open(src)
    width, height = img.size
    
    # We will manually crop it extremely tight to the center rounded square.
    # It appears the logo has about ~20px of margin on the left and right.
    margin_x = 25
    logo_size = width - (margin_x * 2)
    
    left = margin_x
    right = width - margin_x
    
    # Vertically center it
    center_y = height / 2
    top = center_y - (logo_size / 2)
    bottom = center_y + (logo_size / 2)

    img = img.crop((left, top, right, bottom))
    
    # Resize and save
    for folder, dim in sizes.items():
        folder_path = os.path.join(dst_base, folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            
        resized_img = img.resize((dim, dim), Image.Resampling.LANCZOS)
        
        # Save standard and round icons
        out1 = os.path.join(folder_path, "ic_launcher.png")
        out2 = os.path.join(folder_path, "ic_launcher_round.png")
        resized_img.save(out1)
        resized_img.save(out2)
        print(f"Saved maximally zoomed {dim}x{dim} to {folder}")
        
    print("Success! Logo is now huge.")
except Exception as e:
    print("Error:", e)
