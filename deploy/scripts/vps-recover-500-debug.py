#!/usr/bin/env python3
"""SSH: docker logs for recover 500 + DB sign_type for happycog."""
import re
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parents[1] / "CAFE24_VPS_ACCESS.local.md"
host, user, password = "210.114.18.156", "root", "admincama!"
if ACCESS.is_file():
    text = ACCESS.read_text(encoding="utf-8")
    if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
        host = m.group(1)
    if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
        user = m.group(1)
    if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
        password = m.group(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30)

cmds = """
docker logs --since 30m cama-plus-server 2>&1 | grep -iE 'reset-password|recover|500|Exception|happycog' | tail -40
echo '=== DB happycog ==='
docker exec cama-cafe24-postgres psql -U cama -d cama -t -A -c "SELECT seq,login_id,name,phone,sign_type,is_enabled,is_dropped FROM account WHERE login_id='happycog';"
echo '=== curl reset ==='
curl -s -w '\\nHTTP:%{http_code}' -X POST http://127.0.0.1:8080/api/public/patient/recover/reset-password -H 'Content-Type: application/json; charset=utf-8' -d '{"loginId":"happycog","name":"최완규","phone":"01032984763"}'
"""
stdin, stdout, stderr = client.exec_command(cmds, timeout=60)
print(stdout.read().decode(errors="replace"))
err = stderr.read().decode(errors="replace")
if err.strip():
    print("STDERR:", err)
client.close()
