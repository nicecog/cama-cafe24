#!/usr/bin/env python3
"""Patch nginx /api/ location to forward JWT headers like /proxy/."""
from __future__ import annotations

import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

PATCH = r'''
python3 <<'PY'
from pathlib import Path
p = Path("/etc/nginx/sites-enabled/cama")
text = p.read_text()
old_block = """    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }"""
new_block = """    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header api_key $proxy_api_key;
        proxy_set_header Authorization $http_authorization;
    }"""
if "proxy_set_header api_key $proxy_api_key" in text.split("location /api/")[1].split("location ")[0]:
    print("already patched")
elif old_block in text:
    p.write_text(text.replace(old_block, new_block, 1))
    print("patched /api/ block")
else:
    raise SystemExit("unexpected /api/ block shape")
PY
nginx -t
systemctl reload nginx
grep -A12 'location /api/' /etc/nginx/sites-enabled/cama | head -14
'''


def main() -> None:
    import paramiko
    import sys

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, e = c.exec_command(PATCH, timeout=60)
    o.channel.recv_exit_status()
    sys.stdout.buffer.write(o.read())
    err = e.read().decode("utf-8", errors="replace")
    if err.strip():
        sys.stdout.buffer.write(("ERR: " + err).encode())
    c.close()


if __name__ == "__main__":
    main()
