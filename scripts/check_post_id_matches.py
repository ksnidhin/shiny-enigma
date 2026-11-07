import json
import zipfile
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"
vps_json_path = "apps/backend/data/live_watches.vps_sync.json"

with open(vps_json_path, "r", encoding="utf-8") as f:
    existing_watches = json.load(f)

with zipfile.ZipFile(zip_path, "r") as z:
    export_data = json.loads(z.read("export.json").decode("utf-8"))

existing_text = ""
for w in existing_watches:
    existing_text += json.dumps(w) + "\n"

post_id_matches = []
for p in export_data:
    pid = p.get("post_id")
    if pid and pid in existing_text:
        post_id_matches.append(pid)

print(f"Instagram Post ID matches in existing database: {len(post_id_matches)}")
