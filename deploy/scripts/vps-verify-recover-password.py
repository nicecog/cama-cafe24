#!/usr/bin/env python3
"""Check deployed JAR + live API for recover/password."""
import json
import re
import time
import zipfile
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

sftp = c.open_sftp()
local = Path(__file__).resolve().parent / "_remote-api.jar"
sftp.get("/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar", str(local))
sftp.close()

with zipfile.ZipFile(local) as z:
    pub = z.read(
        "BOOT-INF/classes/com/cama/back/controller/account/PublicPatientAccountRestController.class"
    ).decode("latin1", "ignore")
    sec = z.read("BOOT-INF/classes/com/cama/back/config/SecurityConfig.class").decode(
        "latin1", "ignore"
    )
    pat = z.read(
        "BOOT-INF/classes/com/cama/back/controller/account/PatientAccountRestController.class"
    ).decode("latin1", "ignore")

print("JAR PublicPatientAccountRestController recover/password:", "recover/password" in pub)
print("JAR PatientAccountRestController recover/password:", "recover/password" in pat)
print("JAR SecurityConfig /api/public/**:", "/api/public/**" in sec or "api/public" in sec)
print("JAR SecurityConfig recover/password:", "recover/password" in sec)

_, o, _ = c.exec_command(
    "curl -s http://127.0.0.1:8080/v3/api-docs 2>/dev/null | python3 -c \"import sys,json; d=json.load(sys.stdin); print([p for p in d.get('paths',{}) if 'password' in p])\""
)
time.sleep(2)
print("OpenAPI password paths:", o.read().decode(errors="replace").strip())

body = json.dumps(
    {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
    ensure_ascii=False,
).replace("'", "'\\''")
_, o, _ = c.exec_command(
    "curl -sS -w '\\nHTTP:%{http_code}' -X POST -H 'Content-Type: application/json' "
    f"-d '{body}' http://127.0.0.1:8080/api/public/patient/recover/password"
)
time.sleep(1)
print("recover/password response:", o.read().decode(errors="replace"))

c.close()
local.unlink(missing_ok=True)
