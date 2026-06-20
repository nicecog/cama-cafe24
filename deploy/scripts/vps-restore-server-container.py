#!/usr/bin/env python3
"""Restore cama-plus-server using docker run with full env (workaround compose recreate bug)."""
from __future__ import annotations

import os
import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
    user = os.environ.get("CAMA_VPS_USER", "root")
    password = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def main() -> None:
    import paramiko

    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    script = r"""
set -a
source /opt/cama/deploy/.env.cafe24
set +a

docker rm -f cama-plus-server 2>/dev/null || true

docker run -d --name cama-plus-server \
  --network deploy_default \
  --restart unless-stopped \
  -p 127.0.0.1:8080:8080 \
  -v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro \
  -v /opt/cama/data/cama-files:/opt/cama/data/cama-files \
  -v /opt/cama/data/apk_down:/opt/cama/data/apk_down \
  -v /opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro \
  -w /app \
  eclipse-temurin:21-jre-jammy \
  java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24 \
  -e SERVER_PORT=8080 \
  -e DB_URL=jdbc:postgresql://postgres:5432/cama \
  -e DB_USER="${POSTGRES_USER:-cama}" \
  -e DB_PASSWORD="${POSTGRES_PASSWORD}" \
  -e JWT_CLIENT_SECRET="${JWT_CLIENT_SECRET}" \
  -e IAMPORT_KEY="${IAMPORT_KEY:-}" \
  -e IAMPORT_SECRET="${IAMPORT_SECRET:-}" \
  -e CAMA_STORAGE_TYPE="${CAMA_STORAGE_TYPE:-local}" \
  -e FILE_STORAGE_PATH="${FILE_STORAGE_PATH:-/opt/cama/data/cama-files}" \
  -e APK_STORAGE_PATH="${APK_STORAGE_PATH:-/opt/cama/data/apk_down}" \
  -e APK_PUBLIC_BASE_URL="${APK_PUBLIC_BASE_URL:-https://camaplus.cafe24.com/apk_down}" \
  -e IMAGE_CDN_BASE_URL="${IMAGE_CDN_BASE_URL}" \
  -e CAMA_CORS_ORIGINS="${CAMA_CORS_ORIGINS}" \
  -e CAMA_MAIL_ENABLED="${CAMA_MAIL_ENABLED:-false}" \
  -e CAMA_MAIL_FROM="${CAMA_MAIL_FROM:-noreply@camaplus.com}" \
  -e CAMA_MAIL_PROVIDER="${CAMA_MAIL_PROVIDER:-smtp}" \
  -e "CAMA_MAIL_SENDER_NAME=${CAMA_MAIL_SENDER_NAME:-CAMA Plus}" \
  -e BREVO_API_KEY="${BREVO_API_KEY:-}" \
  -e SPRING_MAIL_HOST="${SPRING_MAIL_HOST:-}" \
  -e SPRING_MAIL_PORT="${SPRING_MAIL_PORT:-587}" \
  -e SPRING_MAIL_USERNAME="${SPRING_MAIL_USERNAME:-}" \
  -e SPRING_MAIL_PASSWORD="${SPRING_MAIL_PASSWORD:-}" \
  -e FIREBASE_CREDENTIALS_PATH="${FIREBASE_CREDENTIALS_PATH:-/secrets/firebase-adminsdk.json}"

sleep 30
docker ps --filter name=cama-plus-server --format '{{.Names}} {{.Status}}'
docker logs --tail 15 cama-plus-server 2>&1
curl -s -o /dev/null -w 'recover HTTP %{http_code}\n' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id -H 'Content-Type: application/json' -d '{"name":"test","phone":"01000000000"}'
"""
    # Fix docker run - env vars must come BEFORE image name
    script = r"""
set -a
source /opt/cama/deploy/.env.cafe24
set +a

docker rm -f cama-plus-server 2>/dev/null || true

docker run -d --name cama-plus-server \
  --network deploy_default \
  --restart unless-stopped \
  -p 127.0.0.1:8080:8080 \
  -v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro \
  -v /opt/cama/data/cama-files:/opt/cama/data/cama-files \
  -v /opt/cama/data/apk_down:/opt/cama/data/apk_down \
  -v /opt/cama/secrets/firebase-adminsdk.json:/secrets/firebase-adminsdk.json:ro \
  -w /app \
  -e SERVER_PORT=8080 \
  -e DB_URL=jdbc:postgresql://postgres:5432/cama \
  -e DB_USER="${POSTGRES_USER:-cama}" \
  -e DB_PASSWORD="${POSTGRES_PASSWORD}" \
  -e JWT_CLIENT_SECRET="${JWT_CLIENT_SECRET}" \
  -e IAMPORT_KEY="${IAMPORT_KEY:-}" \
  -e IAMPORT_SECRET="${IAMPORT_SECRET:-}" \
  -e CAMA_STORAGE_TYPE="${CAMA_STORAGE_TYPE:-local}" \
  -e FILE_STORAGE_PATH="${FILE_STORAGE_PATH:-/opt/cama/data/cama-files}" \
  -e APK_STORAGE_PATH="${APK_STORAGE_PATH:-/opt/cama/data/apk_down}" \
  -e APK_PUBLIC_BASE_URL="${APK_PUBLIC_BASE_URL:-https://camaplus.cafe24.com/apk_down}" \
  -e IMAGE_CDN_BASE_URL="${IMAGE_CDN_BASE_URL}" \
  -e CAMA_CORS_ORIGINS="${CAMA_CORS_ORIGINS}" \
  -e CAMA_MAIL_ENABLED="${CAMA_MAIL_ENABLED:-false}" \
  -e CAMA_MAIL_FROM="${CAMA_MAIL_FROM:-noreply@camaplus.com}" \
  -e CAMA_MAIL_PROVIDER="${CAMA_MAIL_PROVIDER:-smtp}" \
  -e "CAMA_MAIL_SENDER_NAME=${CAMA_MAIL_SENDER_NAME:-CAMA Plus}" \
  -e BREVO_API_KEY="${BREVO_API_KEY:-}" \
  -e SPRING_MAIL_HOST="${SPRING_MAIL_HOST:-}" \
  -e SPRING_MAIL_PORT="${SPRING_MAIL_PORT:-587}" \
  -e SPRING_MAIL_USERNAME="${SPRING_MAIL_USERNAME:-}" \
  -e SPRING_MAIL_PASSWORD="${SPRING_MAIL_PASSWORD:-}" \
  -e FIREBASE_CREDENTIALS_PATH="${FIREBASE_CREDENTIALS_PATH:-/secrets/firebase-adminsdk.json}" \
  eclipse-temurin:21-jre-jammy \
  java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24

sleep 35
docker ps --filter name=cama-plus-server --format '{{.Names}} {{.Status}}'
curl -s -o /dev/null -w 'recover HTTP %{http_code}\n' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id -H 'Content-Type: application/json' -d '{"name":"test","phone":"01000000000"}'
docker logs cama-plus-server 2>&1 | grep -i Firebase | tail -3
"""
    _, o, e = client.exec_command(script, timeout=120)
    print(o.read().decode())
    print(e.read().decode())
    client.close()


if __name__ == "__main__":
    main()
