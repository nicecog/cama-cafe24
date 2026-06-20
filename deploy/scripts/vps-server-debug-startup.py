#!/usr/bin/env python3
"""Run server jar once on VPS and print startup errors."""
import re
import subprocess
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}

REMOTE_PY = r'''
import subprocess
from pathlib import Path

env = {}
for line in Path("/opt/cama/deploy/.env.cafe24").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    env[k.strip()] = v.strip()

db_pass = env.get("POSTGRES_PASSWORD") or env.get("DB_PASSWORD", "")
jwt = env.get("JWT_CLIENT_SECRET", "")

env_args = [
    "-e", "SERVER_PORT=8080",
    "-e", "DB_URL=jdbc:postgresql://postgres:5432/cama",
    "-e", f"DB_USER={env.get('POSTGRES_USER', 'cama')}",
    "-e", f"DB_PASSWORD={db_pass}",
    "-e", f"JWT_CLIENT_SECRET={jwt}",
    "-e", "CAMA_STORAGE_TYPE=local",
    "-e", "FILE_STORAGE_PATH=/opt/cama/data/cama-files",
    "-e", "APK_STORAGE_PATH=/opt/cama/data/apk_down",
    "-e", "APK_PUBLIC_BASE_URL=https://camaplus.cafe24.com/apk_down",
    "-e", f"IMAGE_CDN_BASE_URL={env.get('IMAGE_CDN_BASE_URL', 'https://camaplus.cafe24.com/files')}",
    "-e", f"CAMA_CORS_ORIGINS={env.get('CAMA_CORS_ORIGINS', '*')}",
    "-e", "CAMA_MAIL_ENABLED=false",
    "-e", "FIREBASE_CREDENTIALS_PATH=/secrets/firebase-adminsdk.json",
]

cmd = [
    "timeout", "90", "docker", "run", "--rm", "--name", "cama-server-debug",
    "--network", "deploy_default",
    "-v", "/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro",
    "-v", "/opt/cama/data/apk_down:/opt/cama/data/apk_down",
    "-v", "/opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro",
    *env_args,
    "eclipse-temurin:21-jre-jammy",
    "java", "-jar", "/app/app.jar", "--spring.profiles.active=cafe24",
]
r = subprocess.run(cmd, text=True, capture_output=True)
out = (r.stdout or "") + (r.stderr or "")
print("exit", r.returncode)
for line in out.splitlines():
    low = line.lower()
    if any(x in low for x in ["error", "exception", "failed", "started runapplication", "caused", "apk storage"]):
        print(line)
print("---TAIL---")
print("\n".join(out.splitlines()[-30:]))
'''

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, e = c.exec_command(f"python3 - <<'PY'\n{REMOTE_PY}\nPY", timeout=120)
o.channel.recv_exit_status()
print(o.read().decode())
err = e.read().decode().strip()
if err:
    print("STDERR:", err[:500])
c.close()
