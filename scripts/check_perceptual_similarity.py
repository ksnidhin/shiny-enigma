import zipfile
import sys
from PIL import Image
import io

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

def dhash(image, hash_size=8):
    # Grayscale and resize to (hash_size + 1, hash_size)
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(image.getdata())
    # Compare adjacent pixels
    difference = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = pixels[row * (hash_size + 1) + col]
            pixel_right = pixels[row * (hash_size + 1) + col + 1]
            difference.append(pixel_left > pixel_right)
    return sum([2 ** i for (i, v) in enumerate(difference) if v])

def hamming_distance(h1, h2):
    return bin(h1 ^ h2).count('1')

vps_img = Image.open("tmp_vps_images/rtc_timex_main.webp")
vps_hash = dhash(vps_img)

posts_to_check = [5, 11, 17, 25, 42, 43, 46, 48, 52, 59, 70]
with zipfile.ZipFile(r"C:\Users\PC\Downloads\rtc100.zip", "r") as z:
    for pidx in posts_to_check:
        fname = f"images/post_{pidx:03d}/01.jpg"
        if fname in z.namelist():
            data = z.read(fname)
            z_img = Image.open(io.BytesIO(data))
            z_hash = dhash(z_img)
            dist = hamming_distance(vps_hash, z_hash)
            print(f"Post {pidx:03d} image hamming distance to VPS watch: {dist}")
