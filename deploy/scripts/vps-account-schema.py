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


print(psql("\\d account"))
