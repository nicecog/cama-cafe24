#!/usr/bin/env python3
import subprocess

queries = [
    "SELECT * FROM account_roles WHERE account_seq IN (118,121);",
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '%login%';",
    "\\d account_login_hst",
]

for q in queries:
    print("===", q)
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
