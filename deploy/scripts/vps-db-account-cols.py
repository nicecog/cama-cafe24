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
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='account' ORDER BY ordinal_position;",
    ]
)
