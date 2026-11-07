import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

script = '''
import os, json

print("=== VPS Directory Inspection ===")
repo_dir = "/home/azureuser/shiny-enigma"
for root, dirs, files in os.walk(repo_dir):
    if "uploads" in dirs:
        print("Found uploads dir at:", os.path.join(root, "uploads"))

live_path = os.path.join(repo_dir, "apps/backend/data/live_watches.json")
if os.path.exists(live_path):
    with open(live_path, "r", encoding="utf-8") as f:
        watches = json.load(f)
    print("Total watches in VPS live_watches.json:", len(watches))
    in_stock = [w for w in watches if w.get("in_stock")]
    sold = [w for w in watches if not w.get("in_stock")]
    print("In stock:", len(in_stock), "Sold:", len(sold))
    print("\\nCollections used on VPS:")
    colls = {}
    for w in watches:
        c = (w.get("collection"), w.get("collection_title"))
        colls[c] = colls.get(c, 0) + 1
    for k, v in colls.items():
        print(f"  {k}: {v}")

    print("\\nBrands used on VPS:")
    brands = {}
    for w in watches:
        b = w.get("brand")
        brands[b] = brands.get(b, 0) + 1
    for k, v in brands.items():
        print(f"  {k}: {v}")
'''

sftp = client.open_sftp()
with sftp.file('/tmp/inspect_vps.py', 'w') as f:
    f.write(script)
sftp.close()

stdin, stdout, stderr = client.exec_command('python3 /tmp/inspect_vps.py')
print(stdout.read().decode('utf-8', errors='replace'))
print(stderr.read().decode('utf-8', errors='replace'))
client.close()
