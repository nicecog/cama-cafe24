#!/usr/bin/env python3
from __future__ import annotations

import base64
import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def main() -> None:
    import paramiko

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    sql = """
\\d hospital_service
SELECT count(*) FROM hospital_service;
SELECT status, count(*) FROM hospital_service GROUP BY status;
SELECT * FROM hospital_service ORDER BY seq DESC LIMIT 2;
"""
    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama"
    )
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, e = c.exec_command(cmd, timeout=60)
    print(o.read().decode())
    err = e.read().decode()
    if err.strip():
        print("ERR:", err)
    c.close()


if __name__ == "__main__":
    main()
