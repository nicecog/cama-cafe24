#!/usr/bin/env python3
"""Sample AWS URL strings still in DB text columns."""
from __future__ import annotations

import base64
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"


def load_ssh() -> tuple[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    return host, pw


def psql(host: str, pw: str, sql: str) -> str:
    import paramiko

    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -t -A -v ON_ERROR_STOP=1"
    )
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, stdout, stderr = client.exec_command(cmd, timeout=120)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    client.close()
    if code != 0:
        raise RuntimeError(err or out)
    return out.strip()


def main() -> None:
    host, pw = load_ssh()
    queries = [
        ("cm_contents.contents (cloudfront)", "SELECT left(contents, 400) FROM cm_contents WHERE contents ILIKE '%cloudfront%' LIMIT 2;"),
        ("distinct cloudfront hosts", """
SELECT DISTINCT substring(contents from 'https://[^/]+') AS host
FROM cm_contents WHERE contents ILIKE '%cloudfront%' LIMIT 10;
"""),
        ("amazonaws in contents", "SELECT left(contents, 400) FROM cm_contents WHERE contents ILIKE '%amazonaws%' LIMIT 3;"),
    ]
    for label, sql in queries:
        print(f"=== {label} ===")
        print(psql(host, pw, sql))
        print()


if __name__ == "__main__":
    main()
