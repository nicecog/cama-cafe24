#!/usr/bin/env python3
"""Deep audit: account_seq=121 data + any old-id string anywhere."""
import subprocess

OLD_ID = "C23IFZ39UWLD4"
NEW_ID = "happycog"
SEQ = 121

PG = [
    "docker",
    "exec",
    "c6fdf0e55844_cama-cafe24-postgres",
    "psql",
    "-U",
    "cama",
    "-d",
    "cama",
    "-t",
    "-A",
]


def psql(sql):
    r = subprocess.run(PG + ["-c", sql], capture_output=True, text=True)
    if r.returncode != 0:
        return None, r.stderr.strip()
    return r.stdout.strip(), None


print("=== All public tables: columns containing account_seq ===")
out, err = psql(
    """
SELECT table_name || '|' || column_name
FROM information_schema.columns
WHERE table_schema='public'
  AND column_name ILIKE '%account%seq%'
ORDER BY table_name, column_name;
"""
)
if out:
    for line in out.splitlines():
        if not line.strip():
            continue
        table, col = line.split("|")
        cnt, _ = psql(f"SELECT count(*) FROM public.{table} WHERE {col} = {SEQ};")
        if cnt and cnt != "0":
            print(f"public.{table}.{col}: {cnt} rows")

print("\n=== Coaching / user activity tables for seq 121 ===")
coaching_tables = [
    "coaching_progress_info",
    "coaching_answer_info",
    "coaching_answer_detail_info",
    "coaching_service_info",
    "account_login_history",
    "account_alarm",
    "account_secure",
    "account_hospital",
    "account_wallet",
    "firebase_token",
    "track_response",
    "care_track",
    "account_search_history",
]
for t in coaching_tables:
    exists, _ = psql(
        f"SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='{t}';"
    )
    if exists != "1":
        continue
    cols, _ = psql(
        f"""
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='{t}'
  AND (column_name ILIKE '%account%' OR column_name ILIKE '%login%')
ORDER BY ordinal_position;
"""
    )
    if not cols:
        print(f"{t}: (no account/login columns)")
        continue
    for col in cols.splitlines():
        col = col.strip()
        if not col:
            continue
        if col.endswith("seq") or col == "account_seq":
            cnt, _ = psql(f"SELECT count(*) FROM public.{t} WHERE {col} = {SEQ};")
            print(f"{t}.{col}: {cnt} rows")
        elif "login" in col.lower():
            old, _ = psql(f"SELECT count(*) FROM public.{t} WHERE {col} = '{OLD_ID}';")
            new, _ = psql(f"SELECT count(*) FROM public.{t} WHERE {col} = '{NEW_ID}';")
            print(f"{t}.{col}: old={old} new={new}")

print("\n=== Full-database LIKE search for old login id (varchar/text cols only) ===")
tables_out, _ = psql(
    """
SELECT table_name FROM information_schema.tables
WHERE table_schema='public' AND table_type='BASE TABLE'
ORDER BY table_name;
"""
)
hits = []
if tables_out:
    for table in tables_out.splitlines():
        table = table.strip()
        if not table:
            continue
        cols_out, _ = psql(
            f"""
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='{table}'
  AND data_type IN ('character varying','text');
"""
        )
        if not cols_out:
            continue
        for col in cols_out.splitlines():
            col = col.strip()
            if not col:
                continue
            cnt, err = psql(
                f"SELECT count(*) FROM public.{table} WHERE {col} LIKE '%{OLD_ID}%';"
            )
            if cnt and cnt != "0":
                hits.append(f"{table}.{col}: {cnt}")

if hits:
    for h in hits:
        print(h)
else:
    print("No LIKE matches for old login id in any varchar/text column")

print("\n=== Verify coaching API resolves new id ===")
import json
import urllib.request

BASE = "https://camaplus.cafe24.com"
for lid in [OLD_ID, NEW_ID]:
    req = urllib.request.Request(
        BASE + "/api/webview/coaching/service/getCoachingProgressList",
        data=json.dumps({"loginId": lid}).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = json.loads(resp.read().decode())
            ok = body.get("success")
            msg = body.get("error", {}).get("message") if body.get("error") else "ok"
            print(f"coaching API loginId={lid}: success={ok} msg={msg}")
    except Exception as e:
        print(f"coaching API loginId={lid}: error={e}")

print("\nDONE")
