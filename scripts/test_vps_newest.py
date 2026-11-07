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
    "function getWatchTimestamp(w, fallbackIndex) {"
    "  const match = (w.id || '').match(/\\d{10,13}/);"
    "  if (match) return parseInt(match[0], 10);"
    "  return fallbackIndex;"
    "}"
    "const unsold = watches.filter(w => w.in_stock);"
    "unsold.sort((a, b) => {"
    "  const timeA = getWatchTimestamp(a, 0);"
    "  const timeB = getWatchTimestamp(b, 0);"
    "  if (timeB !== timeA) return timeB - timeA;"
    "  return b.id.localeCompare(a.id);"
    "});"
    "console.log('Unsold count on VPS:', unsold.length);"
    "console.log('Top 8 newest unsold watches on VPS:');"
    "unsold.slice(0, 8).forEach((w, idx) => {"
    "  console.log(idx + 1, w.id, w.name, 'Price:', w.price, 'In stock:', w.in_stock);"
    "});"
    "\""
)
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
