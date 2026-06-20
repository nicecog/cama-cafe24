#!/usr/bin/env python3
"""Diagnose admin FCM send vs device delivery on VPS."""
import json
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
import json
import subprocess


def sh(cmd):
    return subprocess.run(cmd, shell=True, text=True, capture_output=True)


def curl_json(args):
    r = subprocess.run(args, text=True, capture_output=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"raw": r.stdout[:500], "stderr": r.stderr[:300]}


PG = sh("docker ps --format '{{.Names}}' | grep -i postgres | head -1").stdout.strip()
print("PG=", PG)

print("\n=== Firebase project (server credentials) ===")
for path in [
    "/opt/cama/secrets/firebase-adminsdk.json",
    "/secrets/firebase-adminsdk.json",
]:
    r = sh(f"docker exec cama-plus-server test -f {path} && docker exec cama-plus-server cat {path} | python3 -c \"import sys,json; d=json.load(sys.stdin); print(d.get('project_id'), d.get('client_email'))\" 2>/dev/null || true")
    if r.stdout.strip():
        print(path, "->", r.stdout.strip())

r = sh("docker exec cama-plus-server sh -c 'jar tf /app/app.jar 2>/dev/null | grep firebase | head -3'")
print("jar firebase resources:", r.stdout.strip() or "(n/a)")

print("\\n=== firebase_token breakdown ===")
q1 = "SELECT count(*) FILTER (WHERE is_enabled) AS enabled_cnt, count(*) FILTER (WHERE is_enabled AND token='web-no-fcm') AS enabled_web_no_fcm, count(*) FILTER (WHERE is_enabled AND token NOT IN ('test','web-no-fcm') AND length(token)>10) AS enabled_real FROM firebase_token;"
print(sh(f"docker exec {PG} psql -U cama -d cama -c \"{q1}\"").stdout)

print("=== sample real tokens (top 8 by updated_at) ===")
q2 = "SELECT ft.account_seq, ac.login_id, ac.name, ft.platform, ft.is_enabled, length(ft.token) AS len, left(ft.token, 18) AS prefix FROM firebase_token ft JOIN account ac ON ac.seq = ft.account_seq WHERE ft.token NOT IN ('test','web-no-fcm') AND length(ft.token) > 10 ORDER BY ft.updated_at DESC LIMIT 8;"
print(sh(f"docker exec {PG} psql -U cama -d cama -c \"{q2}\"").stdout)

print("=== happycog / tester tokens ===")
q3 = "SELECT ac.login_id, ac.name, ft.is_enabled, ft.platform, CASE WHEN ft.token='web-no-fcm' THEN 'web-no-fcm' WHEN ft.token IS NULL OR length(trim(ft.token))<=10 THEN 'invalid' ELSE left(ft.token,20) END AS token_hint FROM account ac LEFT JOIN firebase_token ft ON ft.account_seq = ac.seq WHERE ac.login_id IN ('happycog','tester') ORDER BY ac.login_id;"
print(sh(f"docker exec {PG} psql -U cama -d cama -c \"{q3}\"").stdout)

login = curl_json([
    "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/auth/doctor",
    "-H", "Content-Type: application/json",
    "-d", '{"principal":"cama","credentials":"cama!"}',
])
token = (login.get("response") or {}).get("apiToken")
print("\n=== admin login ===", "ok" if token else login)

if token:
    headers = ["-H", f"api_key: Bearer {token}", "-H", f"Authorization: Bearer {token}"]
    patients = curl_json([
        "curl", "-s",
        "http://127.0.0.1:8080/api/monitoring/patient?searchType=loginId&searchText=happycog&page=1&displayRow=5&lang=KO",
        *headers,
    ])
    rows = patients.get("response") or []
    print("happycog monitoring rows:", len(rows))
    for row in rows:
        print(" ", row.get("seq"), row.get("name"), "hasFcmToken=", row.get("hasFcmToken"))

    target_seq = rows[0]["seq"] if rows else None
    if not target_seq:
        p2 = curl_json([
            "curl", "-s",
            "http://127.0.0.1:8080/api/monitoring/patient?page=1&displayRow=5&lang=KO",
            *headers,
        ])
        rows2 = p2.get("response") or []
        if rows2:
            target_seq = rows2[0]["seq"]
            print("fallback target", target_seq, rows2[0].get("name"), "hasFcmToken=", rows2[0].get("hasFcmToken"))

    if target_seq:
        body = json.dumps({
            "accountSeqs": [target_seq],
            "message": "FCM 진단 테스트 " + __import__("datetime").datetime.now().strftime("%H:%M:%S"),
            "sendDate": "2026-06-20",
            "sendTime": "14:00",
        }, ensure_ascii=False)
        send = curl_json([
            "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/monitoring/notification/send",
            *headers,
            "-H", "Content-Type: application/json",
            "-d", body,
        ])
        print("\n=== test admin send ===")
        print(json.dumps(send, ensure_ascii=False, indent=2)[:2000])

print("\n=== server FCM logs (30m) ===")
print(sh("docker logs --since 30m cama-plus-server 2>&1 | grep -iE 'Admin FCM|FCM send|FCM token|Firebase' | tail -20").stdout)

print("\n=== server firebase init ===")
print(sh("docker logs cama-plus-server 2>&1 | grep -i Firebase | tail -5").stdout)
"""

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(
    acc["host"], username=acc["user"], password=acc["password"],
    timeout=30, allow_agent=False, look_for_keys=False,
)
_, stdout, _ = client.exec_command(f"python3 - <<'PY'\n{REMOTE}\nPY", timeout=120)
stdout.channel.recv_exit_status()
print(stdout.read().decode())
client.close()
