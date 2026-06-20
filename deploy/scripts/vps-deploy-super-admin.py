#!/usr/bin/env python3
"""Build cama-super-admin and deploy to Cafe24 VPS (docker or static www)."""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ADMIN_ROOT = REPO_ROOT / "cama-super-admin"
BUILD_SCRIPT = SCRIPT_DIR / "build-super-admin-cafe24.mjs"
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
REMOTE_WWW = "/opt/cama/www/super-admin"
REMOTE_NGINX_CONTAINER = "/opt/cama/deploy/nginx/cama-super-admin-container.conf"
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


def ensure_build(force: bool = False) -> Path:
    build_dir = ADMIN_ROOT / "dist"
    if force or not (build_dir / "index.html").is_file():
        print("Building cama-super-admin...")
        r = subprocess.run(["node", str(BUILD_SCRIPT)], cwd=REPO_ROOT)
        if r.returncode != 0:
            raise SystemExit(r.returncode)
    if not (build_dir / "index.html").is_file():
        raise SystemExit(f"Missing build output: {build_dir}")
    return build_dir


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


def main() -> None:
    import paramiko

    build_dir = ensure_build(force=True)
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
    try:
        sftp.mkdir(REMOTE_WWW)
    except OSError:
        pass

    n = sftp_upload_tree(sftp, build_dir, REMOTE_WWW)
    sftp.close()
    print(f"Uploaded {n} files → {REMOTE_WWW}")

    compose_local = REPO_ROOT / "deploy" / "docker-compose.cafe24.yml"
    nginx_snip = REPO_ROOT / "deploy" / "nginx" / "cama-super-admin-locations.conf"
    nginx_container = REPO_ROOT / "deploy" / "nginx" / "cama-super-admin-container.conf"
    sftp = client.open_sftp()
    sftp.put(str(compose_local), "/opt/cama/deploy/docker-compose.cafe24.yml")
    sftp.put(str(nginx_snip), "/opt/cama/deploy/nginx/cama-super-admin-locations.conf")
    sftp.put(str(nginx_container), REMOTE_NGINX_CONTAINER)
    sftp.close()

    cmd = (
        "cd /opt/cama/deploy && "
        "docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 "
        "up -d --no-deps cama-super-admin 2>&1"
    )
    _, stdout, stderr = client.exec_command(cmd, timeout=300)
    out = stdout.read().decode(errors="replace") + stderr.read().decode(errors="replace")
    print(out.strip() or "(compose up issued)")

    apply_py = REPO_ROOT / "deploy" / "scripts" / "vps-deploy-nginx-full.py"
    r = subprocess.run([sys.executable, str(apply_py)], cwd=REPO_ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)

    _, stdout, _ = client.exec_command(
        "curl -sk -o /dev/null -w 'public_admin:%{http_code}\\n' "
        "https://camaplus.cafe24.com/admin/"
    )
    print(stdout.read().decode(errors="replace").strip())

    client.close()
    print("Done. https://camaplus.cafe24.com/admin/")


if __name__ == "__main__":
    main()
