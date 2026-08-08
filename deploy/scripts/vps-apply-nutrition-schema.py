#!/usr/bin/env python3
"""Apply food calorie (nutrition / meal log) DDL and 100-class seed on Cafe24 VPS."""
from __future__ import annotations

import base64
import os
import re
import sys
import time
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
SQL_DIR = DEPLOY_ROOT / "sql"

DDL_FILE = SQL_DIR / "cafe24-nutrition-meal-log.sql"
SEED_FILE = SQL_DIR / "cafe24-nutrition-food-class-seed.sql"
MFDS_FILE = SQL_DIR / "cafe24-nutrition-mfds-load.sql"
MFDS_PROCESSED_FILE = SQL_DIR / "cafe24-nutrition-mfds-processed-load.sql"
MFDS_HEALTH_FILE = SQL_DIR / "cafe24-nutrition-mfds-health-load.sql"
MFDS_FC10_FILE = SQL_DIR / "cafe24-nutrition-mfds-fc10-load.sql"
FC10_CLASS_MAP_FILE = SQL_DIR / "cafe24-nutrition-fc10-class-mapping.sql"


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


def psql(client: paramiko.SSHClient, sql: str) -> str:
    b64 = base64.b64encode(sql.encode("utf-8")).decode("ascii")
    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"echo {b64} | base64 -d | docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1"
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=300)
    time.sleep(0.5)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    if stdout.channel.recv_exit_status() != 0:
        raise RuntimeError(err or out or "psql failed")
    return out + err


def psql_file(client: paramiko.SSHClient, local_path: Path, remote_name: str) -> str:
    """대용량 SQL 은 SFTP 업로드 후 docker 로 적용한다 (base64 ARG 한계 회피)."""
    remote_path = f"/tmp/{remote_name}"
    sftp = client.open_sftp()
    try:
        sftp.put(str(local_path), remote_path)
    finally:
        sftp.close()

    cmd = (
        "PG=$(docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1); "
        f"docker cp {remote_path} \"$PG\":/tmp/{remote_name} && "
        f"docker exec -i \"$PG\" psql -U cama -d cama -v ON_ERROR_STOP=1 -f /tmp/{remote_name}; "
        f"STATUS=$?; rm -f {remote_path}; "
        f"docker exec \"$PG\" rm -f /tmp/{remote_name}; exit $STATUS"
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=900)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    if stdout.channel.recv_exit_status() != 0:
        raise RuntimeError(err or out or "psql file failed")
    return out + err


VERIFY_SQL = """
SELECT table_name, 'exists' AS status
  FROM information_schema.tables
 WHERE table_schema = 'public'
   AND table_name IN ('cm_food_class', 'cm_food_nutrition', 'account_meal_log',
                      'account_meal_log_item', 'account_meal_feedback')
 ORDER BY table_name;

SELECT count(*) AS food_class_count, min(class_id) AS min_class_id, max(class_id) AS max_class_id
  FROM cm_food_class;

SELECT count(*) AS nutrition_row_count,
       coalesce(max(nutrition_version), '(none)') AS latest_version
  FROM cm_food_nutrition;

SELECT nutrition_version, count(*) AS cnt
  FROM cm_food_nutrition
 GROUP BY nutrition_version
 ORDER BY nutrition_version;

SELECT count(*) AS mapped_class_count
  FROM cm_food_class
 WHERE food_code IS NOT NULL AND food_code <> '';
"""


def main() -> None:
    steps = [("DDL", DDL_FILE), ("100-class seed", SEED_FILE)]
    for label, path in [
        ("MFDS 음식DB", MFDS_FILE),
        ("MFDS 가공식품DB", MFDS_PROCESSED_FILE),
        ("MFDS 건강기능식품DB", MFDS_HEALTH_FILE),
        ("국가표준식품성분 FC10.4", MFDS_FC10_FILE),
        ("FC10/MFDS class mapping", FC10_CLASS_MAP_FILE),
    ]:
        if path.is_file():
            steps.append((label, path))
        else:
            print(f"(skip) {path.name} not found")

    for label, path in steps:
        if not path.is_file():
            raise SystemExit(f"Missing SQL for {label}: {path}")

    acc = load_access()
    print(f"Connecting {acc['user']}@{acc['host']} ...")
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

    try:
        for label, path in steps:
            print(f"Applying {label} ({path.name}, {path.stat().st_size:,} bytes) ...")
            if path.stat().st_size > 200_000:
                output = psql_file(client, path, path.name)
            else:
                output = psql(client, path.read_text(encoding="utf-8"))
            if output.strip():
                # 대용량 INSERT 로그는 앞·뒤만
                text = output.strip()
                if len(text) > 2000:
                    text = text[:1000] + "\n...\n" + text[-1000:]
                print(text)

        print("Verifying ...")
        print(psql(client, VERIFY_SQL))
    finally:
        client.close()

    print("Nutrition schema applied.")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"FAILED: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
