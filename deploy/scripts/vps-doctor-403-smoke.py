#!/usr/bin/env python3
"""Post-deploy smoke: doctor/monitoring APIs after 403 fix."""
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

SCRIPT = r"""
set -e
LOGIN='{"principal":"cama","credentials":"admincama!"}'
ADMIN='{"principal":"happycog","credentials":"CamaAdmin2026!"}'
DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d "$LOGIN" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
AT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/admin -H 'Content-Type: application/json' -d "$ADMIN" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")

test() {
  local label="$1" url="$2" tok="$3" hdr="$4"
  code=$(curl -s -o /tmp/o.json -w '%{http_code}' "$url" -H 'Accept: application/json' -H "$hdr: Bearer $tok")
  echo "$label -> HTTP $code $(head -c 80 /tmp/o.json)"
}

test "doctor+api+monitoring" "http://127.0.0.1:8080/api/monitoring/patient?page=1&searchType=name&searchText=" "$DT" api_key
test "doctor+authz+monitoring" "http://127.0.0.1:8080/api/monitoring/patient?page=1&searchType=name&searchText=" "$DT" Authorization
test "proxy+authz+doctor/me" "http://127.0.0.1:8081/proxy/api/doctor/me" "$DT" Authorization
test "proxy+authz+monitoring" "http://127.0.0.1:8081/proxy/api/monitoring/patient?page=1&searchType=name&searchText=" "$DT" Authorization
test "admin+api+doctor/me" "http://127.0.0.1:8080/api/doctor/me" "$AT" api_key
test "admin+authz+monitoring" "http://127.0.0.1:8080/api/monitoring/patient?page=1&searchType=name&searchText=" "$AT" Authorization
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
