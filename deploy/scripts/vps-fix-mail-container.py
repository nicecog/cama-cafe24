#!/usr/bin/env python3
"""Ensure docker-compose passes SPRING_MAIL_* and recreate cama-plus-server."""
from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
COMPOSE_LOCAL = DEPLOY_ROOT / "docker-compose.cafe24.yml"
REMOTE_COMPOSE = "/opt/cama/deploy/docker-compose.cafe24.yml"
ENV_PATH = "/opt/cama/deploy/.env.cafe24"


def load_access() -> dict[str, str]:
    text = ACCESS_LOCAL.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


def main() -> None:
    import paramiko

    creds = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        hostname=creds["host"],
        username=creds["user"],
        password=creds["password"],
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    try:
        sftp = client.open_sftp()
        sftp.put(str(COMPOSE_LOCAL), REMOTE_COMPOSE)
        sftp.close()
        print("uploaded", COMPOSE_LOCAL.name, "->", REMOTE_COMPOSE)

        cmd = (
            "cd /opt/cama/deploy && "
            "docker stop cama-plus-server 2>/dev/null; "
            "docker rm cama-plus-server 2>/dev/null; "
            "docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 "
            "up -d --no-deps cama-plus-server"
        )
        _, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        err = stderr.read().decode().strip()
        if err:
            print(err, file=sys.stderr)

        print("waiting for Spring Boot...")
        for i in range(24):
            time.sleep(5)
            _, stdout, _ = client.exec_command(
                "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/actuator/health"
            )
            code = stdout.read().decode().strip()
            print(f"  health check {i + 1}: HTTP {code}")
            if code == "200":
                break

        _, stdout, _ = client.exec_command(
            "docker exec cama-plus-server env | grep -E '^(CAMA_MAIL|SPRING_MAIL)' | sort"
        )
        print("\n=== container mail env ===")
        for line in stdout.read().decode().splitlines():
            if "SPRING_MAIL_PASSWORD" in line:
                print("SPRING_MAIL_PASSWORD=***")
            else:
                print(line)

        payload = json.dumps(
            {"name": "최완규", "phone": "01032984763", "email": "happycog@gmail.com"},
            ensure_ascii=False,
        )
        curl = (
            "curl -sS -w '\\nHTTP:%{http_code}' -X POST "
            "-H 'Content-Type: application/json' "
            f"-d '{payload}' "
            "http://127.0.0.1:8080/api/public/patient/recover/password"
        )
        _, stdout, stderr = client.exec_command(curl)
        print("\n=== recover/password ===")
        print(stdout.read().decode())

        _, stdout, _ = client.exec_command(
            "docker logs --since 3m cama-plus-server 2>&1 | grep -iE 'mail|smtp|javax.mail|Email|sent' | tail -25"
        )
        logs = stdout.read().decode().strip()
        print("\n=== mail logs ===")
        print(logs or "(none)")
    finally:
        client.close()


if __name__ == "__main__":
    main()
