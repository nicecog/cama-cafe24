#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko
ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {"host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1), "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1), "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)}
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
script = """
docker exec cama-plus-server printenv APK_STORAGE_PATH APK_PUBLIC_BASE_URL 2>/dev/null || true
docker exec cama-plus-server ls -la /opt/cama/data/apk_down/ 2>/dev/null | head -6
docker logs cama-plus-server 2>&1 | grep 'APK storage' | tail -1
curl -s -o /dev/null -w 'apk8080=%{http_code}\\n' http://127.0.0.1:8080/apk_down/app-release.apk
ls /opt/cama/www/super-admin/assets/ 2>/dev/null | head -5
grep -l 'doctor/apk/list' /opt/cama/www/super-admin/assets/*.js 2>/dev/null | head -1
"""
_, o, _ = c.exec_command(script, timeout=60)
print(o.read().decode())
c.close()
