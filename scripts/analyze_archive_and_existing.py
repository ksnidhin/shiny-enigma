import json
import zipfile
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
vps_json_path = "apps/backend/data/live_watches.vps_sync.json"

print("=" * 60)
print("1. INSPECTING EXISTING LIVE WATCHES")
print("=" * 60)
with open(vps_json_path, "r", encoding="utf-8") as f:
    existing_watches = json.load(f)

print(f"Total existing watches on VPS: {len(existing_watches)}")
existing_ids = set()
existing_names = set()
existing_refs = set()
existing_slugs = set()

for w in existing_watches:
    wid = str(w.get("id", "")).strip()
    wname = str(w.get("name", "")).strip().lower()
    wref = str(w.get("reference_number", "")).strip().lower()
    wslug = str(w.get("slug", "")).strip().lower()
    if wid: existing_ids.add(wid)
    if wname: existing_names.add(wname)
    if wref and wref != "n/a" and wref != "unknown": existing_refs.add(wref)
    if wslug: existing_slugs.add(wslug)

print("Existing IDs count:", len(existing_ids))
print("Sample existing watches:")
for w in existing_watches[:5]:
    print(f"  - [{w.get('id')}] {w.get('brand')} | {w.get('name')} | Ref: {w.get('reference_number')} | ₹{w.get('price')} | in_stock: {w.get('in_stock')}")

print("\n" + "=" * 60)
print("2. INSPECTING EXPORTED INSTAGRAM ARCHIVE")
print("=" * 60)
with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))
    manifest_data = json.loads(z.read("manifest.json").decode("utf-8"))

print(f"Total posts in rtc100.zip: {len(export_data)}")

# Let's inspect each post in export_data:
# Does it have caption? detected_price? images? post_id?
posts_with_price = 0
posts_with_caption = 0
posts_with_images = 0
total_images_found = 0

brand_counts = {}

def detect_brand(caption):
    cap = caption.lower()
    if "casio" in cap or "g-shock" in cap or "baby-g" in cap or "edifice" in cap:
        return "Casio"
    elif "seiko" in cap:
        return "Seiko"
    elif "citizen" in cap:
        return "Citizen"
    elif "orient" in cap:
        return "Orient"
    elif "hmt" in cap:
        return "HMT"
    elif "omega" in cap:
        return "Omega"
    elif "tissot" in cap:
        return "Tissot"
    elif "rado" in cap:
        return "Rado"
    elif "rolex" in cap:
        return "Rolex"
    elif "sandoz" in cap:
        return "Sandoz"
    elif "timex" in cap:
        return "Timex"
    elif "ricoh" in cap:
        return "Ricoh"
    elif "enicar" in cap:
        return "Enicar"
    elif "favre" in cap:
        return "Favre-Leuba"
    elif "alba" in cap:
        return "Alba"
    else:
        return "Other / Unknown"

for idx, p in enumerate(export_data):
    cap = p.get("caption", "")
    price = p.get("detected_price")
    imgs = p.get("images", [])
    if cap.strip(): posts_with_caption += 1
    if price: posts_with_price += 1
    if imgs:
        posts_with_images += 1
        total_images_found += len(imgs)
    
    b = detect_brand(cap)
    brand_counts[b] = brand_counts.get(b, 0) + 1

print(f"Posts with caption: {posts_with_caption} / {len(export_data)}")
print(f"Posts with detected price: {posts_with_price} / {len(export_data)}")
print(f"Posts with images: {posts_with_images} / {len(export_data)}")
print(f"Total image files in posts: {total_images_found}")
print("\nBrand breakdown in Instagram archive:")
for b, count in sorted(brand_counts.items(), key=lambda x: -x[1]):
    print(f"  {b}: {count}")
