import paramiko
import sys
import os

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

zip_path = r"C:\Users\PC\Downloads\rtc100.zip"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

sftp = client.open_sftp()
print("Uploading rtc100.zip to VPS /tmp/rtc100.zip...")
sftp.put(zip_path, "/tmp/rtc100.zip")
print("Upload complete!")

vps_script = '''
import zipfile
import hashlib
import json
import os
from PIL import Image
import io

print("=== Running full perceptual and exact comparison on VPS ===")

uploads_dir = "/home/azureuser/shiny-enigma/apps/storefront/public/uploads"
vps_files = [f for f in os.listdir(uploads_dir) if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))]
print(f"Total images in VPS uploads: {len(vps_files)}")

def dhash(image, hash_size=8):
    image = image.convert('L').resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(image.getdata())
    difference = []
    for row in range(hash_size):
        for col in range(hash_size):
            pixel_left = pixels[row * (hash_size + 1) + col]
            pixel_right = pixels[row * (hash_size + 1) + col + 1]
            difference.append(pixel_left > pixel_right)
    return sum([2 ** i for (i, v) in enumerate(difference) if v])

def hamming_distance(h1, h2):
    return bin(h1 ^ h2).count('1')

# Hash VPS files
vps_dhashes = {}
vps_sha256 = {}

for f in vps_files:
    fpath = os.path.join(uploads_dir, f)
    try:
        with open(fpath, 'rb') as fp:
            data = fp.read()
            vps_sha256[hashlib.sha256(data).hexdigest()] = f
            img = Image.open(io.BytesIO(data))
            vps_dhashes[f] = dhash(img)
    except Exception as e:
        pass

print(f"Hashed {len(vps_dhashes)} VPS images.")

# Check against ZIP
exact_matches = []
near_duplicate_matches = [] # hamming <= 4

with zipfile.ZipFile("/tmp/rtc100.zip", "r") as z:
    for name in z.namelist():
        if name.endswith(('.jpg', '.png', '.webp')):
            try:
                data = z.read(name)
                sha = hashlib.sha256(data).hexdigest()
                if sha in vps_sha256:
                    exact_matches.append((name, vps_sha256[sha]))
                
                img = Image.open(io.BytesIO(data))
                zh = dhash(img)
                for vf, vh in vps_dhashes.items():
                    dist = hamming_distance(zh, vh)
                    if dist <= 4:
                        near_duplicate_matches.append((name, vf, dist))
            except Exception as e:
                pass

print(f"Exact SHA256 matches: {len(exact_matches)}")
for m in exact_matches:
    print(f"  Exact: {m[0]} == {m[1]}")

print(f"Near-duplicate visual matches (hamming <= 4): {len(near_duplicate_matches)}")
for m in near_duplicate_matches:
    print(f"  Visual near-duplicate: {m[0]} matches {m[1]} with distance {m[2]}")
'''

with sftp.file('/tmp/run_img_audit.py', 'w') as f:
    f.write(vps_script)
sftp.close()

stdin, stdout, stderr = client.exec_command('python3 /tmp/run_img_audit.py')
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))

client.close()
