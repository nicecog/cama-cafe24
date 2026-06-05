#!/usr/bin/env python3
import subprocess

queries = [
    "SELECT seq, login_id, is_enabled, is_dropped FROM account WHERE login_id='happycog';",
    "SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid='account'::regclass;",
]

for q in queries:
    print("===", q[:60], "...")
    subprocess.run(
        [
            "docker",
            "exec",
            "c6fdf0e55844_cama-cafe24-postgres",
            "psql",
            "-U",
            "cama",
            "-d",
            "cama",
            "-c",
            q,
        ]
    )
