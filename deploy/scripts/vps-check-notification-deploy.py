#!/usr/bin/env python3
import re
from pathlib import Path
import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
acc = {
    "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
    "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
    "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
}
c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
_, o, _ = c.exec_command("""
docker ps --format '{{.Names}} {{.Status}}' | grep cama
echo '---'
docker logs --tail 20 cama-plus-server 2>&1
echo '---'
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8080/api/monitoring/notification/fcm-test-status || true
sleep 5
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8080/api/monitoring/notification/fcm-test-status || true
jar tf /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar | grep FcmTestModeService || echo 'JAR missing class'
""", timeout=60)
o.channel.recv_exit_status()
print(o.read().decode())
c.close()
