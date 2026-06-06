#!/usr/bin/env python3
"""Check nginx auth forwarding and proxy chain for doctor APIs."""
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

SCRIPT = r"""
set -e
LOGIN='{"principal":"cama","credentials":"admincama!"}'
DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d "$LOGIN" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")

echo "=== nginx api_key map ==="
grep -R "proxy_api_key\|underscores_in_headers" /etc/nginx/ 2>/dev/null | head -20 || true

echo "=== /proxy location headers ==="
grep -A8 "location /proxy" /etc/nginx/sites-enabled/* 2>/dev/null | head -20 || true

echo "=== /api location headers ==="
grep -A8 "location /api" /etc/nginx/sites-enabled/* 2>/dev/null | head -20 || true

echo "=== direct 8081 proxy + api_key ==="
curl -s -o /tmp/o.json -w '8081+api_key HTTP %{http_code}\n' \
  "http://127.0.0.1:8081/proxy/api/doctor/me" -H 'Accept: application/json' -H "api_key: Bearer $DT"
head -c 120 /tmp/o.json; echo

echo "=== direct 8081 proxy + Authorization only ==="
curl -s -o /tmp/o.json -w '8081+Authorization HTTP %{http_code}\n' \
  "http://127.0.0.1:8081/proxy/api/doctor/me" -H 'Accept: application/json' -H "Authorization: Bearer $DT"
head -c 120 /tmp/o.json; echo

echo "=== nginx:80 /proxy + Authorization only ==="
curl -s -o /tmp/o.json -w 'nginx80+Authorization HTTP %{http_code}\n' \
  "http://127.0.0.1/proxy/api/doctor/me" -H 'Host: camaplus.cafe24.com' -H 'Accept: application/json' -H "Authorization: Bearer $DT"
head -c 120 /tmp/o.json; echo

echo "=== nginx:80 /api + api_key (super-admin path) ==="
curl -s -o /tmp/o.json -w 'nginx80+api HTTP %{http_code}\n' \
  "http://127.0.0.1/api/doctor/me" -H 'Host: camaplus.cafe24.com' -H 'Accept: application/json' -H "api_key: Bearer $DT"
head -c 120 /tmp/o.json; echo
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
    out = o.read().decode("utf-8", errors="replace")
    sys.stdout.buffer.write(out.encode("utf-8", errors="replace"))
    err = e.read().decode("utf-8", errors="replace")
    if err.strip():
        sys.stdout.buffer.write(("ERR: " + err).encode("utf-8", errors="replace"))
    c.close()


if __name__ == "__main__":
    main()
