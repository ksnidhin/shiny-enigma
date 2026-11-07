import paramiko
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

sftp = client.open_sftp()
# First backup local live_watches.json if exists
shutil.copyfile("apps/backend/data/live_watches.json", "apps/backend/data/live_watches.local_backup.json")
# Download current VPS live_watches.json
sftp.get("/home/azureuser/shiny-enigma/apps/backend/data/live_watches.json", "apps/backend/data/live_watches.vps_sync.json")
print("Downloaded VPS live_watches.json to apps/backend/data/live_watches.vps_sync.json")
sftp.close()
client.close()
