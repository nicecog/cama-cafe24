#!/usr/bin/env python3
"""Upload pre-built cama-super-admin dist to VPS."""
from __future__ import annotations

import os
import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
BUILD_DIR = REPO_ROOT / "cama-super-admin" / "dist"
REMOTE_WWW = "/opt/cama/www/super-admin"
ACCESS = REPO_ROOT / "deploy" / "CAFE24_VPS_ACCESS.local.md"


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
    return count


def main() -> int:
    if not (BUILD_DIR / "index.html").is_file():
        print("Missing dist — run: cd cama-super-admin && npx vite build --mode production")
        return 1

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    password = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=password, timeout=30, allow_agent=False, look_for_keys=False)
    sftp = c.open_sftp()
    try:
        sftp.mkdir(REMOTE_WWW)
    except OSError:
        pass
    n = sftp_upload_tree(sftp, BUILD_DIR, REMOTE_WWW)
    sftp.close()
    print(f"Uploaded {n} files")
    c.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
