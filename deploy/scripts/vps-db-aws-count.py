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
SELECT 'cloudfront' AS p, count(*) FROM cm_contents WHERE contents ILIKE '%cloudfront%'
UNION ALL SELECT 'amazonaws', count(*) FROM cm_contents WHERE contents ILIKE '%amazonaws%'
UNION ALL SELECT 'api.camaplus', count(*) FROM cm_contents WHERE contents ILIKE '%api.camaplus.me%'
UNION ALL SELECT 'd3n20', count(*) FROM cm_contents WHERE contents ILIKE '%d3n20da161n8ia%';
"""
    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -t -A"
    )
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, _ = c.exec_command(cmd, timeout=60)
    print(o.read().decode())
    c.close()


if __name__ == "__main__":
    main()
