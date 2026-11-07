import json
import zipfile
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

with zipfile.ZipFile(r"C:\Users\PC\Downloads\rtc100.zip", "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

target = "Brown dial and brown bezel"
found = False
for i, p in enumerate(export_data):
    if target.lower() in p.get("caption", "").lower():
        print(f"Match found in Post {i+1} [ID: {p.get('post_id')}]!")
        print(p.get("caption")[:120])
        found = True

if not found:
    print("No post contains that exact caption text.")
