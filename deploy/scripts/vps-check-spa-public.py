#!/usr/bin/env python3
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
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command(r"""
BASE=https://camaplus.cafe24.com
for path in /coaching/ /webview/ /content/ /help /assets/index-QhX5x4Al.js; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE$path")
  echo "$path -> HTTP $code"
done
echo "--- coaching HTML snippet ---"
curl -s "$BASE/coaching/" | head -c 280
echo
echo "--- file count ---"
find /opt/cama/www/react-app -type f | wc -l
""", timeout=60)
print(o.read().decode(errors="replace"))
c.close()
