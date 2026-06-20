#!/usr/bin/env python3
"""Deploy camaplus-1de96 Firebase Admin key to VPS and restart FCM services."""
from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
SOURCE_KEY = (
    REPO_ROOT
    / "cama-back-batch"
    / "src"
    / "main"
    / "resources"
    / "firebase"
    / "camaplus-1de96-firebase-adminsdk-a2gx1-dcc730fa92.json"
)
REMOTE_KEY = "/opt/cama/secrets/firebase-adminsdk.json"


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
    user = os.environ.get("CAMA_VPS_USER", "root")
    password = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def main() -> None:
    key_path = Path(sys.argv[1]) if len(sys.argv) > 1 else SOURCE_KEY
    if not key_path.is_file():
        raise SystemExit(f"Firebase key not found: {key_path}")

    meta = json.loads(key_path.read_text(encoding="utf-8"))
    print(f"Deploying Firebase key project_id={meta.get('project_id')} client_email={meta.get('client_email')}")

    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"],
        username=acc["user"],
        password=acc["password"],
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    def ssh(cmd: str, timeout: int = 120) -> tuple[int, str, str]:
        _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode(errors="replace"), stderr.read().decode(errors="replace")

    ssh("mkdir -p /opt/cama/secrets")
    sftp = client.open_sftp()
    sftp.put(str(key_path), REMOTE_KEY)
    sftp.close()
    ssh(f"chmod 600 {REMOTE_KEY}")
    print(f"Uploaded -> {REMOTE_KEY}")

    for svc in ("cama-plus-server", "cama-back-batch"):
        code, out, err = ssh(f"docker restart {svc}")
        print(f"restart {svc}: exit={code}")
        if out.strip():
            print(out.strip())
        if err.strip():
            print(err.strip())

    time.sleep(25)

    checks = [
        (
            "server firebase init",
            "docker logs cama-plus-server 2>&1 | grep -i Firebase | tail -5",
        ),
        (
            "oauth smoke test in container",
            f"""docker exec cama-plus-server python3 - <<'PY'
import json, urllib.request
from pathlib import Path
p = Path('/secrets/firebase-adminsdk.json')
data = json.loads(p.read_text())
print('mounted_project=', data.get('project_id'))
PY""",
        ),
        (
            "doctor auth",
            """curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d '{"principal":"cama","credentials":"cama!"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'][:20]+'...')" """,
        ),
        (
            "happycog token",
            """docker ps --format '{{.Names}}' | grep -i postgres | head -1 | xargs -I{} docker exec {} psql -U cama -d cama -t -c "SELECT left(token,24), length(token) FROM firebase_token ft JOIN account a ON a.seq=ft.account_seq WHERE a.login_id='happycog' AND ft.enabled=true LIMIT 1;" """,
        ),
    ]

    for label, cmd in checks:
        print(f"\n=== {label} ===")
        code, out, err = ssh(cmd)
        print(out or err)

    # Live FCM test via Python on VPS using firebase-admin if available, else use curl to send API
    fcm_test = r'''
python3 - <<'PY'
import json, subprocess, sys
try:
    import firebase_admin
    from firebase_admin import credentials, messaging
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "firebase-admin", "-q"])
    import firebase_admin
    from firebase_admin import credentials, messaging

# token for happycog
import subprocess
pg = subprocess.check_output("docker ps --format '{{.Names}}' | grep -i postgres | head -1", shell=True, text=True).strip()
tok = subprocess.check_output(
    f"docker exec {pg} psql -U cama -d cama -t -A -c \"SELECT token FROM firebase_token ft JOIN account a ON a.seq=ft.account_seq WHERE a.login_id='happycog' AND ft.enabled=true LIMIT 1;\"",
    shell=True, text=True,
).strip()
if not tok:
    print("NO_TOKEN")
    raise SystemExit(1)
if not firebase_admin._apps:
    cred = credentials.Certificate("/opt/cama/secrets/firebase-adminsdk.json")
    firebase_admin.initialize_app(cred)
msg = messaging.Message(
    notification=messaging.Notification(title="CAMA 테스트", body="firebase key fix verify"),
    token=tok,
    data={"type": "ADMIN_001", "title": "CAMA 테스트", "body": "firebase key fix verify"},
)
resp = messaging.send(msg)
print("FCM_OK", resp)
PY
'''
    print("\n=== live FCM send test (happycog) ===")
    code, out, err = ssh(fcm_test, timeout=180)
    print(out or err)
    if code != 0:
        print(f"(exit {code})")

    client.close()
    print("\nDone. Re-test from Admin 알림메시지관리.")


if __name__ == "__main__":
    main()
