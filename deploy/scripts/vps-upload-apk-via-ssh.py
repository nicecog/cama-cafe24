#!/usr/bin/env python3
"""Upload APK via SSH + localhost doctor API (bypasses nginx 40m limit)."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
NGINX_SITE = "/etc/nginx/sites-available/cama"


def load_access() -> dict[str, str]:
    host = "210.114.18.156"
    user = "root"
    password = "admincama!"
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
    apk_path = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO_ROOT / "dist" / "cama-plus-cafe24-1.2.11-release.apk"
    version = sys.argv[2] if len(sys.argv) > 2 else "1.2.11"
    if not apk_path.is_file():
        raise SystemExit(f"APK not found: {apk_path}")

    acc = load_access()
    remote_tmp = f"/tmp/{apk_path.name}"

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

    def ssh(cmd: str) -> tuple[int, str, str]:
        _, stdout, stderr = client.exec_command(cmd)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode(), stderr.read().decode()

    patch_cmd = f"""python3 - <<'PY'
from pathlib import Path
for p in [Path('{NGINX_SITE}'), Path('/etc/nginx/sites-enabled/cama')]:
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    if 'location /api/' not in text:
        print(p, 'no /api/ block')
        continue
    block = text.split('location /api/', 1)[1].split('location /', 1)[0]
    if 'client_max_body_size 55m' in block:
        print(p, 'already ok')
        continue
    text = text.replace('location /api/ {{', 'location /api/ {{\\n        client_max_body_size 55m;', 1)
    p.write_text(text, encoding='utf-8')
    print(p, 'patched')
PY
nginx -t && systemctl reload nginx"""
    code, out, err = ssh(patch_cmd)
    print(out or err)

    sftp = client.open_sftp()
    print(f"SFTP {apk_path} -> {remote_tmp}")
    sftp.put(str(apk_path), remote_tmp)
    sftp.close()

    upload_cmd = (
        "DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor "
        "-H 'Content-Type: application/json' "
        "-d '{\"principal\":\"cama\",\"credentials\":\"cama!\"}' "
        "| python3 -c \"import sys,json; print(json.load(sys.stdin).get('response',{}).get('apiToken',''))\") "
        f"&& curl -s -w '\\nHTTP %{{http_code}}\\n' -X POST http://127.0.0.1:8080/api/doctor/apk/upload "
        f"-H \"api_key: Bearer $DT\" -F version={version} -F file=@{remote_tmp}"
    )
    code, out, err = ssh(upload_cmd)
    print(out)
    if err:
        print(err, file=sys.stderr)
    if code != 0:
        raise SystemExit(code)

    list_cmd = (
        "DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor "
        "-H 'Content-Type: application/json' "
        "-d '{\"principal\":\"cama\",\"credentials\":\"cama!\"}' "
        "| python3 -c \"import sys,json; print(json.load(sys.stdin).get('response',{}).get('apiToken',''))\") "
        "&& curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list "
        "-H \"api_key: Bearer $DT\" -H 'Content-Type: application/json' -d '{}'"
    )
    code, out, err = ssh(list_cmd)
    print(f"\nAPK list API:\n{out[:1000]}")
    print("\nAdmin: https://camaplus.cafe24.com/admin/main/contentMng/apkMng")
    client.close()


if __name__ == "__main__":
    main()
