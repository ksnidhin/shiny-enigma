import paramiko
import sys
import os

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

sftp = client.open_sftp()
os.makedirs("tmp_vps_images", exist_ok=True)
sftp.get("/home/azureuser/shiny-enigma/apps/storefront/public/uploads/1788697821149-qj3i5s.webp", "tmp_vps_images/rtc_timex_main.webp")
print("Downloaded rtc_timex_main.webp")
sftp.close()
client.close()
