#!/usr/bin/env python3
"""Remove orphaned proxy_pass lines from broken nginx apply."""
import re
from pathlib import Path
import paramiko

access = Path("deploy/CAFE24_VPS_ACCESS.local.md").read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", access).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", access).group(1)
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)

fix_py = r'''
from pathlib import Path
import re
p = Path("/etc/nginx/sites-enabled/cama")
text = p.read_text(encoding="utf-8")
text = re.sub(
    r"\n        proxy_pass http://127\.0\.0\.1:8081;[\s\S]*?\n    \}\n(\n    listen 443)",
    r"\n\1",
    text,
    count=1,
)
p.write_text(text, encoding="utf-8")
print("orphan block removed")
'''
sftp = c.open_sftp()
with sftp.open("/tmp/fix-nginx-orphan.py", "w") as f:
    f.write(fix_py)
sftp.close()
for cmd in ["python3 /tmp/fix-nginx-orphan.py", "nginx -t"]:
    _, o, e = c.exec_command(cmd)
    code = o.channel.recv_exit_status()
    print(o.read().decode() + e.read().decode())
    if code != 0:
        break
c.close()
