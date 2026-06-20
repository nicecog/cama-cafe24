#!/usr/bin/env python3
"""Enable FCM live test on Cafe24 VPS: dry-run off, server Firebase mount, recreate containers."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
ENV_REMOTE = "/opt/cama/deploy/.env.cafe24"
COMPOSE_REMOTE = "/opt/cama/deploy/docker-compose.cafe24.yml"


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
    import paramiko

    acc = load_access()
    print(f"Connecting {acc['user']}@{acc['host']} ...")

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

    script = f"""
set -e
cd /opt/cama/deploy

# dry-run off for batch (admin send uses server API; batch rows disabled during test)
if grep -q '^CAMA_BATCH_FCM_DRY_RUN=' {ENV_REMOTE}; then
  sed -i 's/^CAMA_BATCH_FCM_DRY_RUN=.*/CAMA_BATCH_FCM_DRY_RUN=false/' {ENV_REMOTE}
else
  echo 'CAMA_BATCH_FCM_DRY_RUN=false' >> {ENV_REMOTE}
fi

echo "=== .env FCM settings ==="
grep -E 'CAMA_BATCH_FCM|FIREBASE' {ENV_REMOTE} || true

# recreate API + batch with updated compose (firebase mount on server)
if docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "docker compose not found" >&2
  exit 1
fi
$DC -f {COMPOSE_REMOTE} --env-file {ENV_REMOTE} rm -sf cama-plus-server cama-back-batch || true
$DC -f {COMPOSE_REMOTE} --env-file {ENV_REMOTE} up -d --no-deps cama-plus-server cama-back-batch

sleep 15

echo "=== server firebase mount ==="
docker exec cama-plus-server test -f /secrets/firebase-adminsdk.json && echo OK || echo MISSING

echo "=== batch dry-run env ==="
docker exec cama-back-batch printenv CAMA_BATCH_FCM_DRY_RUN

echo "=== server health ==="
curl -s -o /dev/null -w 'server HTTP %{{http_code}}\\n' http://127.0.0.1:8080/api/public/health || true
"""
    _, stdout, stderr = client.exec_command(script, timeout=180)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out:
        print(out)
    if err:
        print(err, file=sys.stderr)
    client.close()
    if code != 0:
        raise SystemExit(code)
    print("FCM live test mode enabled on VPS.")


if __name__ == "__main__":
    main()
