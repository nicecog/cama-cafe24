#!/usr/bin/env python3
"""Scan Postgres for login_id columns and old ID references."""
import subprocess

OLD_ID = "C23IFZ39UWLD4"
NEW_ID = "happycog"
ACCOUNT_SEQ = 121

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
        print("SQL ERROR:", r.stderr.strip())
        return None
    return r.stdout.strip()


print("=== account row (seq 121) ===")
print(
    psql(
        "SELECT seq, login_id, name, phone FROM account WHERE seq=121 OR login_id IN ('C23IFZ39UWLD4','happycog');"
    )
)

print("\n=== tables with login_id column ===")
cols = psql(
    """
SELECT table_schema || '.' || table_name || '.' || column_name
FROM information_schema.columns
WHERE column_name = 'login_id'
  AND table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY 1;
"""
)
if cols:
    for line in cols.splitlines():
        if not line.strip():
            continue
        schema, table, col = line.split(".")
        fq = f"{schema}.{table}"
        old_cnt = psql(
            f"SELECT count(*) FROM {fq} WHERE login_id = '{OLD_ID}';"
        )
        new_cnt = psql(
            f"SELECT count(*) FROM {fq} WHERE login_id = '{NEW_ID}';"
        )
        total = psql(f"SELECT count(*) FROM {fq};")
        print(f"{fq}: total={total} old={old_cnt} new={new_cnt}")

print("\n=== text columns possibly storing loginId (sample scan) ===")
text_cols = psql(
    """
SELECT table_schema || '|' || table_name || '|' || column_name || '|' || data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type IN ('character varying', 'text', 'json', 'jsonb')
  AND column_name ILIKE '%login%'
ORDER BY table_name, column_name;
"""
)
if text_cols:
    for line in text_cols.splitlines():
        parts = line.split("|")
        if len(parts) != 4:
            continue
        schema, table, col, dtype = parts
        fq = f"{schema}.{table}"
        try:
            old_cnt = psql(
                f"SELECT count(*) FROM {fq} WHERE cast({col} as text) LIKE '%{OLD_ID}%';"
            )
            if old_cnt and old_cnt != "0":
                print(f"{fq}.{col} ({dtype}): old_id_refs={old_cnt}")
        except Exception as e:
            pass

print("\n=== tables referencing account_seq=121 (FK-ish tables) ===")
refs = psql(
    """
SELECT tc.table_name, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND kcu.table_schema = 'public'
  AND kcu.column_name LIKE '%account%'
ORDER BY 1, 2;
"""
)
seen = set()
if refs:
    for line in refs.splitlines():
        if not line.strip() or "|" not in line:
            continue
        table, col = line.split("|")
        if table in seen:
            continue
        seen.add(table)
        cnt = psql(f"SELECT count(*) FROM public.{table} WHERE {col} = {ACCOUNT_SEQ};")
        print(f"public.{table}.{col}: rows_for_seq121={cnt}")

print("\n=== broad search: any public table text match old login id ===")
tables = psql(
    """
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
"""
)
if tables:
    for table in tables.splitlines():
        table = table.strip()
        if not table:
            continue
        cols_in_table = psql(
            f"""
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='{table}'
  AND data_type IN ('character varying','text');
"""
        )
        if not cols_in_table:
            continue
        for col in cols_in_table.splitlines():
            col = col.strip()
            if not col:
                continue
            cnt = psql(
                f"SELECT count(*) FROM public.{table} WHERE {col} = '{OLD_ID}';"
            )
            if cnt and cnt != "0":
                print(f"public.{table}.{col}: exact_old_id_count={cnt}")

print("\nDONE")
