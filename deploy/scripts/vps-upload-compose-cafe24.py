#!/usr/bin/env python3
"""Upload docker-compose.cafe24.yml to VPS."""
from __future__ import annotations

import os
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
COMPOSE_LOCAL = DEPLOY_ROOT / "docker-compose.cafe24.yml"
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
REMOTE = "/opt/cama/deploy/docker-compose.cafe24.yml"


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

    if not COMPOSE_LOCAL.is_file():
        raise SystemExit(f"Missing {COMPOSE_LOCAL}")

    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )
    sftp = client.open_sftp()
    print(f"Upload {COMPOSE_LOCAL} -> {REMOTE}")
    sftp.put(str(COMPOSE_LOCAL), REMOTE)
    sftp.close()
    client.close()
    print("Done.")


if __name__ == "__main__":
    main()
