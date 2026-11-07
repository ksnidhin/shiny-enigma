import json
import zipfile
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"

with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

print(f"Analyzing all {len(export_data)} posts from archive...\n")

def clean_text(text):
    if not text: return ""
    return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text).strip()

def parse_price(caption, detected):
    if detected and isinstance(detected, (int, float)) and detected > 0:
        return int(detected)
    # Custom fallback regexes
    patterns = [
        r"price\s*(?:each)?\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)",
        r"(?:₹|rs\.?|inr)\s*([\d,]+)\s*(?:\/-)?",
        r"([\d,]+)\s*(?:\/-|\s*including shipping)"
    ]
    for pat in patterns:
        m = re.search(pat, caption, re.IGNORECASE)
        if m:
            val_str = m.group(1).replace(",", "").strip()
            if val_str.isdigit():
                val = int(val_str)
                if 500 <= val <= 500000:
                    return val
    return None

def extract_brand_and_collection(caption, hashtags):
    cap = caption.lower()
    ht = " ".join(hashtags).lower()
    combo = cap + " " + ht

    # Casio
    if "casio" in combo or "g-shock" in combo or "baby-g" in combo or "edifice" in combo or "databank" in combo:
        if "g-shock" in combo:
            return "Casio G-Shock", "casio", "Casio Watches"
        elif "edifice" in combo:
            return "Casio Edifice", "casio", "Casio Watches"
        return "Casio", "casio", "Casio Watches"

    # Seiko
    if "seiko" in combo:
        return "Seiko", "japanese-vintage", "Japanese Vintage"

    # Citizen
    if "citizen" in combo:
        return "Citizen", "japanese-vintage", "Japanese Vintage"

    # Orient
    if "orient" in combo:
        return "Orient", "japanese-vintage", "Japanese Vintage"

    # HMT
    if "hmt" in combo:
        return "HMT", "hmt-watches", "HMT Watches"

    # Swiss brands
    if "favre" in combo:
        return "Favre-Leuba", "swiss-vintage", "Swiss Vintage"
    if "west end" in combo:
        return "West End Watch Co", "swiss-vintage", "Swiss Vintage"
    if "swatch" in combo:
        return "Swatch", "swiss-vintage", "Swiss Vintage"
    if "winder geen" in combo:
        return "Winder Geen", "swiss-vintage", "Swiss Vintage"
    if "titus" in combo:
        return "Titus", "swiss-vintage", "Swiss Vintage"
    if "everswiss" in combo:
        return "Everswiss", "swiss-vintage", "Swiss Vintage"
    if "sandoz" in combo:
        return "Sandoz", "swiss-vintage", "Swiss Vintage"
    if "rado" in combo:
        return "Rado", "swiss-vintage", "Swiss Vintage"
    if "omega" in combo:
        return "Omega", "swiss-vintage", "Swiss Vintage"
    if "tissot" in combo:
        return "Tissot", "swiss-vintage", "Swiss Vintage"
    if "enicar" in combo:
        return "Enicar", "swiss-vintage", "Swiss Vintage"
    if "westar" in combo:
        return "Westar", "swiss-vintage", "Swiss Vintage"

    # Timex
    if "timex" in combo:
        return "Timex", "swiss-vintage", "Swiss Vintage"

    # Titan
    if "titan" in combo:
        return "Titan", "hmt-watches", "Indian Vintage"

    # Cruiser / Aviator / Lobor / Crocodile / Nike
    if "cruiser" in combo:
        return "Cruiser", "japanese-vintage", "Japanese Vintage"
    if "aviator" in combo:
        return "Aviator", "swiss-vintage", "Vintage Archive"
    if "lobor" in combo:
        return "Lobor", "swiss-vintage", "Vintage Archive"
    if "crocodile" in combo:
        return "Crocodile", "japanese-vintage", "Vintage Archive"
    if "nike" in combo:
        return "Nike", "casio", "Vintage Digital"

    return "Vintage Archive", "japanese-vintage", "Vintage Watches"

def extract_reference(caption):
    patterns = [
        r"(?:model\s*(?:number|num)?|ref(?:erence)?\s*(?:number|num)?)\s*[:\-]?\s*([A-Za-z0-9_\-\/]+)",
        r"(?:model\s*[:\-]?\s*)([A-Za-z0-9_\-\/]+)",
        r"(?:calibre|cal\.?)\s*[:\-]?\s*([A-Za-z0-9_\-\/]+)",
    ]
    for pat in patterns:
        m = re.search(pat, caption, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            if len(val) >= 2 and val.lower() not in ("number", "num", "vintage", "available", "watch"):
                return val
    return ""

def extract_movement(caption, brand):
    cap = caption.lower()
    if "automatic" in cap:
        jewels_m = re.search(r"(\d{1,2})\s*jewels", cap)
        if jewels_m:
            return f"{jewels_m.group(1)} Jewels Automatic"
        return "Automatic"
    if "manual winding" in cap or "hand-wound" in cap or "hand wound" in cap or "winding" in cap:
        jewels_m = re.search(r"(\d{1,2})\s*jewels", cap)
        if jewels_m:
            return f"{jewels_m.group(1)} Jewels Hand-Wound Mechanical"
        return "Mechanical Manual Wind"
    if "digi analog" in cap or "analog-digital" in cap or "digital analog" in cap:
        return "Digi-Analog Quartz"
    if "digital" in cap:
        return "Digital Quartz"
    if "quartz" in cap or "quatz" in cap:
        return "Precision Quartz"
    if brand.lower() in ("casio", "casio g-shock", "casio edifice"):
        return "Digital Quartz"
    return "Precision Vintage Movement"

def extract_era(caption):
    cap = caption.lower()
    m = re.search(r"(19[5-9]\d|20[0-2]\d)s?", cap)
    if m:
        year = m.group(1)
        if year.endswith("s"):
            return year
        return f"{year}s"
    if "1960" in cap: return "1960s"
    if "1970" in cap: return "1970s"
    if "1980" in cap: return "1980s"
    if "1990" in cap: return "1990s"
    if "2000" in cap: return "2000s"
    return "Vintage Era"

parsed_posts = []
missing_prices = []

for i, p in enumerate(export_data):
    cap = p.get("caption", "").strip()
    pid = p.get("post_id")
    url = p.get("url")
    price = parse_price(cap, p.get("detected_price"))
    brand, coll_slug, coll_title = extract_brand_and_collection(cap, p.get("hashtags", []))
    ref = extract_reference(cap)
    movement = extract_movement(cap, brand)
    era = extract_era(cap)
    
    if not price:
        missing_prices.append((i + 1, pid, cap[:60].replace("\n", " ")))

    parsed_posts.append({
        "index": i + 1,
        "post_id": pid,
        "url": url,
        "price": price,
        "brand": brand,
        "collection": coll_slug,
        "collection_title": coll_title,
        "reference_number": ref or "VNTG-SPEC",
        "movement": movement,
        "era": era,
        "caption": cap,
        "image_file": p.get("images", [{}])[0].get("filename")
    })

print(f"Total parsed: {len(parsed_posts)}")
print(f"Posts with valid historical price: {len([p for p in parsed_posts if p['price']])} / {len(parsed_posts)}")
print(f"Posts requiring manual price review: {len(missing_prices)}")
for mp in missing_prices:
    print(f"  Post {mp[0]:03d} [#{mp[1]}]: {mp[2]}")
