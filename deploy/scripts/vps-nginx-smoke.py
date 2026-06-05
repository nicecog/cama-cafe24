#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

text = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = text.read_text(encoding="utf-8")
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("210.114.18.156", username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
cmds = [
    "grep -n patient_spa /etc/nginx/sites-enabled/cama",
    "curl -sk -o /dev/null -w '%{http_code}' https://127.0.0.1/webview/help -H 'Host: camaplus.cafe24.com'",
    "curl -sk https://127.0.0.1/webview/help -H 'Host: camaplus.cafe24.com' | head -c 150",
    "curl -sk -o /dev/null -w '%{http_code}' https://127.0.0.1/help -H 'Host: camaplus.cafe24.com'",
]
for cmd in cmds:
    _, o, _ = c.exec_command(cmd)
    o.channel.recv_exit_status()
    print(">>>", cmd[:70])
    print(o.read().decode())
c.close()
