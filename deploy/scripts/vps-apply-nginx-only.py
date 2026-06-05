#!/usr/bin/env python3
"""Re-apply patient SPA nginx block only."""
import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"
snippet = REPO_ROOT / "deploy" / "nginx" / "cama-patient-spa-locations.conf"
apply_py = SCRIPT_DIR / "apply-patient-spa-nginx.py"

text = ACCESS_LOCAL.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
sftp = c.open_sftp()
sftp.put(str(snippet), "/tmp/cama-patient-spa-locations.conf")
sftp.put(str(apply_py), "/tmp/apply-patient-spa-nginx.py")
sftp.close()
_, o, e = c.exec_command(
    "python3 /tmp/apply-patient-spa-nginx.py /tmp/cama-patient-spa-locations.conf "
    "&& nginx -t && systemctl reload nginx"
)
o.channel.recv_exit_status()
print(o.read().decode())
err = e.read().decode()
if err:
    print(err, file=sys.stderr)
_, o, _ = c.exec_command(
    "curl -sk -o /dev/null -w '%{http_code}' https://127.0.0.1/webview/help "
    "-H 'Host: camaplus.cafe24.com'"
)
o.channel.recv_exit_status()
print("webview/help ->", o.read().decode().strip())
c.close()
