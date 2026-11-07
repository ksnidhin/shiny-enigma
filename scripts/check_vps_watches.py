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

cmd = (
    "node -e \""
    "const fs = require('fs');"
    "const watches = JSON.parse(fs.readFileSync('/home/azureuser/shiny-enigma/apps/backend/data/live_watches.json', 'utf8'));"
    "console.log('Total on VPS:', watches.length);"
    "console.log('Last 10 watches on VPS:');"
    "watches.slice(-10).forEach(w => console.log(' ', w.id, w.name, 'in_stock:', w.in_stock));"
    "\""
)
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
