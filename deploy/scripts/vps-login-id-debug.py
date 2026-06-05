#!/usr/bin/env python3
import subprocess


def pg():
    out = subprocess.check_output(["docker", "ps", "--format", "{{.Names}}"], text=True)
    for name in out.splitlines():
        if "postgres" in name:
            return name
    raise RuntimeError("no postgres")


def psql(sql):
    return subprocess.check_output(
        ["docker", "exec", pg(), "psql", "-U", "cama", "-d", "cama", "-t", "-A", "-c", sql],
        text=True,
    ).strip()


row = psql(
    "SELECT login_id, length(login_id), encode(login_id::bytea,'hex') "
    "FROM account WHERE seq=121;"
)
print("login_id row:", row)

hash_row = psql(
    "SELECT length(password), left(password,7) FROM account WHERE seq=121;"
)
print("password row:", hash_row)
