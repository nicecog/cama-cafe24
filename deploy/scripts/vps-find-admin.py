#!/usr/bin/env python3
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

sql = (
    "SELECT login_id, name, is_enabled FROM cm_admin "
    "WHERE is_enabled = true LIMIT 5;"
)
cmd = (
    "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
    f'docker exec "$PG" psql -U cama -d cama -c "{sql}"'
)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command(cmd)
time.sleep(2)
print(o.read().decode(errors="replace"))
c.close()
