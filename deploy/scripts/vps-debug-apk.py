#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
user = re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1)
password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30, allow_agent=False, look_for_keys=False)

cmds = [
    "docker logs cama-plus-server 2>&1 | grep -i 'APK storage' | tail -3",
    "ls -la /opt/cama/data/apk_down/",
    "docker exec cama-plus-server ls -la /opt/cama/data/apk_down/ 2>&1 || true",
    "curl -s -o /dev/null -w 'apk_down=%{http_code}\\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk",
    "curl -s -o /dev/null -w 'files=%{http_code}\\n' http://127.0.0.1:8080/files/",
    """DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d '{"principal":"happycog","credentials":"admincama!"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('response',{}).get('apiToken','') or d.get('response',''))")
echo token_len=${#DT}
curl -s -w '\\nHTTP:%{http_code}' -X POST http://127.0.0.1:8080/api/doctor/apk/list -H 'Content-Type: application/json' -H "api_key: Bearer $DT" -d '{}'""",
    "unzip -p /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar BOOT-INF/classes/com/cama/back/controller/doctor/DoctorApkRestController.class >/dev/null 2>&1 && echo jar_has_apk_controller=yes || echo jar_has_apk_controller=no",
]
for c in cmds:
    print("===", c[:80], "...")
    _, o, e = client.exec_command(c)
    o.channel.recv_exit_status()
    print(o.read().decode())
    err = e.read().decode()
    if err.strip():
        print("ERR:", err)
client.close()
