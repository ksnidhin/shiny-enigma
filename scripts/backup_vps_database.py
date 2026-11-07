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

backup_cmd = """
cd /home/azureuser/shiny-enigma && 
cp apps/backend/data/live_watches.json apps/backend/data/live_watches.backup_pre_import_$(date +%Y%m%d_%H%M%S).json &&
cp apps/backend/data/watches.json apps/backend/data/watches.backup_pre_import_$(date +%Y%m%d_%H%M%S).json &&
echo 'BACKUP CREATED ON VPS SUCCESSFULLY'
"""
stdin, stdout, stderr = client.exec_command(backup_cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

sftp = client.open_sftp()
os_backup_path = "apps/backend/data/live_watches.backup_pre_import.json"
sftp.get("/home/azureuser/shiny-enigma/apps/backend/data/live_watches.json", os_backup_path)
print(f"Downloaded local backup to {os_backup_path}")
sftp.close()
client.close()
