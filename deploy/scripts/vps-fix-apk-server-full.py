#!/usr/bin/env python3
"""Full APK server fix: rebuild JAR on VPS, restart container with apk_down mount."""
from __future__ import annotations

import re
import subprocess
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ZIP_SCRIPT = SCRIPT_DIR / "make-server-src-zip.py"
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"


def load_access() -> dict[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


def main() -> None:
    import paramiko

    subprocess.run([sys.executable, str(ZIP_SCRIPT)], cwd=REPO_ROOT, check=True)
    zip_path = SCRIPT_DIR.parent / "cama-plus-server-src.zip"
    acc = load_access()

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    sftp = client.open_sftp()
    sftp.put(str(zip_path), "/tmp/cama-plus-server-src.zip")
    sftp.close()

    script = r"""
set -e
rm -rf /tmp/cama-plus-server && mkdir -p /tmp/cama-plus-server
python3 -c "import zipfile; zipfile.ZipFile('/tmp/cama-plus-server-src.zip').extractall('/tmp/cama-plus-server')"
test -f /tmp/cama-plus-server/src/main/java/com/cama/back/controller/doctor/DoctorApkRestController.java
docker run --rm -v /tmp/cama-plus-server:/app -v /root/.m2:/root/.m2 -w /app \
  maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests -q
docker run --rm -v /tmp/cama-plus-server/target:/t maven:3.9-eclipse-temurin-21 \
  jar tf /t/cama-back-1.0-SNAPSHOT.jar | grep DoctorApkRestController
cp -f /tmp/cama-plus-server/target/cama-back-1.0-SNAPSHOT.jar /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar
mkdir -p /opt/cama/data/apk_down
docker rm -f cama-plus-server 2>/dev/null || true
cd /opt/cama/deploy
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 create --force-recreate cama-plus-server 2>/dev/null || true
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 start cama-plus-server 2>/dev/null || \
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d --no-deps cama-plus-server
sleep 18
docker exec cama-plus-server ls -la /opt/cama/data/apk_down/
curl -s -o /dev/null -w 'apk_http=%{http_code}\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk
DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' \
  -d '{"principal":"cama","credentials":"admincama!"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list -H 'Content-Type: application/json' \
  -H "api_key: Bearer $DT" -d '{}'
echo
"""
    _, stdout, stderr = client.exec_command(script, timeout=600)
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode()
    err = stderr.read().decode()
    print(out)
    if err.strip():
        print("STDERR:", err)
    if code != 0:
        raise SystemExit(code)
    client.close()
    print("OK")


if __name__ == "__main__":
    main()
