import paramiko
import zipfile
import hashlib
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"

# Hash all 100 images from ZIP
zip_hashes = {}
with zipfile.ZipFile(zip_path, "r") as z:
    for name in z.namelist():
        if name.endswith(".jpg") or name.endswith(".png") or name.endswith(".webp"):
            data = z.read(name)
            h = hashlib.sha256(data).hexdigest()
            zip_hashes[h] = name

print(f"Computed SHA256 for {len(zip_hashes)} images in zip.")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

# Script to run on VPS: hash images of existing watches
vps_script = '''
import json, hashlib, os

with open("/home/azureuser/shiny-enigma/apps/backend/data/live_watches.json") as f:
    watches = json.load(f)

uploads_dir = "/home/azureuser/shiny-enigma/apps/storefront/public/uploads"
watch_hashes = {}

for w in watches:
    wid = w.get("id")
    img = w.get("image", "")
    if img.startswith("/uploads/"):
        fname = img.replace("/uploads/", "")
        fpath = os.path.join(uploads_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "rb") as f:
                h = hashlib.sha256(f.read()).hexdigest()
                watch_hashes[h] = {"id": wid, "name": w.get("name"), "file": fname}

print(json.dumps(watch_hashes))
'''

sftp = client.open_sftp()
with sftp.file('/tmp/hash_vps_watches.py', 'w') as f:
    f.write(vps_script)
sftp.close()

stdin, stdout, stderr = client.exec_command('python3 /tmp/hash_vps_watches.py')
raw_out = stdout.read().decode('utf-8')
vps_watch_hashes = json.loads(raw_out)

print(f"Received hashes for {len(vps_watch_hashes)} existing watch primary images on VPS.")

image_duplicates = []
for h, zname in zip_hashes.items():
    if h in vps_watch_hashes:
        match_info = vps_watch_hashes[h]
        image_duplicates.append({"zip_file": zname, "matched_watch": match_info})

print(f"\nExact image matches between ZIP and VPS live watches: {len(image_duplicates)}")
for m in image_duplicates:
    print(f"  {m['zip_file']} matches {m['matched_watch']['id']} ({m['matched_watch']['name']})")

client.close()
