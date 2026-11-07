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

verify_cmd = """
node -e "
const http = require('http');

http.get('http://localhost:9000/api/watches?limit=5', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('API /api/watches HTTP Status:', res.statusCode);
      console.log('Total watches in DB:', data.total);
      console.log('Available brands count:', data.available_brands?.length);
      console.log('Brands sample:', data.available_brands?.slice(0, 15).join(', '));
      console.log('Available collections:', data.available_collections);
    } catch(e) {
      console.error('Parse error:', e.message);
    }
  });
}).on('error', err => console.error('HTTP error:', err.message));
"
"""
stdin, stdout, stderr = client.exec_command(verify_cmd)
print("=== LIVE API CHECK ===")
print(stdout.read().decode('utf-8'))

sample_check = """
node -e "
const http = require('http');
http.get('http://localhost:9000/api/watches/rtc-ig-DYjyaXMFLcW', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Sample watch (rtc-ig-DYjyaXMFLcW) HTTP Status:', res.statusCode);
    const parsed = JSON.parse(body);
    console.log('Watch Name:', parsed.data?.name);
    console.log('Slug:', parsed.data?.slug);
    console.log('In Stock:', parsed.data?.in_stock);
    console.log('Badge:', parsed.data?.badge);
    console.log('Price:', parsed.data?.price);
    console.log('Image:', parsed.data?.image);
    console.log('Movement:', parsed.data?.specs?.movement_caliber);
    console.log('Era:', parsed.data?.era_label);
    console.log('Collection:', parsed.data?.collection);
  });
});
"
"""
stdin, stdout, stderr = client.exec_command(sample_check)
print("=== SAMPLE IMPORTED WATCH OBJECT CHECK ===")
print(stdout.read().decode('utf-8'))

# Check image accessibility
img_check = """
node -e "
const fs = require('fs');
const imgPath = '/home/azureuser/shiny-enigma/apps/storefront/public/uploads/rtc-ig-DYjyaXMFLcW-01.webp';
if (fs.existsSync(imgPath)) {
  console.log('Image exists on disk! Size:', fs.statSync(imgPath).size, 'bytes');
} else {
  console.log('Image NOT found at:', imgPath);
}
"
"""
stdin, stdout, stderr = client.exec_command(img_check)
print("=== IMAGE ON DISK CHECK ===")
print(stdout.read().decode('utf-8'))

# Check sample frontend HTTP response
fe_check = """
curl -s -I http://localhost:3000/products/casio-sgw-300h-dyjyaxmflcw | head -n 5
curl -s -I http://localhost:3000/uploads/rtc-ig-DYjyaXMFLcW-01.webp | head -n 5
"""
stdin, stdout, stderr = client.exec_command(fe_check)
print("=== FRONTEND ROUTE CHECK ===")
print(stdout.read().decode('utf-8'))

client.close()
