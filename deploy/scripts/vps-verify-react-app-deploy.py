#!/usr/bin/env python3
"""Verify react-app-dawplus deployment on Cafe24 VPS."""
from __future__ import annotations

import re
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
REMOTE_WWW = "/opt/cama/www/react-app"
PUBLIC_BASE = "https://camaplus.cafe24.com"


def load_access() -> dict[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


def main() -> None:
    acc = load_access()
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    script = f"""
echo "=== www directory ==="
ls -la {REMOTE_WWW} 2>/dev/null | head -15 || echo "MISSING: {REMOTE_WWW}"

echo "=== index.html ==="
if [ -f {REMOTE_WWW}/index.html ]; then
  stat -c 'size=%s mtime=%y' {REMOTE_WWW}/index.html
  head -c 200 {REMOTE_WWW}/index.html
  echo
else
  echo "NO index.html"
fi

echo "=== assets sample ==="
ls {REMOTE_WWW}/assets 2>/dev/null | head -5 || echo "no assets dir"

echo "=== nginx react-app root ==="
grep -n "react-app" /etc/nginx/sites-enabled/cama 2>/dev/null | head -12 || echo "no nginx match"

echo "=== local HTTP (nginx -> static) ==="
curl -s -o /dev/null -w 'GET / HTTP %{{http_code}}\\n' http://127.0.0.1:8080/ 2>/dev/null || true
curl -s -o /dev/null -w 'GET /home HTTP %{{http_code}}\\n' -H 'Host: camaplus.cafe24.com' http://127.0.0.1/ 2>/dev/null || true

echo "=== public HTTPS ==="
curl -s -o /dev/null -w 'GET / HTTP %{{http_code}}\\n' {PUBLIC_BASE}/
curl -s -o /dev/null -w 'GET /login HTTP %{{http_code}}\\n' {PUBLIC_BASE}/login
curl -sI {PUBLIC_BASE}/ | grep -iE 'HTTP/|content-type|server' | head -5

echo "=== index asset refs ==="
grep -oE 'src="/assets/[^"]+"' {REMOTE_WWW}/index.html 2>/dev/null | head -3
FIRST_JS=$(grep -oE '/assets/[^"]+\\.js' {REMOTE_WWW}/index.html 2>/dev/null | head -1)
if [ -n "$FIRST_JS" ]; then
  curl -s -o /dev/null -w "asset $FIRST_JS HTTP %{{http_code}}\\n" "{PUBLIC_BASE}$FIRST_JS"
fi
"""
    _, o, e = c.exec_command(script, timeout=90)
    o.channel.recv_exit_status()
    print(o.read().decode(errors="replace"))
    err = e.read().decode(errors="replace").strip()
    if err:
        print("STDERR:", err[:500])
    c.close()


if __name__ == "__main__":
    main()
