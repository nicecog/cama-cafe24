#!/usr/bin/env python3
import subprocess

q = """
SELECT seq, login_id, name, phone, sign_type, is_enabled, is_dropped,
       CASE WHEN password IS NULL OR password = '' THEN 'EMPTY' ELSE 'SET' END AS pwd,
       length(password) AS pwd_len
FROM account
WHERE REPLACE(REPLACE(phone, '-', ''), ' ', '') = '01032984763'
ORDER BY seq;
"""
subprocess.run(
    ["docker", "exec", "cama-cafe24-postgres", "psql", "-U", "cama", "-d", "cama", "-c", q]
)
