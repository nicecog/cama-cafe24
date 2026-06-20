#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
user = re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30, allow_agent=False, look_for_keys=False)

_, o, _ = client.exec_command("""
for u in \
  'https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-17.apk' \
  'https://camaplus.cafe24.com/files/' \
  'https://camaplus.cafe24.com/admin/' \
  'http://127.0.0.1/apk_down/cama-plus-cafe24-2026-06-17.apk' \
  'http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk'
do
  echo -n "$u -> "
  curl -s -o /dev/null -w '%{http_code} redirect=%{redirect_url}\n' -L "$u"
done
grep -A6 'location /apk_down' /etc/nginx/sites-enabled/cama
""")
o.channel.recv_exit_status()
print(o.read().decode())
client.close()
