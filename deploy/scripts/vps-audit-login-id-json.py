#!/usr/bin/env python3
import subprocess

OLD = "C23IFZ39UWLD4"
SEQ = 121

PG = ["docker", "exec", "c6fdf0e55844_cama-cafe24-postgres", "psql", "-U", "cama", "-d", "cama", "-t", "-A"]


def q(sql):
    r = subprocess.run(PG + ["-c", sql], capture_output=True, text=True)
    return r.stdout.strip()


print("=== json/jsonb columns containing old login id ===")
cols = q(
    """
SELECT table_name || '|' || column_name || '|' || data_type
FROM information_schema.columns
WHERE table_schema='public' AND data_type IN ('json', 'jsonb')
ORDER BY table_name, column_name;
"""
)
hits = []
for line in cols.splitlines():
    if not line.strip():
        continue
    table, col, dtype = line.split("|")
    sql = f"SELECT count(*) FROM public.{table} WHERE cast({col} as text) LIKE '%{OLD}%';"
    cnt = q(sql)
    if cnt and cnt != "0":
        hits.append(f"{table}.{col}: {cnt}")

if hits:
    for h in hits:
        print(h)
else:
    print("none")

print("\n=== search_text / content / memo style columns for seq121 related tables ===")
text_tables = [
    ("account_search_history", "search_text"),
    ("cm_contents_log", None),
    ("coaching_user_answer_info", "answer_info"),
    ("coaching_user_add_answer_info", "add_answer_info"),
]
for table, col_hint in text_tables:
    cols_out = q(
        f"""
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='{table}'
  AND data_type IN ('character varying','text');
"""
    )
    acct_col = q(
        f"SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='{table}' AND column_name='account_seq';"
    )
    if not acct_col:
        continue
    for col in cols_out.splitlines():
        col = col.strip()
        if not col:
            continue
        cnt = q(
            f"SELECT count(*) FROM public.{table} WHERE account_seq={SEQ} AND {col} LIKE '%{OLD}%';"
        )
        if cnt and cnt != "0":
            print(f"{table}.{col} (seq121): {cnt} rows contain old id")

print("\n=== coaching data still accessible via account_seq after id change ===")
for table in [
    "coaching_user_answer_info",
    "coaching_user_add_answer_info",
    "coaching_account_exercise_class",
    "coaching_exercise_progress_result_hst",
    "track_service",
]:
    cnt = q(f"SELECT count(*) FROM public.{table} WHERE account_seq={SEQ};")
    print(f"{table}: {cnt}")

print("DONE")
