#!/usr/bin/env python3
"""Analyze deployed cama-plus-server JAR on Cafe24 VPS vs expected features."""
from __future__ import annotations

import re
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"

MARKER_CLASSES = [
    "FcmTestModeServiceImpl",
    "MonitorPatientAccountServiceImpl",
    "VitalRestController",
    "TabletQrRestController",
    "DoctorApkRestController",
    "ApkStorageService",
    "AccountServiceImpl",
]

API_SMOKE = [
    ("GET", "/api/monitoring/notification/fcm-test-status", "401/403 expected without auth"),
    ("GET", "/actuator/health", "200"),
]


def load_access() -> dict[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


def main() -> None:
    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"],
        username=acc["user"],
        password=acc["password"],
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    script = r"""
JAR=/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar
echo "=== jar file ==="
ls -la "$JAR" 2>/dev/null || echo MISSING
stat -c 'mtime=%y size=%s' "$JAR" 2>/dev/null || true

echo "=== container ==="
docker ps --filter name=cama-plus-server --format '{{.Names}} {{.Status}} {{.Image}}'
docker inspect cama-plus-server --format 'started={{.State.StartedAt}}' 2>/dev/null || true

echo "=== marker classes in jar (detailed) ==="
for cls in FcmTestMode MonitorPatient VitalRest TabletQr DoctorApk ApkStorage MonitoringRest; do
  hit=$(docker run --rm -v /opt/cama/jars:/jars eclipse-temurin:21-jdk-jammy \
    jar tf /jars/cama-back-1.0-SNAPSHOT.jar 2>/dev/null | grep -i "$cls" | head -1)
  if [ -n "$hit" ]; then echo "  OK $cls -> $hit"; else echo "  MISSING $cls"; fi
done

echo "=== spring profile / build hints from logs ==="
docker logs cama-plus-server 2>&1 | grep -iE 'Started RunApplication|profile|cafe24|BUILD' | tail -8

echo "=== API smoke with doctor auth ==="
TOKEN=$(curl -s -X POST http://127.0.0.1:8080/api/authentication/login \
  -H 'Content-Type: application/json' \
  -d '{"loginId":"cama","password":"cama!"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('accessToken','') or d.get('accessToken',''))" 2>/dev/null)
if [ -z "$TOKEN" ]; then echo "  login failed"; else
  for path in \
    /api/monitoring/notification/fcm-test-status \
    /api/monitoring/account/121; do
    code=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $TOKEN" "http://127.0.0.1:8080${path}")
    echo "  AUTH ${path} -> HTTP ${code}"
  done
fi

echo "=== recent deploy artifacts on VPS ==="
ls -la /tmp/cama-plus-server/target/*.jar 2>/dev/null | tail -3 || echo 'no /tmp build'
ls -la /opt/cama/jars/ 2>/dev/null
"""
    _, stdout, stderr = client.exec_command(script, timeout=120)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    err = stderr.read().decode().strip()
    if err:
        print("STDERR:", err[:500])
    client.close()


if __name__ == "__main__":
    main()
