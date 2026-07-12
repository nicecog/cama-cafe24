#!/usr/bin/env python3
"""Smoke-test consultation inquiry APIs after deploy."""
from __future__ import annotations

import re
import time
from pathlib import Path

import paramiko

DEPLOY_ROOT = Path(__file__).resolve().parent.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"


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


def run(client: paramiko.SSHClient, cmd: str) -> str:
    _, stdout, stderr = client.exec_command(cmd, timeout=60)
    time.sleep(0.3)
    return stdout.read().decode(errors="replace") + stderr.read().decode(
        errors="replace"
    )


def main() -> None:
    acc = load_access()
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
    tests = [
        (
            "list",
            "curl -s -w '\\nHTTP %{http_code}\\n' "
            "'http://127.0.0.1:8080/api/webview/consultation-inquiry?acSeq=1'",
        ),
        (
            "transmit",
            "curl -s -w '\\nHTTP %{http_code}\\n' -X POST "
            "'http://127.0.0.1:8080/api/webview/consultation-inquiry/transmit' "
            "-H 'Content-Type: application/json' "
            "-d '{\"acSeq\":1,\"seqs\":[]}'",
        ),
        (
            "create-validation",
            "curl -s -w '\\nHTTP %{http_code}\\n' -X POST "
            "'http://127.0.0.1:8080/api/webview/consultation-inquiry' "
            "-H 'Content-Type: application/json' "
            "-d '{\"acSeq\":1,\"title\":\"배포검증\",\"content\":\"작성일 포함 전송 테스트\"}'",
        ),
        (
            "spa",
            "test -f /opt/cama/www/react-app/index.html && echo SPA_OK || echo SPA_MISSING",
        ),
    ]
    for name, cmd in tests:
        print(f"=== {name} ===")
        print(run(client, cmd))
    client.close()


if __name__ == "__main__":
    main()
