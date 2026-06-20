#!/usr/bin/env python3
"""Recreate cama-doctor-web with /legacy servlet context."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"


def main() -> int:
    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)

    cmd = r"""
set -e
docker stop cama-doctor-web || true
docker rm cama-doctor-web || true
docker run -d --name cama-doctor-web \
  --restart unless-stopped \
  --network deploy_default \
  -p 127.0.0.1:8081:8081 \
  -v /opt/cama/jars/cama-doctor-web-0.0.1-SNAPSHOT.jar:/app/app.jar:ro \
  -e SERVER_PORT=8081 \
  -e DOCTOR_DB_URL=jdbc:postgresql://postgres:5432/cama_doctor \
  -e DOCTOR_DB_USER=cama \
  -e DOCTOR_DB_PASSWORD=admincama! \
  -e CAMA_BILLIVE_BASE_URL=http://cama-plus-server:8080 \
  -e CAMA_FIREBASE_ENABLED=false \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  eclipse-temurin:21-jre-jammy \
  java -Xms128m -Xmx512m -jar /app/app.jar \
    --spring.profiles.active=cafe24 \
    --server.servlet.context-path=/legacy
sleep 12
curl -s -o /dev/null -w 'legacy_login:%{http_code}\n' http://127.0.0.1:8081/legacy/login
curl -s -o /dev/null -w 'legacy_list:%{http_code}\n' http://127.0.0.1:8081/legacy/content-management/treatment/done/list
"""
    _, o, e = c.exec_command(cmd)
    code = o.channel.recv_exit_status()
    out = o.read().decode() + e.read().decode()
    print(out)
    c.close()
    return code


if __name__ == "__main__":
    raise SystemExit(main())
