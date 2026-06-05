#!/usr/bin/env python3
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

sql = (
    "SELECT seq, login_id, name, phone, email, sign_type, is_enabled, is_dropped "
    "FROM account WHERE login_id='happycog' OR REPLACE(REPLACE(phone,'-',''),' ','')='01032984763' "
    "ORDER BY seq;"
)
cmd = (
    "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
    f'docker exec "$PG" psql -U cama -d cama -c "{sql}"'
)
_, o, e = c.exec_command(cmd)
time.sleep(1)
print(o.read().decode(errors="replace"))
err = e.read().decode(errors="replace")
if err:
    print("stderr:", err)

c.close()
