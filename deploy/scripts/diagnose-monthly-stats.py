#!/usr/bin/env python3
"""Diagnose monthly account statistics: DB rows, API query, batch logs."""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
BASE = "https://camaplus.cafe24.com"
LOGIN = {"principal": "cama", "credentials": "admincama!"}


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
    user = os.environ.get("CAMA_VPS_USER", "root")
    password = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def psql(client, sql: str) -> str:
    import base64

    b64 = base64.b64encode(sql.encode()).decode()
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1"
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=120)
    out = stdout.read().decode(errors="replace") + stderr.read().decode(errors="replace")
    return out


def api_post(path: str, token: str, body: dict) -> tuple[int, list]:
    bearer = f"Bearer {token}"
    headers = {
        "Content-Type": "application/json",
        "api_key": bearer,
        "Authorization": bearer,
    }
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode(),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        j = json.loads(resp.read().decode())
    return resp.status, j.get("response") or []


def login() -> str:
    req = urllib.request.Request(
        BASE + "/api/auth/doctor",
        data=json.dumps(LOGIN).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())["response"]["apiToken"]


def main() -> int:
    import paramiko

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

    print("=== 1) DB: account_cnt_statistics ===")
    sql = """
SELECT user_type_cd, count(*) AS cnt,
       min(year_month) AS min_ym, max(year_month) AS max_ym
FROM account_cnt_statistics
GROUP BY user_type_cd
ORDER BY user_type_cd;

SELECT year_month, user_type_cd, value1, value2, value3, value4,
       to_char(updated_at AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD HH24:MI') AS updated_kst
FROM account_cnt_statistics
ORDER BY year_month DESC, user_type_cd
LIMIT 20;

SELECT count(*) AS login_history_rows FROM account_login_history;
SELECT count(*) AS login_this_month
FROM account_login_history a
WHERE to_char(a.login_at,'yyyymm') = to_char(now(),'yyyymm');
"""
    print(psql(client, sql))

    print("\n=== 2) Query format test (YYYY-MM vs yyyymm) ===")
    fmt_sql = """
SELECT count(*) AS match_dash_format
FROM account_cnt_statistics
WHERE year_month >= '2026-01' AND year_month <= '2026-12' AND user_type_cd = '99';

SELECT count(*) AS match_compact_format
FROM account_cnt_statistics
WHERE year_month >= '202601' AND year_month <= '202612' AND user_type_cd = '99';
"""
    print(psql(client, fmt_sql))

    print("\n=== 3) Batch container status & recent logs ===")
    for cmd in [
        "docker ps --filter name=cama-back-batch --format '{{.Names}} {{.Status}}'",
        "docker logs cama-back-batch --since 72h 2>&1 | grep -iE 'statistics|accountStatistics|error|exception' | tail -30",
        "docker logs cama-back-batch --since 72h 2>&1 | tail -15",
    ]:
        _, stdout, stderr = client.exec_command(cmd, timeout=120)
        print(f">>> {cmd}\n{stdout.read().decode(errors='replace')}{stderr.read().decode(errors='replace')}")

    client.close()

    print("\n=== 4) Production API (doctor token) ===")
    token = login()
    _, rows_dash = api_post(
        "/api/monitoring/account/getAccountStatList",
        token,
        {"frYearMonth": "2026-01", "toYearMonth": "2026-12", "userTypeCd": "99"},
    )
    print(f"API with YYYY-MM (UI format): rows={len(rows_dash)}")

    _, rows_compact = api_post(
        "/api/monitoring/account/getAccountStatList",
        token,
        {"frYearMonth": "202601", "toYearMonth": "202612", "userTypeCd": "99"},
    )
    print(f"API with yyyymm format: rows={len(rows_compact)}")
    if rows_compact:
        r = rows_compact[0]
        print(f"  sample: yearMonth={r.get('yearMonth')} dau={r.get('dau')} mau={r.get('mau')}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
