#!/usr/bin/env python3
"""대용량 APK를 SFTP로 /opt/cama/data/apk_down 에 넣고 apk-index.json 을 갱신한다.

nginx/Spring multipart 한도를 우회한다.
사용: python deploy/scripts/vps-register-apk-sftp.py path/to.apk 1.2.23
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
APK_DIR = "/opt/cama/data/apk_down"
PUBLIC_BASE = "https://camaplus.cafe24.com/apk_down"
KST = timezone(timedelta(hours=9))


def load_access() -> dict[str, str]:
    host, user, password = "210.114.18.156", "root", "admincama!"
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
    apk = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO_ROOT / "dist" / "cama-plus-cafe24-1.2.23-release.apk"
    version = sys.argv[2] if len(sys.argv) > 2 else "1.2.23"
    if not apk.is_file():
        raise SystemExit(f"APK not found: {apk}")

    remote_name = apk.name
    remote_path = f"{APK_DIR}/{remote_name}"
    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    def ssh(cmd: str) -> tuple[int, str]:
        _, stdout, stderr = client.exec_command(cmd, timeout=120)
        code = stdout.channel.recv_exit_status()
        return code, (stdout.read() + stderr.read()).decode(errors="replace")

    ssh(f"mkdir -p {APK_DIR}")
    patch = r"""
python3 - <<'PY'
from pathlib import Path
for p in [Path('/etc/nginx/sites-available/cama'), Path('/etc/nginx/sites-enabled/cama')]:
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    text2 = text.replace('client_max_body_size 55m', 'client_max_body_size 150m')
    text2 = text2.replace('client_max_body_size 50m', 'client_max_body_size 150m')
    if 'client_max_body_size 150m' not in text2 and 'location /api/' in text2:
        text2 = text2.replace('location /api/ {', 'location /api/ {\n        client_max_body_size 150m;', 1)
    if text2 != text:
        p.write_text(text2, encoding='utf-8')
        print(p, 'patched to 150m')
    else:
        print(p, 'ok')
PY
nginx -t && systemctl reload nginx
"""
    _, out = ssh(patch)
    print(out)

    sftp = client.open_sftp()
    # file may already be uploaded
    try:
        st = sftp.stat(remote_path)
        if st.st_size == apk.stat().st_size:
            print(f"remote already has {remote_path} ({st.st_size:,} bytes)")
        else:
            print(f"SFTP replace {apk} -> {remote_path}")
            sftp.put(str(apk), remote_path)
    except OSError:
        print(f"SFTP {apk} ({apk.stat().st_size:,} bytes) -> {remote_path}")
        sftp.put(str(apk), remote_path)

    index_path = f"{APK_DIR}/apk-index.json"
    try:
        with sftp.open(index_path, "r") as handle:
            releases = json.loads(handle.read().decode("utf-8"))
    except OSError:
        releases = []
    if not isinstance(releases, list):
        releases = []

    uploaded_at = datetime.now(KST).strftime("%Y.%m.%d %H:%M")
    entry = {
        "fileName": remote_name,
        "version": version,
        "downloadUrl": f"{PUBLIC_BASE}/{remote_name}",
        "uploadedAt": uploaded_at,
        "sizeBytes": apk.stat().st_size,
    }
    releases = [r for r in releases if r.get("fileName") != remote_name and r.get("version") != version]
    releases.append(entry)
    with sftp.open(index_path, "w") as handle:
        handle.write(json.dumps(releases, ensure_ascii=False, indent=2).encode("utf-8"))
    sftp.close()

    _, out = ssh(
        f"ls -lh {remote_path}; curl -s -o /dev/null -w 'local:%{{http_code}}\\n' "
        f"http://127.0.0.1:8080/apk_down/{remote_name}"
    )
    print(out)
    _, out = ssh(
        "DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor "
        "-H 'Content-Type: application/json' "
        "-d '{\"principal\":\"cama\",\"credentials\":\"cama!\"}' "
        "| python3 -c \"import sys,json; print(json.load(sys.stdin).get('response',{}).get('apiToken',''))\") "
        "&& curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list "
        "-H \"api_key: Bearer $DT\" -H 'Content-Type: application/json' -d '{}'"
    )
    print("APK list:", out[:1200])
    client.close()
    print(f"\nDownload: {PUBLIC_BASE}/{remote_name}")
    print("Admin: https://camaplus.cafe24.com/admin/main/contentMng/apkMng")


if __name__ == "__main__":
    main()
