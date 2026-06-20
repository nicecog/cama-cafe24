#!/usr/bin/env python3
"""Check happycog FCM tokens and monitoring API response."""
import json
import re
import subprocess
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}

REMOTE = r'''
import json, subprocess

def curl(args):
    r = subprocess.run(args, text=True, capture_output=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return r.stdout

login = curl(["curl","-s","-X","POST","http://127.0.0.1:8080/api/auth/doctor","-H","Content-Type: application/json","-d",'{"principal":"cama","credentials":"cama!"}'])
token = login["response"]["apiToken"]
h = ["-H", f"api_key: Bearer {token}", "-H", f"Authorization: Bearer {token}"]

for label, url in [
    ("name_최완규", "http://127.0.0.1:8080/api/monitoring/patient?searchType=name&searchText=%EC%B5%9C%EC%99%84%EA%B7%9C&page=1&displayRow=10&lang=KO"),
    ("loginId_happycog", "http://127.0.0.1:8080/api/monitoring/patient?searchType=loginId&searchText=happycog&page=1&displayRow=10&lang=KO"),
    ("name_happycog", "http://127.0.0.1:8080/api/monitoring/patient?searchType=name&searchText=happycog&page=1&displayRow=10&lang=KO"),
]:
    data = curl(["curl","-s",url,*h])
    rows = data.get("response") or []
    print("===", label, "count=", len(rows))
    for row in rows:
        if row.get("loginId")=="happycog" or "최완" in (row.get("name") or ""):
            print(json.dumps(row, ensure_ascii=False))

pg = subprocess.run("docker ps --format '{{.Names}}' | grep -i postgres | head -1", shell=True, text=True, capture_output=True).stdout.strip()
sql = """SELECT seq, account_seq, is_enabled, length(token) len, left(token,20) p, updated_at FROM firebase_token WHERE account_seq=(SELECT seq FROM account WHERE login_id='happycog') ORDER BY updated_at DESC;"""
r = subprocess.run(f'docker exec {pg} psql -U cama -d cama -c "{sql}"', shell=True, text=True, capture_output=True)
print("=== DB tokens ===")
print(r.stdout)
'''

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, e = c.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=60)
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
