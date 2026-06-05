#!/usr/bin/env python3
import json
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)


def post(path, data):
    body = json.dumps(data, ensure_ascii=False).replace("'", "'\\''")
    _, o, _ = c.exec_command(
        "curl -sS -w '\\nHTTP:%{http_code}' -X POST -H 'Content-Type: application/json' "
        f"-d '{body}' http://127.0.0.1:8080{path}"
    )
    time.sleep(1)
    print(f"=== POST {path} {data} ===")
    print(o.read().decode(errors="replace"))


post("/api/public/patient/recover/password", {})
post("/api/public/patient/recover/password", {"name": "최완규"})
post(
    "/api/public/patient/recover/password",
    {"name": "최완규", "phone": "01032984763", "email": "wrong@example.com"},
)
post(
    "/api/public/patient/recover/password",
    {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
)
post(
    "/api/account/patient/find/password",
    {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
)

# GET should be 405 if route exists
_, o, _ = c.exec_command(
    "curl -sS -w '\\nHTTP:%{http_code}' http://127.0.0.1:8080/api/public/patient/recover/password"
)
time.sleep(1)
print("=== GET /api/public/patient/recover/password ===")
print(o.read().decode(errors="replace"))

c.close()
