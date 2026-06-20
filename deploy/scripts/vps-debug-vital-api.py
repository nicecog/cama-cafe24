#!/usr/bin/env python3
"""Debug vital API on VPS via localhost curl."""
from __future__ import annotations

import base64
import re
import sys
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def load_ssh() -> tuple[str, str, str]:
    host, pw, user = "210.114.18.156", "admincama!", "root"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
    return host, pw, user


REMOTE_SCRIPT = r"""#!/bin/bash
set -e
RESP=$(curl -s -X POST http://127.0.0.1:8080/api/public/patient/recover/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"loginId":"happycog","name":"최완규","phone":"01032984763"}')
PW=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['temporaryPassword'])")
AUTH=$(curl -s -X POST http://127.0.0.1:8080/api/auth \
  -H 'Content-Type: application/json' \
  -d "{\"principal\":\"happycog\",\"credentials\":\"$PW\",\"firebase\":{\"device\":\"t\",\"platform\":\"ANDROID\",\"token\":\"x\"}}")
TOKEN=$(echo "$AUTH" | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
echo "=== PUT vital ==="
curl -s -w "\nHTTP=%{http_code}\n" -X PUT http://127.0.0.1:8080/api/track/service/vital \
  -H "Content-Type: application/json" \
  -H "api_key: Bearer $TOKEN" \
  -d '{"measuredAt":"2026-06-17 10:00:00","vitalTypeCd":"HEART_RATE","valueNum":72,"unit":"bpm","sourceCd":"PHONE"}'
echo "=== POST vitalList ==="
curl -s -w "\nHTTP=%{http_code}\n" -X POST http://127.0.0.1:8080/api/track/service/vitalList \
  -H "Content-Type: application/json" \
  -H "api_key: Bearer $TOKEN" \
  -d '{"vitalTypeCd":"HEART_RATE","fromDate":"2026-01-01","toDate":"2026-12-31"}'
echo "=== docker logs tail ==="
docker logs cama-plus-server --tail 40 2>&1 | tail -25
"""


def main() -> int:
    host, pw, user = load_ssh()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    b64 = base64.b64encode(REMOTE_SCRIPT.encode()).decode()
    _, stdout, stderr = client.exec_command(f"echo {b64} | base64 -d | bash", timeout=120)
    time.sleep(4)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    print(out)
    if err.strip():
        print("STDERR:", err, file=sys.stderr)
    client.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
