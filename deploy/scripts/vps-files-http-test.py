#!/usr/bin/env python3
import re, time, paramiko
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
host, pw = "210.114.18.156", "admincama!"
if ACCESS.is_file():
    t = ACCESS.read_text(encoding="utf-8")
    if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", t):
        host = m.group(1)
    if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", t):
        pw = m.group(1)

sample = "/files/upload/2026-05-13/329a4bea16ff4970ac7edc4881d9c4d5.jpeg"
cmds = [
    f"curl -sS -o /dev/null -w '%{{http_code}}' http://127.0.0.1:8080{sample}",
    f"curl -sS -I http://127.0.0.1:8080{sample} | head -5",
    f"curl -sS -o /dev/null -w '%{{http_code}}' -k https://camaplus.cafe24.com{sample}",
    "grep -R 'location /files' /etc/nginx/sites-enabled/ 2>/dev/null || true",
]
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30)
for cmd in cmds:
    _, o, e = c.exec_command(cmd)
    time.sleep(2)
    print(">", cmd)
    print((o.read() + e.read()).decode(errors="replace").strip())
    print()
c.close()
