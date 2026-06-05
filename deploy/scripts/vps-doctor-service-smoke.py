#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

SCRIPT = r"""
set -e
LOGIN_JSON='{"principal":"cama","credentials":"admincama!"}'
LOGIN_RESP=$(curl -s -X POST http://127.0.0.1:8081/proxy/api/auth/doctor -H 'Content-Type: application/json' -d "$LOGIN_JSON")
TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
echo "TOKEN ok len=${#TOKEN}"
curl -s -w "\nHTTP:%{http_code}\n" 'http://127.0.0.1:8081/proxy/api/doctor/service?page=1' \
  -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" | tail -5
curl -sk -w "\nPUBLIC_HTTP:%{http_code}\n" 'https://camaplus.cafe24.com/proxy/api/doctor/service?page=1' \
  -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" | tail -5
"""


def main() -> None:
    import paramiko

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, e = c.exec_command(SCRIPT, timeout=120)
    print(o.read().decode())
    err = e.read().decode()
    if err.strip():
        print("ERR:", err)
    c.close()


if __name__ == "__main__":
    main()
