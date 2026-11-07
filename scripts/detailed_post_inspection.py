import json
import zipfile
import re
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
vps_json_path = "apps/backend/data/live_watches.vps_sync.json"

with open(vps_json_path, "r", encoding="utf-8") as f:
    existing_watches = json.load(f)

with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

print(f"Loaded {len(existing_watches)} existing watches and {len(export_data)} exported Instagram posts.\n")

for i, p in enumerate(export_data):
    cap = p.get("caption", "").strip()
    first_line = cap.split("\n")[0] if cap else "NO CAPTION"
    lines = [line.strip() for line in cap.split("\n") if line.strip() and not line.strip().startswith("#")]
    summary = " // ".join(lines[:4])
    print(f"[{i+1:03d}] ID: {p.get('post_id')} | Price: {p.get('detected_price')} | Img: {p.get('images')[0]['filename'] if p.get('images') else 'None'}")
    print(f"      Summary: {summary[:120]}")
