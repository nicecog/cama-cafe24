#!/usr/bin/env python3
"""Normalize schedule time columns from HH:mm to HH:mm:ss on VPS."""
from __future__ import annotations

import re
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def load_access() -> dict[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


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

    script = r"""
PG=$(docker ps --format '{{.Names}}' | grep postgres | head -1)
echo "PG=$PG"

docker exec "$PG" psql -U cama -d cama -c "
UPDATE account_schedule SET time = time || ':00'
WHERE length(trim(time)) = 5 AND time NOT LIKE '%:%:%';
"

docker exec "$PG" psql -U cama -d cama -c "
UPDATE account_batch_schedule SET time = time || ':00'
WHERE length(trim(time)) = 5 AND time NOT LIKE '%:%:%';
"

docker exec "$PG" psql -U cama -d cama -c "
SELECT count(*) AS short_time_remaining
FROM account_batch_schedule
WHERE length(trim(time)) = 5 AND time NOT LIKE '%:%:%';
"
"""
    _, stdout, stderr = client.exec_command(script, timeout=60)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    err = stderr.read().decode().strip()
    if err:
        print("STDERR:", err[:500])
    client.close()


if __name__ == "__main__":
    main()
