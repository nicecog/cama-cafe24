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
        ["docker", "exec", pg(), "psql", "-U", "cama", "-d", "cama", "-c", sql],
        text=True,
    )


print(psql(
    "SELECT seq, login_id, nick_name, name, sign_type, roles "
    "FROM account a LEFT JOIN account_roles ar ON a.seq=ar.account_seq "
    "WHERE a.seq=121;"
))
