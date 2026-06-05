#!/usr/bin/env python3
"""Upload cama-plus-server sources, Maven package on VPS, restart API container."""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
DEPLOY_ROOT = REPO_ROOT / "deploy"
ZIP_SCRIPT = SCRIPT_DIR / "make-server-src-zip.py"
ZIP_PATH = DEPLOY_ROOT / "cama-plus-server-src.zip"
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
REMOTE_ZIP = "/tmp/cama-plus-server-src.zip"
REMOTE_DIR = "/tmp/cama-plus-server"
JAR_REMOTE = "/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar"


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
docker run --rm -v {REMOTE_DIR}:/app -v /root/.m2:/root/.m2 -w /app \\
  maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests -q
cp -f {REMOTE_DIR}/target/cama-back-1.0-SNAPSHOT.jar {JAR_REMOTE}
docker restart cama-plus-server
sleep 12
curl -s -o /dev/null -w 'recover login-id HTTP %{{http_code}}\\n' \\
  -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id \\
  -H 'Content-Type: application/json' \\
  -d '{{"name":"최완규","phone":"01032984763"}}'
"""
    stdin, stdout, stderr = client.exec_command(cmds, timeout=900)
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace")
    code = stdout.channel.recv_exit_status()
    if out:
        print(out)
    if err:
        print(err, file=sys.stderr)
    client.close()
    if code != 0:
        raise SystemExit(code)
    print("Done.")


if __name__ == "__main__":
    main()
