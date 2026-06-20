#!/usr/bin/env python3
"""Upload react-app-dawplus dist + apply patient SPA nginx (password SSH via paramiko)."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
APP_ROOT = REPO_ROOT / "react-app-dawplus"
DIST = APP_ROOT / "dist"
DEPLOY_ROOT = REPO_ROOT / "deploy"
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
REMOTE_DIR = "/opt/cama/www/react-app"
DEFAULT_HOST = "210.114.18.156"
DEFAULT_USER = "root"
DEFAULT_PASSWORD = "admincama!"


def load_access() -> dict[str, str]:
    host = os.environ.get("CAMA_VPS_HOST", DEFAULT_HOST)
    user = os.environ.get("CAMA_VPS_USER", DEFAULT_USER)
    password = os.environ.get("CAMA_VPS_PASSWORD", DEFAULT_PASSWORD)

    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)

    return {"host": host, "user": user, "password": password}


def ensure_build() -> None:
    if (DIST / "index.html").is_file():
        return
    print("Building react-app-dawplus...")
    r = subprocess.run(
        [sys.executable, str(SCRIPT_DIR / "build-react-app-cafe24.mjs")],
        cwd=REPO_ROOT,
    )
    if r.returncode != 0:
        raise SystemExit(r.returncode)


def sftp_upload_tree(sftp, local: Path, remote: str) -> int:
    count = 0
    for path in local.rglob("*"):
        rel = path.relative_to(local).as_posix()
        remote_path = f"{remote}/{rel}" if rel != "." else remote
        if path.is_dir():
            try:
                sftp.stat(remote_path)
            except OSError:
                sftp.mkdir(remote_path)
            continue
        parent = "/".join(remote_path.split("/")[:-1])
        if parent:
            parts = []
            for part in parent.split("/"):
                if not part:
                    continue
                parts.append(part)
                cur = "/" + "/".join(parts)
                try:
                    sftp.stat(cur)
                except OSError:
                    sftp.mkdir(cur)
        sftp.put(str(path), remote_path)
        count += 1
        if count % 50 == 0:
            print(f"  uploaded {count} files...")
    return count


def main() -> None:
    try:
        import paramiko
    except ImportError:
        print("paramiko required: pip install paramiko", file=sys.stderr)
        raise SystemExit(1)

    ensure_build()
    if not (DIST / "index.html").is_file():
        raise SystemExit("dist/index.html missing")

    creds = load_access()
    host, user, password = creds["host"], creds["user"], creds["password"]
    print(f"Connecting {user}@{host} ...")

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=host,
        username=user,
        password=password,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    try:
        stdin, stdout, stderr = client.exec_command(f"mkdir -p {REMOTE_DIR}")
        stdout.channel.recv_exit_status()

        print(f"Uploading {DIST} -> {REMOTE_DIR} ...")
        sftp = client.open_sftp()
        try:
            n = sftp_upload_tree(sftp, DIST, REMOTE_DIR)
        finally:
            sftp.close()
        print(f"Uploaded {n} files.")

        snippet = DEPLOY_ROOT / "nginx" / "cama-patient-spa-locations.conf"
        nginx_full = SCRIPT_DIR / "vps-deploy-nginx-full.py"
        print("Applying full nginx site config (preserves /admin/ proxy)...")
        r = subprocess.run([sys.executable, str(nginx_full)], cwd=REPO_ROOT)
        if r.returncode != 0:
            raise SystemExit(r.returncode)

        print("Smoke test (local curl on VPS) ...")
        host_header = "-H 'Host: camaplus.cafe24.com'"
        for url in (
            "https://127.0.0.1/webview/help",
            "https://127.0.0.1/help",
        ):
            stdin, stdout, stderr = client.exec_command(
                f"curl -sk -o /dev/null -w '%{{http_code}}' {url} {host_header}"
            )
            status = stdout.read().decode().strip()
            print(f"  {url} -> HTTP {status}")

        print("\nDone.")
        print("  https://camaplus.cafe24.com/webview/help")
        print("  https://camaplus.cafe24.com/webview/coaching/TEST_LOGIN_ID")
    finally:
        client.close()


if __name__ == "__main__":
    main()
