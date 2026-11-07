import paramiko
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOSTNAME = "20.174.25.82"
USERNAME = "azureuser"
PASSWORD = "V9!qR7#zL2@xK8$mP4^tW6"
REPO_DIR = "/home/azureuser/shiny-enigma"

def run_ssh_command(client, cmd):
    print(f"\n>>> Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_status = stdout.channel.recv_exit_status()
    
    if out:
        print(f"STDOUT:\n{out}")
    if err:
        print(f"STDERR:\n{err}")
    print(f"Exit code: {exit_status}")
    return exit_status, out, err

def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {USERNAME}@{HOSTNAME}...")
    client.connect(HOSTNAME, username=USERNAME, password=PASSWORD, timeout=15)
    print("Connected successfully.")

    # 1. Back up live 64 records
    run_ssh_command(client, f"mkdir -p /home/azureuser/backups && cp -r {REPO_DIR}/apps/backend/data /home/azureuser/backups/live_data_safe_$(date +%s)")
    run_ssh_command(client, f"rm -rf /home/azureuser/live_data_current && cp -r {REPO_DIR}/apps/backend/data /home/azureuser/live_data_current")

    # 2. Revert data files in git workspace to allow clean pull
    run_ssh_command(client, f"cd {REPO_DIR} && git checkout apps/backend/data")

    # 3. Pull latest code
    exit_code, _, _ = run_ssh_command(client, f"cd {REPO_DIR} && git pull origin main")
    if exit_code != 0:
        print("Git pull failed!")
        client.close()
        sys.exit(1)

    # 4. Restore the live 64 records from backup
    run_ssh_command(client, f"cp -r /home/azureuser/live_data_current/* {REPO_DIR}/apps/backend/data/")

    # 5. Remove 'Chennai' overuse directly from live records
    node_clean_cmd = (
        f"node -e \""
        f"const fs = require('fs');"
        f"['{REPO_DIR}/apps/backend/data/live_watches.json', '{REPO_DIR}/apps/backend/data/watches.json'].forEach(f => {{"
        f"  if (fs.existsSync(f)) {{"
        f"    let d = fs.readFileSync(f, 'utf8');"
        f"    d = d.replace(/Workshop, Chennai\\./g, 'Workshop.');"
        f"    fs.writeFileSync(f, d, 'utf8');"
        f"    console.log('Cleaned', f, 'Count:', JSON.parse(d).length);"
        f"  }}"
        f"}});"
        f"\""
    )
    run_ssh_command(client, node_clean_cmd)

    # 6. Build backend & storefront
    run_ssh_command(client, f"cd {REPO_DIR}/apps/backend && pnpm build")
    run_ssh_command(client, f"cd {REPO_DIR}/apps/storefront && pnpm build")

    # 7. Restart PM2 processes for retrotimeco
    run_ssh_command(client, "pm2 restart backend frontend && pm2 save")
    run_ssh_command(client, "pm2 list")

    # 8. Health checks
    time.sleep(3)
    run_ssh_command(client, "curl -sI https://retrotimeco.in | head -n 5")
    run_ssh_command(client, "curl -s http://localhost:9000/api/watches | head -c 200")

    client.close()
    print("\nVPS Deployment and live data cleanup successfully completed!")

if __name__ == "__main__":
    main()
