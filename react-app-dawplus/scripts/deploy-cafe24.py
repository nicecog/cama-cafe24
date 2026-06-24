#!/usr/bin/env python3
"""Upload react-app-dawplus dist to Cafe24 VPS."""
from __future__ import annotations

import os
import sys
from pathlib import Path

try:
    import paramiko
except ImportError:
    print("Installing paramiko...", file=sys.stderr)
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "paramiko", "-q"])
    import paramiko

APP_ROOT = Path(__file__).resolve().parent.parent
DIST = APP_ROOT / "dist"
REMOTE_DIR = "/opt/cama/www/react-app"
DEFAULT_HOST = os.environ.get("CAMA_VPS_HOST", "210.114.18.156")
DEFAULT_USER = os.environ.get("CAMA_VPS_USER", "root")
DEFAULT_PASSWORD = os.environ.get("CAMA_VPS_PASSWORD", "admincama!")


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
            print(f" uploaded {count} files...")
    return count


def main() -> None:
    if not (DIST / "index.html").is_file():
        raise SystemExit(f"Missing {DIST / 'index.html'} — run npm run build first")

    host = DEFAULT_HOST
    user = DEFAULT_USER
    password = DEFAULT_PASSWORD
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
            uploaded = sftp_upload_tree(sftp, DIST, REMOTE_DIR)
        finally:
            sftp.close()
        print(f"Uploaded {uploaded} files.")

        host_header = "-H 'Host: camaplus.cafe24.com'"
        for url in (
            "https://127.0.0.1/webview/help",
            "https://127.0.0.1/assets/index-BK7MJHN5.js",
        ):
            stdin, stdout, stderr = client.exec_command(
                f"curl -sk -o /dev/null -w '%{{http_code}}' {url} {host_header}"
            )
            status = stdout.read().decode().strip()
            print(f" smoke {url} -> HTTP {status}")

        print("\nDeployed: https://camaplus.cafe24.com/webview/")
    finally:
        client.close()


if __name__ == "__main__":
    main()
