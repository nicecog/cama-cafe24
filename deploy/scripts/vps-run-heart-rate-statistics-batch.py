#!/usr/bin/env python3
"""Run yesterday's heart-rate statistics upsert on VPS (same SQL as batch job)."""
from __future__ import annotations

import base64
import os
import re
import time
from datetime import date, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def load_ssh() -> tuple[str, str, str]:
    host, pw, user = "210.114.18.156", "admincama!", "root"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            pw = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
    return host, pw, user


def main() -> None:
    stat_date = (date.today() - timedelta(days=1)).isoformat()
    sql = f"""
INSERT INTO public.account_heart_rate_statistics (
    account_seq, stat_date, sample_count, min_bpm, max_bpm, avg_bpm,
    first_measured_at, last_measured_at, created_at, updated_at
)
SELECT v.account_seq,
       '{stat_date}'::date,
       COUNT(*)::integer,
       MIN(v.value_num),
       MAX(v.value_num),
       ROUND(AVG(v.value_num), 2),
       MIN(v.measured_at),
       MAX(v.measured_at),
       now(),
       now()
  FROM public.account_vital_history v
 WHERE v.vital_type_cd = 'HEART_RATE'
   AND (v.measured_at AT TIME ZONE 'Asia/Seoul')::date = '{stat_date}'::date
 GROUP BY v.account_seq
ON CONFLICT (account_seq, stat_date)
DO UPDATE SET
    sample_count = EXCLUDED.sample_count,
    min_bpm = EXCLUDED.min_bpm,
    max_bpm = EXCLUDED.max_bpm,
    avg_bpm = EXCLUDED.avg_bpm,
    first_measured_at = EXCLUDED.first_measured_at,
    last_measured_at = EXCLUDED.last_measured_at,
    updated_at = now();
SELECT count(*) AS stat_rows FROM account_heart_rate_statistics WHERE stat_date = '{stat_date}'::date;
"""
    host, pw, user = load_ssh()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(host, username=user, password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1"
    )
    _, o, e = client.exec_command(cmd, timeout=120)
    time.sleep(0.5)
    print(o.read().decode(errors="replace") + e.read().decode(errors="replace"))
    client.close()
    print(f"Heart-rate statistics batch SQL done for stat_date={stat_date} (KST yesterday)")


if __name__ == "__main__":
    main()
