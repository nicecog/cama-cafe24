#!/usr/bin/env python3
"""Upload initial APK + patch VPS nginx/docker (after server deploy)."""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
APK_DIR_REMOTE = "/opt/cama/data/apk_down"
NGINX_SITE = "/etc/nginx/sites-available/cama"
DEFAULT_APK = REPO_ROOT / "dist" / "cama-plus-cafe24-2026-06-17.apk"
APK_VERSION = os.environ.get("CAMA_APK_VERSION", "1.2.7")
APK_PUBLIC_BASE = "https://camaplus.cafe24.com/apk_down"


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

    if not DEFAULT_APK.is_file():
        raise SystemExit(f"Missing APK: {DEFAULT_APK}")

    remote_name = DEFAULT_APK.name
    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    def ssh(cmd: str) -> tuple[int, str, str]:
        _, stdout, stderr = client.exec_command(cmd)
        code = stdout.channel.recv_exit_status()
        return code, stdout.read().decode(), stderr.read().decode()

    ssh(f"mkdir -p {APK_DIR_REMOTE}")

    compose_patch = """
python3 - <<'PY'
from pathlib import Path
p = Path('/opt/cama/deploy/docker-compose.cafe24.yml')
text = p.read_text(encoding='utf-8')
changed = False
if 'apk_down' not in text:
    text = text.replace(
        '../data/cama-files:/opt/cama/data/cama-files',
        '../data/cama-files:/opt/cama/data/cama-files\\n      - ../data/apk_down:/opt/cama/data/apk_down'
    )
    changed = True
if 'APK_STORAGE_PATH' not in text:
    text = text.replace(
        'FILE_STORAGE_PATH: ${FILE_STORAGE_PATH:-/opt/cama/data/cama-files}',
        'FILE_STORAGE_PATH: ${FILE_STORAGE_PATH:-/opt/cama/data/cama-files}\\n      APK_STORAGE_PATH: ${APK_STORAGE_PATH:-/opt/cama/data/apk_down}\\n      APK_PUBLIC_BASE_URL: ${APK_PUBLIC_BASE_URL:-https://camaplus.cafe24.com/apk_down}'
    )
    changed = True
if changed:
    p.write_text(text, encoding='utf-8')
    print('compose patched')
else:
    print('compose ok')
PY
"""
    _, out, err = ssh(compose_patch)
    print(out or err)
    ssh("cd /opt/cama/deploy && docker compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d cama-plus-server")
    ssh("docker restart cama-plus-server")
    import time
    time.sleep(12)

    sftp = client.open_sftp()
    remote_apk = f"{APK_DIR_REMOTE}/{remote_name}"
    print(f"Upload {DEFAULT_APK} -> {remote_apk}")
    sftp.put(str(DEFAULT_APK), remote_apk)
    uploaded_at = datetime.now(timezone.utc).astimezone().strftime("%Y.%m.%d %H:%M")
    index = [{
        "fileName": remote_name,
        "version": APK_VERSION,
        "downloadUrl": f"{APK_PUBLIC_BASE}/{remote_name}",
        "uploadedAt": uploaded_at,
        "sizeBytes": DEFAULT_APK.stat().st_size,
    }]
    with sftp.open(f"{APK_DIR_REMOTE}/apk-index.json", "w") as f:
        f.write(json.dumps(index, ensure_ascii=False, indent=2))
    sftp.close()

    _, out, _ = ssh(f"grep -q 'location /apk_down/' {NGINX_SITE} && echo found || echo missing")
    if "missing" in out:
        patch = """
    location /apk_down/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 55m;
    }
"""
        patch_cmd = (
            "python3 - <<'PY'\n"
            "from pathlib import Path\n"
            f"p = Path('{NGINX_SITE}')\n"
            "text = p.read_text(encoding='utf-8')\n"
            "if 'location /apk_down/' not in text:\n"
            "    needle = 'location /files/'\n"
            "    idx = text.find(needle)\n"
            "    end = text.find('}', idx)\n"
            "    end = text.find('}', end + 1)\n"
            f"    insert = '''{patch}'''\n"
            "    text = text[:end+1] + insert + text[end+1:]\n"
            "    p.write_text(text, encoding='utf-8')\n"
            "    print('nginx patched')\n"
            "else:\n"
            "    print('nginx ok')\n"
            "PY"
        )
        _, out, err = ssh(patch_cmd)
        print(out or err)
        ssh("nginx -t && systemctl reload nginx")

    _, out, _ = ssh(
        f"curl -s -o /dev/null -w '%{{http_code}}' http://127.0.0.1:8080/apk_down/{remote_name}"
    )
    print(f"Local APK download HTTP {out.strip()}")

    _, out, _ = ssh(
        "DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' "
        "-d '{\"principal\":\"happycog\",\"credentials\":\"admincama!\"}' | python3 -c \"import sys,json; print(json.load(sys.stdin).get('response',{}).get('apiToken',''))\") && "
        "curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list -H 'Content-Type: application/json' "
        "-H \"api_key: Bearer $DT\" -d '{}'"
    )
    print(f"APK list API: {out[:300]}")

    client.close()
    print(f"\nDownload: {APK_PUBLIC_BASE}/{remote_name}")
    print("Admin: https://camaplus.cafe24.com/admin/main/contentMng/apkMng")


if __name__ == "__main__":
    main()
