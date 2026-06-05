#!/usr/bin/env python3
import subprocess

queries = [
    "SELECT tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'account';",
    "SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname = 'account';",
    "SELECT seq, login_id, name, phone FROM account WHERE name = 'abc' AND phone = '01012341234' AND is_enabled = true AND is_dropped = false;",
    "SELECT seq, login_id, name, phone FROM account WHERE name = '최완규' AND phone = '01032984763' AND is_enabled = true AND is_dropped = false;",
]
for q in queries:
    print("===", q[:80], "...")
    subprocess.run(
        ["docker", "exec", "cama-cafe24-postgres", "psql", "-U", "cama", "-d", "cama", "-c", q]
    )
