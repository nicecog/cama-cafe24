#!/usr/bin/env python3
import re, subprocess
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)

remote_py = r'''
import subprocess
from pathlib import Path
env = {}
for line in Path("/opt/cama/deploy/.env.cafe24").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line: continue
    k, v = line.split("=", 1)
    env[k.strip()] = v.strip()
args = []
for k in ["JWT_CLIENT_SECRET","DB_PASSWORD","IMAGE_CDN_BASE_URL","CAMA_CORS_ORIGINS"]:
    val = env.get(k if k!="DB_PASSWORD" else "POSTGRES_PASSWORD","")
    if k=="DB_PASSWORD": k="DB_PASSWORD"
    if val: args.append(f'-e {k}={val}')
cmd = [
    "docker","run","--rm","--network","deploy_default",
    "-v","/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro",
    "-v","/opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro",
    "-e","SERVER_PORT=8080",
    "-e","DB_URL=jdbc:postgresql://postgres:5432/cama",
    "-e","DB_USER=cama",
    "-e",f"DB_PASSWORD={env.get('POSTGRES_PASSWORD','')}",
    "-e",f"JWT_CLIENT_SECRET={env.get('JWT_CLIENT_SECRET','')}",
    "-e","IAMPORT_KEY=","-e","IAMPORT_SECRET=",
    "-e","CAMA_STORAGE_TYPE=local",
    "-e","FILE_STORAGE_PATH=/opt/cama/data/cama-files",
    "-e","APK_STORAGE_PATH=/opt/cama/data/apk_down",
    "-e","APK_PUBLIC_BASE_URL=https://camaplus.cafe24.com/apk_down",
    "-e",f"IMAGE_CDN_BASE_URL={env.get('IMAGE_CDN_BASE_URL','')}",
    "-e",f"CAMA_CORS_ORIGINS={env.get('CAMA_CORS_ORIGINS','')}",
    "-e","FIREBASE_CREDENTIALS_PATH=/secrets/firebase-adminsdk.json",
    "eclipse-temurin:21-jre-jammy",
    "java","-Xms512m","-Xmx1536m","-jar","/app/app.jar",
    "--spring.profiles.active=cafe24,local"
]
r = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
print(r.stdout[-6000:])
print(r.stderr[-3000:])
print('exit', r.returncode)
'''
_, o, _ = c.exec_command(f"python3 - <<'PY'\n{remote_py}\nPY", timeout=120)
print(o.read().decode())
c.close()
