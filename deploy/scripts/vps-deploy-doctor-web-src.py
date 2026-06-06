#!/usr/bin/env python3
"""Upload cama-doctor-web sources, Maven package on VPS, restart doctor-web container."""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DEPLOY_ROOT = REPO_ROOT / "deploy"
ZIP_SCRIPT = SCRIPT_DIR / "make-doctor-web-src-zip.py"
ZIP_PATH = DEPLOY_ROOT / "cama-doctor-web-src.zip"
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
REMOTE_ZIP = "/tmp/cama-doctor-web-src.zip"
REMOTE_DIR = "/tmp/cama-doctor-web"
JAR_REMOTE = "/opt/cama/jars/cama-doctor-web-0.0.1-SNAPSHOT.jar"


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


def run_zip() -> None:
    r = subprocess.run([sys.executable, str(ZIP_SCRIPT)], cwd=REPO_ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)
    if not ZIP_PATH.is_file():
        raise SystemExit(f"Missing zip: {ZIP_PATH}")


def main() -> None:
    import paramiko

    run_zip()
    acc = load_access()
    print(f"Connecting {acc['user']}@{acc['host']} ...")

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

    sftp = client.open_sftp()
    print(f"Upload {ZIP_PATH} -> {REMOTE_ZIP}")
    sftp.put(str(ZIP_PATH), REMOTE_ZIP)
    sftp.close()

    cmds = f"""
set -e
rm -rf {REMOTE_DIR} && mkdir -p {REMOTE_DIR}
python3 -c "import zipfile; zipfile.ZipFile('{REMOTE_ZIP}').extractall('{REMOTE_DIR}')"
cd {REMOTE_DIR}
docker run --rm -v {REMOTE_DIR}:/app -w /app \\
  gradle:8.14-jdk21 gradle bootJar -x test --no-daemon -q
cp -f {REMOTE_DIR}/build/libs/cama-doctor-web-0.0.1-SNAPSHOT.jar {JAR_REMOTE}
docker restart cama-doctor-web
sleep 12
curl -s -o /dev/null -w 'doctor-web health HTTP %{{http_code}}\\n' http://127.0.0.1:8081/actuator/health
"""
    _, o, e = client.exec_command(cmds, timeout=600)
    o.channel.recv_exit_status()
    print(o.read().decode("utf-8", errors="replace"))
    err = e.read().decode("utf-8", errors="replace")
    if err.strip():
        print("ERR:", err)
    client.close()


if __name__ == "__main__":
    main()
