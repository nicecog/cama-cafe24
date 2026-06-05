#!/usr/bin/env python3
import subprocess

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
        "SELECT seq, login_id, sign_type, is_enabled, is_dropped FROM account WHERE seq IN (118,121);",
    ]
)
