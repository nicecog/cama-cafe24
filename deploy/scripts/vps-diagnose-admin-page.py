#!/usr/bin/env python3
"""Diagnose /admin/ serving wrong SPA or stale build."""
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
import subprocess

def sh(cmd):
    return subprocess.run(cmd, shell=True, text=True, capture_output=True)

print("=== nginx /admin block ===")
r = sh("grep -n 'admin\\|SUPER_ADMIN\\|8083' /etc/nginx/sites-enabled/cama | head -20")
print(r.stdout or r.stderr)

print("=== curl /admin/ title ===")
for url in [
    "https://127.0.0.1/admin/",
    "https://127.0.0.1/admin/login",
]:
    c = sh(f"curl -sk {url} -H 'Host: camaplus.cafe24.com' | head -30")
    print("---", url)
    print(c.stdout[:1200])

print("=== super-admin container ===")
print(sh("docker ps --filter name=cama-super-admin --format '{{.Names}} {{.Status}}'").stdout)

print("=== super-admin index.html title ===")
print(sh("docker exec cama-super-admin head -20 /usr/share/nginx/html/index.html").stdout)

print("=== super-admin JS has NotFound / 개발진행 ===")
js = sh("docker exec cama-super-admin sh -c 'ls /usr/share/nginx/html/assets/index-*.js 2>/dev/null | head -1'").stdout.strip()
if js:
    for pat in ["개발 진행중", "AdminRouteFallback", "NotfoundPage", "CAMA-DOCTOR", "CAMA Plus Web"]:
        r = sh(f"docker exec cama-super-admin sh -c 'grep -l \"{pat}\" {js} 2>/dev/null || echo missing:{pat}'")
        print(pat, "->", r.stdout.strip())

print("=== react-app index title (patient SPA) ===")
print(sh("head -15 /opt/cama/www/react-app/index.html").stdout)

print("=== public curl ===")
print(sh("curl -sk -o /dev/null -w 'admin:%{http_code} redirect:%{redirect_url}\n' https://camaplus.cafe24.com/admin/").stdout)
"""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=90)
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
