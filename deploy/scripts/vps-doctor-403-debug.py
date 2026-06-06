#!/usr/bin/env python3
"""Diagnose 403 on /api/doctor/* and /api/monitoring/* after login."""
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

SCRIPT = r"""
set -e
LOGIN='{"principal":"cama","credentials":"admincama!"}'
ADMIN_LOGIN='{"principal":"happycog","credentials":"CamaAdmin2026!"}'

doctor_token() {
  curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d "$LOGIN" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])"
}
admin_token() {
  curl -s -X POST http://127.0.0.1:8080/api/auth/admin -H 'Content-Type: application/json' -d "$ADMIN_LOGIN" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])"
}

show_roles() {
  local tok="$1" label="$2"
  echo "=== $label roles ==="
  python3 -c "import json,base64; t='$tok'.split('.')[1]; t+='='*(-len(t)%4); print(json.loads(base64.urlsafe_b64decode(t)).get('roles'))"
}

test_code() {
  local label="$1" tok="$2" path="$3"
  code=$(curl -s -o /tmp/out.json -w '%{http_code}' "$path" -H 'Accept: application/json' -H "api_key: Bearer $tok")
  echo "$label -> HTTP $code $(head -c 100 /tmp/out.json)"
}

DT=$(doctor_token)
AT=$(admin_token)
show_roles "$DT" "doctor"
show_roles "$AT" "admin"

test_code "doctor+doctor/me" "$DT" "http://127.0.0.1:8080/api/doctor/me"
test_code "doctor+monitoring" "$DT" "http://127.0.0.1:8080/api/monitoring/patient?page=1&searchType=name&searchText="
test_code "admin+doctor/me" "$AT" "http://127.0.0.1:8080/api/doctor/me"
test_code "admin+monitoring" "$AT" "http://127.0.0.1:8080/api/monitoring/patient?page=1&searchType=name&searchText="
test_code "admin+admin/hospital" "$AT" "http://127.0.0.1:8080/api/admin/hospital/list?page=1&searchText="

code=$(curl -s -o /tmp/out.json -w '%{http_code}' "http://127.0.0.1:8080/api/doctor/me" -H 'Accept: application/json' -H "Authorization: Bearer $DT")
echo "doctor+Authorization header -> HTTP $code $(head -c 80 /tmp/out.json)"
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
    out = o.read().decode("utf-8", errors="replace")
    import sys
    sys.stdout.buffer.write(out.encode("utf-8", errors="replace"))
    sys.stdout.buffer.write(b"\n")
    err = e.read().decode("utf-8", errors="replace")
    if err.strip():
        print("ERR:", err)
    c.close()


if __name__ == "__main__":
    main()
