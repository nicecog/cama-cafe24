#!/usr/bin/env python3
"""Upload server sources and rebuild JAR on VPS."""
from __future__ import annotations

import os
import re
import subprocess
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ZIP_SCRIPT = SCRIPT_DIR / "make-server-src-zip.py"
ZIP_PATH = REPO_ROOT / "deploy" / "cama-plus-server-src.zip"
ACCESS_LOCAL = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
    user = os.environ.get("CAMA_VPS_USER", "root")
    password = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def main() -> None:
    import paramiko

    r = subprocess.run([sys.executable, str(ZIP_SCRIPT)], cwd=REPO_ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)

    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    sftp = client.open_sftp()
    sftp.put(str(ZIP_PATH), "/tmp/cama-plus-server-src.zip")
    sftp.close()

    script = r"""
set -e
rm -rf /tmp/cama-plus-server && mkdir -p /tmp/cama-plus-server
python3 -c "import zipfile; zipfile.ZipFile('/tmp/cama-plus-server-src.zip').extractall('/tmp/cama-plus-server')"
cd /tmp/cama-plus-server
echo "=== mvn package ==="
docker run --rm -v /tmp/cama-plus-server:/app -v /root/.m2:/root/.m2 -w /app \
  maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests
test -f target/cama-back-1.0-SNAPSHOT.jar
cp -f target/cama-back-1.0-SNAPSHOT.jar /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar
docker run --rm -v /opt/cama/jars:/jars maven:3.9-eclipse-temurin-21 \
  jar tf /jars/cama-back-1.0-SNAPSHOT.jar | grep FcmTestModeService
docker restart cama-plus-server
sleep 25
curl -s -o /dev/null -w 'fcm-status HTTP %{http_code}\n' http://127.0.0.1:8080/api/monitoring/notification/fcm-test-status || true
"""
    _, stdout, stderr = client.exec_command(script, timeout=900)
    while not stdout.channel.exit_status_ready():
        time.sleep(10)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    print(out)
    if err:
        print(err, file=sys.stderr)
    client.close()
    if code != 0:
        raise SystemExit(code)
    print("Rebuild complete.")


if __name__ == "__main__":
    main()
