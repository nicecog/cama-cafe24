#!/usr/bin/env python3
import re, time
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

script = r"""
set -e
docker rm -f cama-plus-server e6dee92c77c4_cama-plus-server 2>/dev/null || true
cd /opt/cama/deploy
set -a && source .env.cafe24 && set +a
docker run -d \
  --name cama-plus-server \
  --restart unless-stopped \
  --network deploy_default \
  -p 127.0.0.1:8080:8080 \
  -v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro \
  -v /opt/cama/data/cama-files:/opt/cama/data/cama-files \
  -v /opt/cama/data/apk_down:/opt/cama/data/apk_down \
  -w /app \
  -e SERVER_PORT=8080 \
  -e DB_URL=jdbc:postgresql://postgres:5432/cama \
  -e DB_USER=${POSTGRES_USER:-cama} \
  -e DB_PASSWORD=${POSTGRES_PASSWORD} \
  -e JWT_CLIENT_SECRET=${JWT_CLIENT_SECRET} \
  -e CAMA_STORAGE_TYPE=${CAMA_STORAGE_TYPE:-local} \
  -e FILE_STORAGE_PATH=${FILE_STORAGE_PATH:-/opt/cama/data/cama-files} \
  -e APK_STORAGE_PATH=${APK_STORAGE_PATH:-/opt/cama/data/apk_down} \
  -e APK_PUBLIC_BASE_URL=${APK_PUBLIC_BASE_URL:-https://camaplus.cafe24.com/apk_down} \
  -e IMAGE_CDN_BASE_URL=${IMAGE_CDN_BASE_URL} \
  -e CAMA_CORS_ORIGINS=${CAMA_CORS_ORIGINS} \
  eclipse-temurin:21-jre-jammy \
  java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24
sleep 20
docker ps | grep cama-plus-server
docker exec cama-plus-server ls -la /opt/cama/data/apk_down/
curl -s -o /dev/null -w 'apk=%{http_code}\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk
"""
_, o, e = client.exec_command(script, timeout=120)
o.channel.recv_exit_status()
print(o.read().decode())
err = e.read().decode().strip()
if err:
    print("ERR:", err)
client.close()
