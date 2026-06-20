#!/usr/bin/env python3
import re
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
_, o, _ = c.exec_command("""
docker stop cama-plus-server
JWT=$(grep '^JWT_CLIENT_SECRET=' /opt/cama/deploy/.env.cafe24 | cut -d= -f2-)
DBPW=$(grep '^POSTGRES_PASSWORD=' /opt/cama/deploy/.env.cafe24 | cut -d= -f2-)
CORS=$(grep '^CAMA_CORS_ORIGINS=' /opt/cama/deploy/.env.cafe24 | cut -d= -f2-)
CDN=$(grep '^IMAGE_CDN_BASE_URL=' /opt/cama/deploy/.env.cafe24 | cut -d= -f2-)
timeout 120 docker run --rm --network deploy_default \
  -v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro \
  -v /opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro \
  -e SERVER_PORT=8080 \
  -e DB_URL=jdbc:postgresql://postgres:5432/cama \
  -e DB_USER=cama \
  -e DB_PASSWORD="$DBPW" \
  -e JWT_CLIENT_SECRET="$JWT" \
  -e IAMPORT_KEY= \
  -e IAMPORT_SECRET= \
  -e CAMA_STORAGE_TYPE=local \
  -e FILE_STORAGE_PATH=/opt/cama/data/cama-files \
  -e APK_STORAGE_PATH=/opt/cama/data/apk_down \
  -e APK_PUBLIC_BASE_URL=https://camaplus.cafe24.com/apk_down \
  -e IMAGE_CDN_BASE_URL="$CDN" \
  -e CAMA_CORS_ORIGINS="$CORS" \
  -e FIREBASE_CREDENTIALS_PATH=/secrets/firebase-adminsdk.json \
  eclipse-temurin:21-jre-jammy \
  java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24 2>&1
""", timeout=90)
print(o.read().decode()[-8000:])
c.close()
