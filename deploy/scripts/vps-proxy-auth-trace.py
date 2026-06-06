#!/usr/bin/env python3
"""Trace Authorization-only path through doctor-web proxy."""
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

SCRIPT = r"""
LOGIN='{"principal":"cama","credentials":"admincama!"}'
DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d "$LOGIN" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")

echo "=== API direct api_key ==="
curl -s -o /tmp/o.json -w 'HTTP %{http_code}\n' \
  "http://127.0.0.1:8080/api/doctor/me" -H 'Accept: application/json' -H "api_key: Bearer $DT"

echo "=== API direct Authorization (before filter fix) ==="
curl -s -o /tmp/o.json -w 'HTTP %{http_code}\n' \
  "http://127.0.0.1:8080/api/doctor/me" -H 'Accept: application/json' -H "Authorization: Bearer $DT"
head -c 100 /tmp/o.json; echo

echo "=== simulate proxy: curl 8080 with api_key from Authorization value ==="
curl -s -o /tmp/o.json -w 'HTTP %{http_code}\n' \
  "http://127.0.0.1:8080/api/doctor/me" -H 'Accept: application/json' -H "api_key: Bearer $DT"

echo "=== 8081 proxy verbose Authorization ==="
curl -sv "http://127.0.0.1:8081/proxy/api/doctor/me" -H 'Accept: application/json' -H "Authorization: Bearer $DT" 2>&1 | tail -15

echo "=== admin token doctor/me ==="
ADMIN_LOGIN='{"principal":"happycog","credentials":"CamaAdmin2026!"}'
AT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/admin -H 'Content-Type: application/json' -d "$ADMIN_LOGIN" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
curl -s -o /tmp/o.json -w 'admin doctor/me HTTP %{http_code}\n' \
  "http://127.0.0.1:8080/api/doctor/me" -H 'Accept: application/json' -H "api_key: Bearer $AT"
head -c 100 /tmp/o.json; echo
"""


def main() -> None:
    import paramiko
    import sys

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, e = c.exec_command(SCRIPT, timeout=120)
    sys.stdout.buffer.write(o.read())
    err = e.read().decode("utf-8", errors="replace")
    if err.strip():
        sys.stdout.buffer.write(("ERR: " + err).encode())
    c.close()


if __name__ == "__main__":
    main()
