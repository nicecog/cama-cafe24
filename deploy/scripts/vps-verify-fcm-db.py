#!/usr/bin/env python3
"""FCM pipeline verify - fix postgres container name."""
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

def load_access():
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }

acc = load_access()
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)

script = r"""
echo "=== postgres containers ==="
docker ps --format '{{.Names}}' | grep -i postgres

PG=$(docker ps --format '{{.Names}}' | grep -i postgres | head -1)
echo "Using PG=$PG"

echo "=== firebase_token stats ==="
docker exec $PG psql -U cama -d cama -c \
  "SELECT count(*) FILTER (WHERE is_enabled AND length(trim(token))>10) AS enabled_real,
          count(*) FILTER (WHERE token='web-no-fcm') AS web_no_fcm,
          count(*) AS total FROM firebase_token;"

echo "=== alarm schedules count ==="
docker exec $PG psql -U cama -d cama -t -c \
  "SELECT count(*) FROM account_schedule WHERE is_enabled AND alarm;"

echo "=== today's batch rows ==="
docker exec $PG psql -U cama -d cama -c \
  "SELECT bs.seq, sch.schedule_type, sch.schedule_name, bs.start_date, bs.time,
          CASE WHEN tk.token IS NOT NULL THEN left(tk.token,12) ELSE 'NO_TOKEN' END AS tok
   FROM account_batch_schedule bs
   JOIN account_schedule sch ON sch.seq = bs.schedule_seq
   LEFT JOIN firebase_token tk ON tk.account_seq = bs.account_seq AND tk.is_enabled
   WHERE bs.is_enabled AND sch.is_enabled AND sch.alarm
     AND bs.start_date = to_char(NOW() AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD')
   ORDER BY bs.time LIMIT 10;"

echo "=== SCH_002 dry-run logs (medicine) last 7d ==="
docker logs --since 168h cama-back-batch 2>&1 | grep 'SCH_002' | tail -5

echo "=== FCM send failed last 7d ==="
docker logs --since 168h cama-back-batch 2>&1 | grep -i 'FCM send failed' | tail -5 || echo "(none)"
"""
_, o, e = c.exec_command(script, timeout=90)
o.channel.recv_exit_status()
print(o.read().decode())
print(e.read().decode())
c.close()
