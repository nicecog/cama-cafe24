#!/usr/bin/env python3
"""Deploy APK management feature: server + super-admin + initial APK upload."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
DEFAULT_HOST = "210.114.18.156"
DEFAULT_USER = "root"
DEFAULT_PASSWORD = "admincama!"
APK_DIR_REMOTE = "/opt/cama/data/apk_down"
NGINX_SITE = "/etc/nginx/sites-available/cama"
DEFAULT_APK = REPO_ROOT / "dist" / "cama-plus-cafe24-2026-06-17.apk"
FALLBACK_APK = REPO_ROOT / "dist" / "cama-plus-cafe24-1.2.7-release.apk"
APK_VERSION = os.environ.get("CAMA_APK_VERSION", "1.2.7")
APK_PUBLIC_BASE = "https://camaplus.cafe24.com/apk_down"


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


def pick_apk() -> Path:
    if DEFAULT_APK.is_file():
        return DEFAULT_APK
    if FALLBACK_APK.is_file():
        return FALLBACK_APK
    raise SystemExit("No APK found under dist/. Build APK first.")


def run_local(script_name: str) -> None:
    script = SCRIPT_DIR / script_name
    print(f"\n=== Running {script_name} ===")
    r = subprocess.run([sys.executable, str(script)], cwd=REPO_ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)


def main() -> None:
    import paramiko

    apk_path = pick_apk()
    remote_name = apk_path.name

    run_local("vps-deploy-server-src.py")
    run_local("vps-deploy-super-admin.py")

    acc = load_access()
    print(f"\n=== Uploading APK to {acc['host']} ===")
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

    ssh(f"mkdir -p {APK_DIR_REMOTE} /opt/cama/data/apk_down")

    # Ensure docker-compose mounts apk_down (idempotent)
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
    code, out, err = ssh(compose_patch)
    print(out or err)
    ssh("cd /opt/cama/deploy && docker compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d cama-plus-server")

    sftp = client.open_sftp()
    remote_apk = f"{APK_DIR_REMOTE}/{remote_name}"
    print(f"SFTP {apk_path} -> {remote_apk}")
    sftp.put(str(apk_path), remote_apk)

    uploaded_at = datetime.now(timezone.utc).astimezone().strftime("%Y.%m.%d %H:%M")
    index = [
        {
            "fileName": remote_name,
            "version": APK_VERSION,
            "downloadUrl": f"{APK_PUBLIC_BASE}/{remote_name}",
            "uploadedAt": uploaded_at,
            "sizeBytes": apk_path.stat().st_size,
        }
    ]
    index_remote = f"{APK_DIR_REMOTE}/apk-index.json"
    with sftp.open(index_remote, "w") as f:
        f.write(json.dumps(index, ensure_ascii=False, indent=2))
    sftp.close()

    code, out, err = ssh(f"grep -q 'location /apk_down/' {NGINX_SITE} && echo found || echo missing")
    if "missing" in out:
        print("Patching nginx for /apk_down/ ...")
        patch = r"""
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
            "    if idx < 0:\n"
            "        raise SystemExit('nginx site missing /files/ block')\n"
            "    end = text.find('}', idx)\n"
            "    end = text.find('}', end + 1)\n"
            f"    insert = '''{patch}'''\n"
            "    text = text[:end+1] + insert + text[end+1:]\n"
            "    p.write_text(text, encoding='utf-8')\n"
            "    print('patched')\n"
            "else:\n"
            "    print('already patched')\n"
            "PY"
        )
        code, out, err = ssh(patch_cmd)
        print(out or err)
        ssh("nginx -t && systemctl reload nginx")

    code, out, err = ssh(
        f"curl -s -o /dev/null -w '%{{http_code}}' http://127.0.0.1:8080/apk_down/{remote_name}"
    )
    print(f"APK download probe HTTP {out.strip()}")

    client.close()
    print("\nDone.")
    print(f"Admin: https://camaplus.cafe24.com/admin/main/contentMng/apkMng")
    print(f"Download: {APK_PUBLIC_BASE}/{remote_name}")


if __name__ == "__main__":
    main()
