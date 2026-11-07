import paramiko
import json
import tarfile
import os
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

print("==================================================")
print("1. PACKING STAGED WEBP IMAGES FOR UPLOAD")
print("==================================================")
staging_dir = "tmp_staging_uploads"
archive_tar = "data/staged_images.tar.gz"

with tarfile.open(archive_tar, "w:gz") as tar:
    for fname in os.listdir(staging_dir):
        fpath = os.path.join(staging_dir, fname)
        tar.add(fpath, arcname=fname)

print(f"Packed {len(os.listdir(staging_dir))} images into {archive_tar} ({os.path.getsize(archive_tar)/1024:.1f} KB).")

print("\n==================================================")
print("2. CONNECTING TO VPS VIA SSH/SFTP")
print("==================================================")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)
sftp = client.open_sftp()
print("Connected successfully.")

print("\n==================================================")
print("3. UPLOADING IMAGES TO VPS STOREFRONT UPLOADS")
print("==================================================")
remote_tar = "/tmp/staged_images.tar.gz"
sftp.put(archive_tar, remote_tar)
print(f"Uploaded {archive_tar} -> {remote_tar}")

extract_cmd = """
tar -xzf /tmp/staged_images.tar.gz -C /home/azureuser/shiny-enigma/apps/storefront/public/uploads/ &&
echo 'IMAGES EXTRACTED ON VPS SUCCESSFULLY'
"""
stdin, stdout, stderr = client.exec_command(extract_cmd)
print(stdout.read().decode('utf-8'))

print("\n==================================================")
print("4. UPDATING DATABASE SAFELY & IDEMPOTENTLY")
print("==================================================")
# Read new watches from preview
with open("data/import_preview.json", "r", encoding="utf-8") as f:
    new_watches = json.load(f)

# Read current VPS live_watches.json
vps_json_path = "/home/azureuser/shiny-enigma/apps/backend/data/live_watches.json"
remote_f = sftp.file(vps_json_path, "r")
current_vps_watches = json.loads(remote_f.read().decode('utf-8'))
remote_f.close()

existing_ids = set(w.get("id") for w in current_vps_watches)
print(f"Current VPS live watches before import: {len(current_vps_watches)}")

added_count = 0
skipped_count = 0

for w in new_watches:
    wid = w.get("id")
    if wid in existing_ids:
        skipped_count += 1
    else:
        current_vps_watches.append(w)
        existing_ids.add(wid)
        added_count += 1

print(f"New watches added: {added_count}")
print(f"Duplicates skipped: {skipped_count}")
print(f"Total live watches after merge: {len(current_vps_watches)}")

# Write to temporary file on VPS then atomically rename
updated_json_str = json.dumps(current_vps_watches, indent=2, ensure_ascii=False)
tmp_remote_json = "/tmp/updated_live_watches.json"
remote_out = sftp.file(tmp_remote_json, "w")
remote_out.write(updated_json_str.encode('utf-8'))
remote_out.close()

atomic_swap_cmd = f"""
mv {tmp_remote_json} {vps_json_path} &&
cp {vps_json_path} /home/azureuser/shiny-enigma/apps/backend/data/watches.json &&
echo 'DATABASE SWAPPED ATOMICALLY ON VPS'
"""
stdin, stdout, stderr = client.exec_command(atomic_swap_cmd)
print(stdout.read().decode('utf-8'))

# Also write to local files
with open("apps/backend/data/live_watches.json", "w", encoding="utf-8") as f:
    f.write(updated_json_str)
with open("apps/backend/data/watches.json", "w", encoding="utf-8") as f:
    f.write(updated_json_str)
print("Updated local apps/backend/data/live_watches.json and watches.json.")

print("\n==================================================")
print("5. RESTARTING BACKEND & FRONTEND SERVICES")
print("==================================================")
stdin, stdout, stderr = client.exec_command("pm2 restart backend frontend")
print(stdout.read().decode('utf-8'))

print("\n==================================================")
print("6. VERIFYING LIVE STOREFRONT AND APIS")
print("==================================================")
verify_cmd = """
node -e "
const http = require('http');

http.get('http://localhost:5000/api/watches?limit=5', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('API /api/watches Status:', res.statusCode);
      console.log('Total watches reported by API:', data.total);
      console.log('Available brands:', data.available_brands?.length);
      console.log('Available collections:', data.available_collections);
    } catch(e) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', err => console.error('HTTP error:', err.message));
"
"""
stdin, stdout, stderr = client.exec_command(verify_cmd)
print(stdout.read().decode('utf-8'))

# Check a sample new watch directly
sample_id = sample_watch['id']
sample_check = f"""
node -e "
const http = require('http');
http.get('http://localhost:5000/api/watches/{sample_id}', (res) => {{
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {{
    console.log('Sample watch {sample_id} fetch status:', res.statusCode);
    const parsed = JSON.parse(body);
    console.log('Watch Name:', parsed.data?.name);
    console.log('In Stock:', parsed.data?.in_stock);
    console.log('Badge:', parsed.data?.badge);
    console.log('Price:', parsed.data?.price);
  }});
}});
"
"""
stdin, stdout, stderr = client.exec_command(sample_check)
print(stdout.read().decode('utf-8'))

sftp.close()
client.close()
print("Execution complete!")
