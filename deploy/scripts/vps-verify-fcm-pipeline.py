#!/usr/bin/env python3
"""Verify FCM alarm pipeline on Cafe24 VPS."""
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
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    script = r"""
echo "=== batch container ==="
docker ps --filter name=cama-back-batch --format '{{.Names}} {{.Status}}'

echo "=== FCM env ==="
grep -E 'CAMA_BATCH_FCM|FIREBASE' /opt/cama/deploy/.env.cafe24 2>/dev/null || echo 'no .env'

echo "=== firebase json ==="
docker exec cama-back-batch test -f /secrets/firebase-adminsdk.json && echo OK || echo MISSING

echo "=== firebase_token stats ==="
docker exec cama-cafe24-postgres psql -U cama -d cama -t -c \
  "SELECT 'enabled_tokens=' || count(*) FROM firebase_token WHERE is_enabled AND token IS NOT NULL AND length(trim(token))>10;"

echo "=== recent schedules with alarm ==="
docker exec cama-cafe24-postgres psql -U cama -d cama -c \
  "SELECT count(*) AS alarm_schedules FROM account_schedule WHERE is_enabled AND alarm;"

echo "=== pending batch rows today (KST) ==="
docker exec cama-cafe24-postgres psql -U cama -d cama -c \
  "SELECT bs.seq, sch.schedule_type, bs.start_date, bs.time, left(tk.token,12) AS tok
   FROM account_batch_schedule bs
   JOIN account_schedule sch ON sch.seq = bs.schedule_seq
   LEFT JOIN firebase_token tk ON tk.account_seq = bs.account_seq AND tk.is_enabled
   WHERE bs.is_enabled AND sch.is_enabled AND sch.alarm
     AND bs.start_date = to_char(NOW() AT TIME ZONE 'Asia/Seoul','YYYY-MM-DD')
   ORDER BY bs.time LIMIT 8;"

echo "=== batch logs (FCM / batchCheck / ERROR) last 30m ==="
docker logs --since 30m cama-back-batch 2>&1 | grep -iE 'FCM|batchCheck|Firebase|ERROR|Exception' | tail -25

echo "=== batch startup firebase init ==="
docker logs cama-back-batch 2>&1 | grep -iE 'Firebase|dry-run|dry run' | tail -8
"""
    _, o, e = c.exec_command(script, timeout=90)
    o.channel.recv_exit_status()
    print(o.read().decode())
    err = e.read().decode().strip()
    if err:
        print("STDERR:", err[:500])
    c.close()


if __name__ == "__main__":
    main()
