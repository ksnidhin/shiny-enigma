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

stdin, stdout, stderr = client.exec_command("cd /home/azureuser/shiny-enigma && git diff apps/backend/data/live_watches.json | head -n 40")
print("DIFF:")
print(stdout.read().decode('utf-8', errors='replace'))

stdin2, stdout2, stderr2 = client.exec_command("cd /home/azureuser/shiny-enigma && node -e \"console.log('VPS watch count:', JSON.parse(require('fs').readFileSync('apps/backend/data/live_watches.json')).length)\"")
print(stdout2.read().decode('utf-8', errors='replace'))

client.close()
