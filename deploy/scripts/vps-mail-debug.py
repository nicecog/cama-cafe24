#!/usr/bin/env python3
import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

for label, cmd in [
    ("status", 'docker ps --filter name=cama-plus-server --format "{{.Names}} {{.Status}}"'),
    ("env", "docker exec cama-plus-server env | grep -E 'MAIL|SPRING' | sort"),
    ("logs", "docker logs --tail 40 cama-plus-server 2>&1"),
]:
    print(f"=== {label} ===")
    _, o, _ = c.exec_command(cmd)
    time.sleep(1)
    for line in o.read().decode(errors="replace").splitlines():
        if "SPRING_MAIL_PASSWORD" in line:
            print("SPRING_MAIL_PASSWORD=***")
        else:
            print(line)

for path, data in [
    ("/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"}),
    ("/api/account/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"}),
    ("/api/account/patient/find/password", {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"}),
    (
        "/api/public/patient/recover/password",
        {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
    ),
    (
        "/api/account/patient/recover/password",
        {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
    ),
    (
        "/api/public/patient/recover/reset-password",
        {"loginId": "happycog", "name": "최완규", "phone": "01032984763"},
    ),
]:
    body = json.dumps(data, ensure_ascii=False).replace("'", "'\\''")
    print(f"=== POST {path} (localhost) ===")
    _, o, _ = c.exec_command(
        f"curl -sS -w '\\nHTTP:%{{http_code}}' -X POST -H 'Content-Type: application/json' "
        f"-d '{body}' http://127.0.0.1:8080{path}"
    )
    time.sleep(1)
    print(o.read().decode(errors="replace"))

print("=== POST via nginx https ===")
body = json.dumps(
    {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
    ensure_ascii=False,
).replace("'", "'\\''")
_, o, _ = c.exec_command(
    "curl -sk -w '\\nHTTP:%{http_code}' -X POST -H 'Content-Type: application/json' "
    f"-d '{body}' https://127.0.0.1/api/public/patient/recover/password -H 'Host: camaplus.cafe24.com'"
)
time.sleep(1)
print(o.read().decode(errors="replace"))

c.close()
