import paramiko
import zipfile
import hashlib
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

vps_script = '''
import zipfile
import hashlib
import os

print("=== Running SHA256 hash comparison across all 591 VPS uploads ===")

uploads_dir = "/home/azureuser/shiny-enigma/apps/storefront/public/uploads"
vps_files = [f for f in os.listdir(uploads_dir) if f.lower().endswith(('.webp', '.jpg', '.jpeg', '.png'))]

vps_sha256 = {}
for f in vps_files:
    fpath = os.path.join(uploads_dir, f)
    try:
        with open(fpath, "rb") as fp:
            h = hashlib.sha256(fp.read()).hexdigest()
            vps_sha256[h] = f
    except:
        pass

print(f"Hashed {len(vps_sha256)} distinct files on VPS.")

exact_matches = []
with zipfile.ZipFile("/tmp/rtc100.zip", "r") as z:
    for name in z.namelist():
        if name.endswith(('.jpg', '.png', '.webp')):
            data = z.read(name)
            h = hashlib.sha256(data).hexdigest()
            if h in vps_sha256:
                exact_matches.append((name, vps_sha256[h]))

print(f"Exact SHA256 matches: {len(exact_matches)}")
for m in exact_matches:
    print(f"  Exact match: {m[0]} <==> {m[1]}")
'''

sftp = client.open_sftp()
with sftp.file('/tmp/run_sha_audit.py', 'w') as f:
    f.write(vps_script)
sftp.close()

stdin, stdout, stderr = client.exec_command('python3 /tmp/run_sha_audit.py')
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))

client.close()
