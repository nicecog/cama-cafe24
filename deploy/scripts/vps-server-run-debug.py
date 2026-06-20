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
_, o, e = c.exec_command("""
docker stop cama-plus-server 2>/dev/null || true
docker run --rm --network deploy_default \
  -v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro \
  -v /opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro \
  -e SERVER_PORT=8089 \
  -e DB_URL=jdbc:postgresql://postgres:5432/cama \
  -e DB_USER=cama \
  -e DB_PASSWORD=admincama! \
  -e JWT_CLIENT_SECRET=$(grep JWT_CLIENT_SECRET /opt/cama/deploy/.env.cafe24 | cut -d= -f2) \
  -e FIREBASE_CREDENTIALS_PATH=/secrets/firebase-adminsdk.json \
  -e IAMPORT_KEY= -e IAMPORT_SECRET= \
  -e CAMA_CORS_ORIGINS=https://camaplus.cafe24.com \
  eclipse-temurin:21-jre-jammy \
  java -jar /app/app.jar --spring.profiles.active=cafe24 2>&1 | tail -60
""", timeout=120)
print(o.read().decode())
print(e.read().decode())
c.close()
