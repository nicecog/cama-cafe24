#!/usr/bin/env python3
"""Smoke-test Brevo transactional email API from VPS."""
import json
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
LOCAL = Path(__file__).resolve().parents[2] / "local-cafe24.mail.env"

text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

api_key = ""
for line in LOCAL.read_text(encoding="utf-8").splitlines():
    if line.startswith("BREVO_API_KEY="):
        api_key = line.partition("=")[2].strip()
        break

payload = json.dumps(
    {
        "sender": {"name": "CAMA Plus", "email": "noreply@camaplus.com"},
        "to": [{"email": "happycog@gmail.com"}],
        "subject": "[CAMA] Brevo API test",
        "textContent": "Brevo API smoke test from VPS.",
    },
    ensure_ascii=False,
).replace("'", "'\\''")

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

cmd = (
    "curl -sS -w '\\nHTTP:%{http_code}' -X POST https://api.brevo.com/v3/smtp/email "
    f"-H 'api-key: {api_key}' -H 'Content-Type: application/json' "
    f"-d '{payload}'"
)
_, o, e = c.exec_command(cmd, timeout=60)
time.sleep(3)
print(o.read().decode(errors="replace"))
err = e.read().decode(errors="replace")
if err:
    print(err)
c.close()
