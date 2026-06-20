#!/usr/bin/env python3
"""Check FCM test mode and schedule alarm pipeline on VPS."""
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
PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1)
echo "PG=$PG"

echo "=== fcm_test_mode ==="
docker exec "$PG" psql -U cama -d cama -c "SELECT * FROM fcm_test_mode;" 2>&1

echo "=== batch schedule counts ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT
  (SELECT count(*) FROM account_batch_schedule WHERE is_enabled) AS batch_enabled,
  (SELECT count(*) FROM account_batch_schedule WHERE NOT is_enabled) AS batch_disabled,
  (SELECT count(*) FROM account_schedule WHERE is_enabled AND alarm) AS schedule_alarm,
  (SELECT count(*) FROM fcm_batch_schedule_backup) AS backup_rows;
"

echo "=== today's pending batch rows (KST) ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT bs.seq, bs.account_seq, sch.schedule_type, bs.start_date, bs.time, bs.is_enabled, sch.alarm,
       left(tk.token, 16) AS token_prefix, tk.is_enabled AS token_enabled
FROM account_batch_schedule bs
JOIN account_schedule sch ON sch.seq = bs.schedule_seq
LEFT JOIN firebase_token tk ON tk.account_seq = bs.account_seq AND tk.is_enabled
WHERE bs.start_date = to_char(NOW() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD')
ORDER BY bs.time DESC
LIMIT 10;
"

echo "=== account 121 recent batch times ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT bs.seq, bs.time, length(bs.time) AS len, sch.alarm, bs.is_enabled
FROM account_batch_schedule bs
JOIN account_schedule sch ON sch.seq = bs.schedule_seq
WHERE bs.account_seq = 121
ORDER BY bs.seq DESC LIMIT 5;
"

echo "=== batch time match test ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT to_char(now() AT TIME ZONE 'Asia/Seoul', 'HH24:MI:00') AS expected_format;
"

echo "=== would seq 23211 match now (example query) ==="
docker exec "$PG" psql -U cama -d cama -c "
SELECT bs.seq, bs.time,
  bs.time = to_char(now() AT TIME ZONE 'Asia/Seoul', 'HH24:MI:00') AS matches_now
FROM account_batch_schedule bs WHERE bs.seq = 23211;
"

echo "=== batch logs schedule FCM last 3h ==="
docker logs --since 3h cama-back-batch 2>&1 | grep -iE 'batchCheck[^0-9]|SCH_00|targets=' | tail -15

"""
    _, stdout, stderr = client.exec_command(script, timeout=90)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    err = stderr.read().decode().strip()
    if err:
        print("STDERR:", err[:800])
    client.close()


if __name__ == "__main__":
    main()
