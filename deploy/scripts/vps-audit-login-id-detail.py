#!/usr/bin/env python3
import subprocess

SEQ = 121
OLD = "C23IFZ39UWLD4"

PG = ["docker", "exec", "c6fdf0e55844_cama-cafe24-postgres", "psql", "-U", "cama", "-d", "cama", "-t", "-A"]


def q(sql):
    r = subprocess.run(PG + ["-c", sql], capture_output=True, text=True)
    return r.stdout.strip(), r.stderr.strip()


print("=== account_secure ===")
print(q(f"SELECT column_name FROM information_schema.columns WHERE table_name='account_secure' ORDER BY ordinal_position;")[0])
print(q(f"SELECT * FROM account_secure WHERE account_seq={SEQ} LIMIT 5;")[0])

print("\n=== Sample coaching_user_answer_info (account_seq only?) ===")
print(q("SELECT column_name FROM information_schema.columns WHERE table_name='coaching_user_answer_info' ORDER BY ordinal_position;")[0])
print(q(f"SELECT count(*), min(created_at), max(created_at) FROM coaching_user_answer_info WHERE account_seq={SEQ};")[0])

print("\n=== track_service ===")
print(q(f"SELECT seq, account_seq, status FROM track_service WHERE account_seq={SEQ};")[0])

print("\n=== firebase_token ===")
print(q(f"SELECT seq, account_seq, enabled, device FROM firebase_token WHERE account_seq={SEQ};")[0])

print("\n=== Any column name containing 'login' across public schema ===")
cols, _ = q(
    """
SELECT table_name || '.' || column_name || ' (' || data_type || ')'
FROM information_schema.columns
WHERE table_schema='public' AND column_name ILIKE '%login%'
ORDER BY table_name, column_name;
"""
)
print(cols)

print("\n=== account table history: dropped duplicate phone account ===")
print(q("SELECT seq, login_id, is_dropped, is_enabled FROM account WHERE phone='01032984763';")[0])
