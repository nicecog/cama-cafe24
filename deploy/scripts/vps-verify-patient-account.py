#!/usr/bin/env python3
"""Verify patient account management API on VPS."""
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

REMOTE = r"""
import glob
import json
import subprocess


def curl_json(args):
    r = subprocess.run(args, text=True, capture_output=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        print("raw", r.stdout[:400])
        return None


login = curl_json([
    "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/auth/doctor",
    "-H", "Content-Type: application/json",
    "-d", '{"principal":"cama","credentials":"cama!"}',
])
token = login.get("response", {}).get("apiToken") if login else None
print("login", "ok" if token else "fail")
if not token:
    raise SystemExit(1)

patients = curl_json([
    "curl", "-s",
    "http://127.0.0.1:8080/api/monitoring/patient?searchType=name&page=1&displayRow=3&lang=KO",
    "-H", f"api_key: Bearer {token}",
    "-H", f"Authorization: Bearer {token}",
])
rows = patients.get("response") or [] if patients else []
print("patients", len(rows))
if not rows:
    raise SystemExit(0)

seq = rows[0]["seq"]
detail = curl_json([
    "curl", "-s", f"http://127.0.0.1:8080/api/monitoring/account/{seq}",
    "-H", f"api_key: Bearer {token}",
    "-H", f"Authorization: Bearer {token}",
])
resp = detail.get("response") if detail else None
print("account_detail", "ok" if resp and resp.get("loginId") else detail)
if resp:
    print(
        "fields",
        resp.get("seq"),
        resp.get("name"),
        resp.get("email"),
        "pwdReset=",
        resp.get("passwordResetSupported"),
    )

js_files = glob.glob("/opt/cama/www/super-admin/assets/index-*.js")
if js_files:
    data = open(js_files[0], encoding="utf-8", errors="ignore").read()
    print("ui_patientAccount", "patientAccount" in data)
    print("ui_manageAccount", "manageAccount" in data)

pub = subprocess.run(
    [
        "curl", "-sk", "-o", "/dev/null", "-w", "%{http_code}",
        "https://camaplus.cafe24.com/admin/main/patientMng/patientAccount?seq=1&name=test",
    ],
    text=True,
    capture_output=True,
)
print("public_route_http", pub.stdout.strip())
"""

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    acc["host"],
    username=acc["user"],
    password=acc["password"],
    timeout=30,
    allow_agent=False,
    look_for_keys=False,
)
_, stdout, _ = client.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=60)
stdout.channel.recv_exit_status()
print(stdout.read().decode())
client.close()
