#!/usr/bin/env python3
"""Check admin FCM send logs and patient token for 최완규."""
from __future__ import annotations

import os
import re
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"


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

    cmds = [
        (
            "FCM admin send logs",
            "docker logs cama-plus-server 2>&1 | grep -iE 'Admin FCM|FCM send|FCM token|ADMIN_001' | tail -50",
        ),
        (
            "FCM test mode logs",
            "docker logs cama-plus-server 2>&1 | grep -iE 'FcmTestMode|FCM test mode' | tail -20",
        ),
        (
            "account + firebase_token (최완규)",
            """docker exec cama-cafe24-postgres psql -U cama -d cama -c "
SELECT a.seq, a.login_id, a.name, a.dropped,
       ft.enabled AS token_enabled,
       length(ft.token) AS token_len,
       left(ft.token, 24) AS token_prefix,
       ft.updated_at
FROM account a
LEFT JOIN firebase_token ft ON ft.account_seq = a.seq
WHERE a.name LIKE '%최완규%' OR a.login_id = 'happycog'
ORDER BY a.seq;" """,
        ),
        (
            "all enabled tokens for seq 121",
            """docker exec cama-cafe24-postgres psql -U cama -d cama -c "
SELECT account_seq, enabled, length(token), left(token, 30), updated_at, platform
FROM firebase_token WHERE account_seq = 121;" """,
        ),
        (
            "firebase mount in server container",
            "docker exec cama-plus-server ls -la /secrets/ 2>&1; docker exec cama-plus-server printenv FIREBASE_CREDENTIALS_PATH 2>&1",
        ),
        (
            "firebase json metadata (no secrets)",
            """python3 - <<'PY'
import json
from pathlib import Path
p = Path('/opt/cama/secrets/firebase-adminsdk.json')
data = json.loads(p.read_text())
pk = data.get('private_key', '')
print('project_id:', data.get('project_id'))
print('client_email:', data.get('client_email'))
print('private_key_id:', data.get('private_key_id'))
print('private_key_len:', len(pk))
print('private_key_has_begin:', 'BEGIN PRIVATE KEY' in pk)
print('private_key_newline_count:', pk.count(chr(10)))
print('file_bytes:', p.stat().st_size)
PY""",
        ),
        (
            "recent server logs tail",
            "docker logs --tail 120 cama-plus-server 2>&1",
        ),
    ]

    for label, cmd in cmds:
        print(f"\n{'=' * 60}\n{label}\n{'=' * 60}")
        _, stdout, stderr = client.exec_command(cmd, timeout=120)
        code = stdout.channel.recv_exit_status()
        out = stdout.read().decode(errors="replace")
        err = stderr.read().decode(errors="replace")
        print(out or err)
        if code != 0 and not out:
            print(f"(exit {code})")

    client.close()


if __name__ == "__main__":
    main()
