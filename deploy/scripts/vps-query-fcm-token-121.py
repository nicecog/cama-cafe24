#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}
remote = r"""
docker ps --format '{{.Names}}' | grep -i postgres || true
PG=$(docker ps --format '{{.Names}}' | grep -i postgres | head -1)
echo PG=$PG
docker exec "$PG" psql -U cama -d cama -c "SELECT account_seq, is_enabled, length(token) len, left(token,24) prefix FROM firebase_token WHERE account_seq=121;"
"""
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, e = c.exec_command(remote, timeout=30)
o.channel.recv_exit_status()
print(o.read().decode())
err = e.read().decode().strip()
if err:
    print("ERR:", err)
c.close()
