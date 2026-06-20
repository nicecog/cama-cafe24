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

script = """
python3 - <<'PY'
from pathlib import Path
patch = '''
    location /apk_down/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 55m;
    }
'''
for p in [Path('/etc/nginx/sites-enabled/cama'), Path('/etc/nginx/sites-available/cama')]:
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    if 'location /apk_down/' in text:
        print(p, 'already ok')
        continue
    needle = 'location /files/'
    idx = text.find(needle)
    if idx < 0:
        print(p, 'no files block')
        continue
    end = text.find('}', idx)
    end = text.find('}', end + 1)
    p.write_text(text[:end+1] + patch + text[end+1:], encoding='utf-8')
    print(p, 'patched')
PY
nginx -t && systemctl reload nginx
curl -s -o /dev/null -w 'nginx_apk=%{http_code}\\n' -H 'Host: camaplus.cafe24.com' http://127.0.0.1/apk_down/cama-plus-cafe24-2026-06-17.apk
curl -s -o /dev/null -w 'public=%{http_code}\\n' https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-17.apk
"""

_, o, e = client.exec_command(script, timeout=60)
o.channel.recv_exit_status()
print(o.read().decode())
print(e.read().decode())
client.close()
