#!/usr/bin/env python3
"""Show enabled vs deliverable token mismatch counts."""
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
PG = subprocess.run("docker ps --format '{{.Names}}' | grep -i postgres | head -1", shell=True, text=True, capture_output=True).stdout.strip()
q1 = "SELECT count(DISTINCT account_seq) FROM firebase_token WHERE is_enabled AND token='web-no-fcm';"
q2 = "SELECT count(DISTINCT d.account_seq) FROM firebase_token d WHERE d.is_enabled=false AND d.token NOT IN ('test','web-no-fcm') AND length(d.token)>10 AND EXISTS (SELECT 1 FROM firebase_token e WHERE e.account_seq=d.account_seq AND e.is_enabled AND e.token='web-no-fcm');"
print('enabled_web_no_fcm_accounts', subprocess.run(f'docker exec {PG} psql -U cama -d cama -t -c "{q1}"', shell=True, text=True, capture_output=True).stdout.strip())
print('web_no_fcm_with_old_native_tokens', subprocess.run(f'docker exec {PG} psql -U cama -d cama -t -c "{q2}"', shell=True, text=True, capture_output=True).stdout.strip())
q3 = "SELECT account_seq, is_enabled, platform, left(token,16) tok FROM firebase_token WHERE account_seq=121 ORDER BY updated_at DESC;"
print(subprocess.run(f'docker exec {PG} psql -U cama -d cama -c "{q3}"', shell=True, text=True, capture_output=True).stdout)
"""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=60)
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
