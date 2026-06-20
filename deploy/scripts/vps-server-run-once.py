#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
user = re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30, allow_agent=False, look_for_keys=False)

script = r'''
python3 - <<'PY'
import re, subprocess
from pathlib import Path
env = {}
for line in Path("/opt/cama/deploy/.env.cafe24").read_text(encoding="utf-8").splitlines():
    line=line.strip()
    if not line or line.startswith('#') or '=' not in line: continue
    k,v=line.split('=',1); env[k.strip()]=v.strip()
db_pass = env.get('POSTGRES_PASSWORD') or env.get('DB_PASSWORD','')
jwt = env.get('JWT_CLIENT_SECRET','')
cmd = (
  "timeout 45 docker run --rm --network deploy_default "
  "-v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro "
  f"-e DB_URL=jdbc:postgresql://postgres:5432/cama "
  f"-e DB_USER={env.get('POSTGRES_USER','cama')} "
  f"-e DB_PASSWORD={db_pass} "
  f"-e JWT_CLIENT_SECRET={jwt} "
  "-e CAMA_STORAGE_TYPE=local "
  "-e FILE_STORAGE_PATH=/opt/cama/data/cama-files "
  "-e APK_STORAGE_PATH=/opt/cama/data/apk_down "
  "-e APK_PUBLIC_BASE_URL=https://camaplus.cafe24.com/apk_down "
  f"-e IMAGE_CDN_BASE_URL={env.get('IMAGE_CDN_BASE_URL','https://camaplus.cafe24.com/files')} "
  "eclipse-temurin:21-jre-jammy java -jar /app/app.jar --spring.profiles.active=cafe24"
)
print(subprocess.run(cmd, shell=True, text=True, capture_output=True).stdout[-4000:])
print(subprocess.run(cmd, shell=True, text=True, capture_output=True).stderr[-2000:])
PY
'''
_, o, e = client.exec_command(script, timeout=90)
o.channel.recv_exit_status()
print(o.read().decode())
print(e.read().decode())
client.close()
