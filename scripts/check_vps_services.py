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

stdin, stdout, stderr = client.exec_command("pm2 list; sudo systemctl status shiny-enigma --no-pager 2>/dev/null; ps aux | grep node")
print(stdout.read().decode('utf-8', errors='replace'))

client.close()
