import json
import zipfile
import re
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

print("=== POSTS WITHOUT DETECTED PRICE IN EXPORT.JSON ===")
for i, p in enumerate(export_data):
    if not p.get("detected_price"):
        print(f"\n--- Post {i+1} [ID: {p.get('post_id')}] ---")
        print(p.get("caption"))
