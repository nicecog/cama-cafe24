#!/usr/bin/env python3
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
host, pw = "210.114.18.156", "admincama!"
if ACCESS.is_file():
    t = ACCESS.read_text(encoding="utf-8")
    if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", t):
        host = m.group(1)
    if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", t):
        pw = m.group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

cmds = [
    "curl -s -o /dev/null -w 'vital_put=%{http_code}\\n' -X PUT http://127.0.0.1:8080/api/track/service/vital -H 'Content-Type: application/json' -d '{}'",
    "curl -s -o /dev/null -w 'qr_issue=%{http_code}\\n' -X POST http://127.0.0.1:8080/api/tablet/qr/issue",
    "docker logs cama-back-batch 2>&1 | tail -8",
]
for cmd in cmds:
    _, o, e = c.exec_command(cmd, timeout=30)
    time.sleep(0.5)
    print(o.read().decode(errors="replace"))
    err = e.read().decode(errors="replace")
    if err:
        print(err)
c.close()
