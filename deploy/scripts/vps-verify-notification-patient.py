#!/usr/bin/env python3
"""Verify monitoring patient list returns hasFcmToken."""
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
import json, subprocess, shlex

def curl_json(args):
    r = subprocess.run(args, text=True, capture_output=True)
    print(r.stdout[:2000])
    if r.stderr.strip():
        print('stderr', r.stderr[:500])
    try:
        return json.loads(r.stdout)
    except Exception as e:
        print('json err', e)
        return None

login = curl_json([
    "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/auth/doctor",
    "-H", "Content-Type: application/json",
    "-d", '{"principal":"cama","credentials":"cama!"}',
])
token = login.get('response', {}).get('apiToken') if login else None
print('token', 'ok' if token else 'missing')

patients = curl_json([
    "curl", "-s",
    "http://127.0.0.1:8080/api/monitoring/patient?searchType=name&searchText=%EC%B5%9C%EC%99%84%EA%B7%9C&page=1&displayRow=5&lang=KO",
    "-H", f"api_key: Bearer {token}",
    "-H", f"Authorization: Bearer {token}",
])
rows = patients.get('response') or [] if patients else []
for row in rows:
    print('patient', row.get('seq'), row.get('name'), row.get('loginId'), 'hasFcmToken=', row.get('hasFcmToken'))

if rows and token:
    seq = rows[0].get('seq')
    print('hasFcmToken=', rows[0].get('hasFcmToken'))
    body = json.dumps({
        "accountSeqs": [seq],
        "message": "관리자 테스트 알림",
        "sendDate": "2026-06-20",
        "sendTime": "11:00",
    }, ensure_ascii=False)
    send = curl_json([
        "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/monitoring/notification/send",
        "-H", f"api_key: Bearer {token}",
    "-H", f"Authorization: Bearer {token}",
        "-H", "Content-Type: application/json",
        "-d", body,
    ])
    print('send result', json.dumps(send, ensure_ascii=False)[:800])
'''

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, e = c.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=60)
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
