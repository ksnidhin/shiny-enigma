import json
import zipfile
import hashlib
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
vps_json_path = "apps/backend/data/live_watches.vps_sync.json"

with open(vps_json_path, "r", encoding="utf-8") as f:
    existing_watches = json.load(f)

# Collect all image hashes in existing uploads locally if present
local_uploads_dir = "apps/storefront/public/uploads"
existing_image_hashes = {}
if os.path.exists(local_uploads_dir):
    for fname in os.listdir(local_uploads_dir):
        fpath = os.path.join(local_uploads_dir, fname)
        if os.path.isfile(fpath):
            with open(fpath, "rb") as f:
                h = hashlib.sha256(f.read()).hexdigest()
                existing_image_hashes[h] = fname

print(f"Total local uploads hashed: {len(existing_image_hashes)}")

# Hash images in the ZIP
zip_image_hashes = {}
with zipfile.ZipFile(zip_path, "r") as z:
    for name in z.namelist():
        if name.endswith(".jpg") or name.endswith(".webp") or name.endswith(".png"):
            data = z.read(name)
            h = hashlib.sha256(data).hexdigest()
            zip_image_hashes[name] = h

print(f"Total zip images hashed: {len(zip_image_hashes)}")

# Check for duplicate hashes across zip images
hash_to_names = {}
for name, h in zip_image_hashes.items():
    hash_to_names.setdefault(h, []).append(name)

duplicates_in_zip = {h: names for h, names in hash_to_names.items() if len(names) > 1}
print(f"Duplicate images inside zip itself: {len(duplicates_in_zip)}")
for h, names in duplicates_in_zip.items():
    print("  Same photo used in:", names)

# Check overlap with local uploads
matches_with_existing_uploads = []
for name, h in zip_image_hashes.items():
    if h in existing_image_hashes:
        matches_with_existing_uploads.append((name, existing_image_hashes[h]))

print(f"Exact image matches with existing uploads: {len(matches_with_existing_uploads)}")
for zname, ename in matches_with_existing_uploads:
    print(f"  {zname} <==> {ename}")
