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
    "SELECT seq, login_id, sign_type, is_enabled, is_dropped, "
    "length(password) AS pw_len, left(password,15) AS pw "
    "FROM account WHERE login_id='C23IFZ39UWLD4' OR phone LIKE '%32984763%' ORDER BY seq;"
))
