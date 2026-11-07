import paramiko
import sys
import json

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOSTNAME, username=USERNAME, password=PASSWORD)

test_samples = [
    # HMT
    ("rtc-ig-DNV-5TBzrJ2", "HMT Rajat Automatic"),
    # Swiss (Favre Leuba or Timex)
    ("rtc-ig-DTib_2DieoK", "Favre Leuba Sea King"),
    # Citizen
    ("rtc-ig-DKmlKOAppl2", "Citizen Automatic Watch")
]

for wid, expected_name in test_samples:
    cmd = f"""
node -e "
const http = require('http');
http.get('http://localhost:9000/api/watches/{wid}', (res) => {{
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {{
    const parsed = JSON.parse(body);
    console.log('ID: {wid} | Name:', parsed.data?.name, '| Collection:', parsed.data?.collection, '| In Stock:', parsed.data?.in_stock, '| Price:', parsed.data?.price);
  }});
}});
"
"""
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode('utf-8').strip())

client.close()
