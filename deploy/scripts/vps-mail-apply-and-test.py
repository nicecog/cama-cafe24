#!/usr/bin/env python3
"""VPS mail env inspect/apply + restart API + recover/password smoke test."""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
DEPLOY_ROOT = SCRIPT_DIR.parent
ACCESS_LOCAL = DEPLOY_ROOT / "CAFE24_VPS_ACCESS.local.md"
ENV_PATH = "/opt/cama/deploy/.env.cafe24"
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


def mask_env_line(line: str) -> str:
    if "=" not in line:
        return line
    key, _, val = line.partition("=")
    if key in ("SPRING_MAIL_PASSWORD", "BREVO_API_KEY", "POSTGRES_PASSWORD", "JWT_CLIENT_SECRET"):
        return f"{key}=***"
    return line


def parse_env(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        out[k.strip()] = v.strip()
    return out


def merge_mail_env(existing: str, overrides: dict[str, str]) -> str:
    current = parse_env(existing)
    keys = {
        "CAMA_MAIL_ENABLED": "true",
        "CAMA_MAIL_FROM": "noreply@camaplus.com",
        "CAMA_MAIL_PROVIDER": overrides.get("CAMA_MAIL_PROVIDER")
        or current.get("CAMA_MAIL_PROVIDER", "smtp"),
        "CAMA_MAIL_SENDER_NAME": overrides.get("CAMA_MAIL_SENDER_NAME")
        or current.get("CAMA_MAIL_SENDER_NAME", "CAMA Plus"),
        "SPRING_MAIL_HOST": "smtp-relay.brevo.com",
        "SPRING_MAIL_PORT": "587",
    }
    for optional in (
        "BREVO_API_KEY",
        "SPRING_MAIL_USERNAME",
        "SPRING_MAIL_PASSWORD",
    ):
        if overrides.get(optional):
            keys[optional] = overrides[optional]
        elif current.get(optional):
            keys[optional] = current[optional]

    lines = existing.splitlines()
    out: list[str] = []
    seen: set[str] = set()
    for line in lines:
        matched = False
        for key, val in keys.items():
            if re.match(rf"^{re.escape(key)}=", line):
                out.append(f"{key}={val}")
                seen.add(key)
                matched = True
                break
        if not matched:
            out.append(line)
    for key, val in keys.items():
        if key not in seen:
            out.append(f"{key}={val}")
    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    try:
        import paramiko
    except ImportError:
        print("pip install paramiko", file=sys.stderr)
        raise SystemExit(1)

    smtp_user = os.environ.get("SMTP_USER", "").strip()
    smtp_pass = os.environ.get("SMTP_PASS", "").strip()
    brevo_api_key = os.environ.get("BREVO_API_KEY", "").strip()
    mail_provider = os.environ.get("CAMA_MAIL_PROVIDER", "").strip()
    sender_name = os.environ.get("CAMA_MAIL_SENDER_NAME", "").strip()

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
        print("=== current mail env (.env.cafe24) ===")
        stdin, stdout, stderr = client.exec_command(
            f"grep -E '^(CAMA_MAIL|SPRING_MAIL|BREVO_API)' {ENV_PATH} 2>/dev/null || true"
        )
        for line in stdout.read().decode().splitlines():
            print(mask_env_line(line))

        print("\n=== container mail env ===")
        stdin, stdout, stderr = client.exec_command(
            "docker exec cama-plus-server env 2>/dev/null | grep -E '^(CAMA_MAIL|SPRING_MAIL|BREVO_API)' || true"
        )
        for line in stdout.read().decode().splitlines():
            print(mask_env_line(line))

        print("\n=== account email (happycog / 01032984763) ===")
        sql = (
            "SELECT login_id, name, email FROM account "
            "WHERE login_id='happycog' OR REPLACE(REPLACE(phone,'-',''),' ','')='01032984763' "
            "ORDER BY seq DESC LIMIT 3;"
        )
        pg = "docker ps --format '{{.Names}}' | grep -E 'postgres' | head -1"
        stdin, stdout, stderr = client.exec_command(
            f'PG=$( {pg} ); docker exec "$PG" psql -U cama -d cama -t -A -F"|" -c "{sql}"'
        )
        rows = stdout.read().decode().strip()
        err = stderr.read().decode().strip()
        if rows:
            print(rows)
        elif err:
            print(err, file=sys.stderr)

        sftp = client.open_sftp()
        try:
            with sftp.open(ENV_PATH, "r") as f:
                existing = f.read().decode("utf-8")
        except OSError as e:
            print(f"cannot read {ENV_PATH}: {e}", file=sys.stderr)
            raise SystemExit(1)

        cur = parse_env(existing)
        provider = mail_provider or cur.get("CAMA_MAIL_PROVIDER", "smtp")
        overrides = {
            "CAMA_MAIL_PROVIDER": provider,
            "CAMA_MAIL_SENDER_NAME": sender_name or cur.get("CAMA_MAIL_SENDER_NAME", "CAMA Plus"),
            "BREVO_API_KEY": brevo_api_key or cur.get("BREVO_API_KEY", ""),
            "SPRING_MAIL_USERNAME": smtp_user or cur.get("SPRING_MAIL_USERNAME", ""),
            "SPRING_MAIL_PASSWORD": smtp_pass or cur.get("SPRING_MAIL_PASSWORD", ""),
        }
        if provider == "brevo-api":
            if not overrides["BREVO_API_KEY"]:
                print(
                    "\nERROR: BREVO_API_KEY missing. Set BREVO_API_KEY env (xkeysib-...).",
                    file=sys.stderr,
                )
                raise SystemExit(1)
        else:
            if not overrides["SPRING_MAIL_USERNAME"]:
                print(
                    "\nERROR: SPRING_MAIL_USERNAME missing. Set SMTP_USER to Brevo SMTP login.",
                    file=sys.stderr,
                )
                raise SystemExit(1)
            if not overrides["SPRING_MAIL_PASSWORD"]:
                print(
                    "\nERROR: SPRING_MAIL_PASSWORD missing. Set SMTP_PASS to Brevo SMTP key.",
                    file=sys.stderr,
                )
                raise SystemExit(1)

        merged = merge_mail_env(existing, overrides)
        with sftp.open(ENV_PATH, "w") as f:
            f.write(merged)
        sftp.close()
        client.exec_command(f"chmod 600 {ENV_PATH}")

        print("\n=== updated mail env ===")
        for line in merged.splitlines():
            if line.startswith(("CAMA_MAIL", "SPRING_MAIL", "BREVO_API")):
                print(mask_env_line(line))

        compose_local = DEPLOY_ROOT / "docker-compose.cafe24.yml"
        if compose_local.is_file():
            sftp = client.open_sftp()
            sftp.put(str(compose_local), "/opt/cama/deploy/docker-compose.cafe24.yml")
            sftp.close()
            print("\n=== uploaded docker-compose.cafe24.yml ===")

        print("\n=== restart cama-plus-server ===")
        restart_cmd = (
            "cd /opt/cama/deploy && "
            "docker stop cama-plus-server 2>/dev/null; "
            "docker rm cama-plus-server 2>/dev/null; "
            "docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 "
            "up -d --no-deps cama-plus-server 2>&1"
        )
        stdin, stdout, stderr = client.exec_command(restart_cmd)
        out = stdout.read().decode() + stderr.read().decode()
        print(out.strip() or "(restart issued)")

        import time

        time.sleep(8)

        print("\n=== container mail env (after restart) ===")
        stdin, stdout, stderr = client.exec_command(
            "docker exec cama-plus-server env | grep -E '^(CAMA_MAIL|SPRING_MAIL|BREVO_API)'"
        )
        for line in stdout.read().decode().splitlines():
            print(mask_env_line(line))

        test_email = os.environ.get("TEST_EMAIL", "").strip()
        if os.environ.get("UPDATE_ACCOUNT_EMAIL", "").lower() in ("1", "true", "yes") and test_email:
            safe_email = test_email.replace("'", "''")
            upd = (
                f"UPDATE account SET email='{safe_email}' "
                f"WHERE login_id='happycog' AND is_dropped=false;"
            )
            print(f"\n=== set happycog account email -> {test_email} ===")
            stdin, stdout, stderr = client.exec_command(
                f'PG=$( docker ps --format "{{{{.Names}}}}" | grep -E "postgres" | head -1 ); '
                f'docker exec "$PG" psql -U cama -d cama -c "{upd}"'
            )
            print(stdout.read().decode().strip() or stderr.read().decode().strip())

        if not test_email and rows:
            first = rows.splitlines()[0]
            parts = first.split("|")
            if len(parts) >= 3 and parts[2].strip():
                test_email = parts[2].strip()

        if not test_email:
            print("\nWARN: No TEST_EMAIL and DB email empty — skip recover/password send test")
            print("Set TEST_EMAIL=... or register email on test account")
            return

        print(f"\n=== recover/password test (email={test_email}) ===")
        payload = json.dumps(
            {"name": "최완규", "phone": "01032984763", "email": test_email},
            ensure_ascii=False,
        ).encode("utf-8")
        curl = (
            "curl -sS -w '\\nHTTP:%{http_code}' -X POST "
            "-H 'Content-Type: application/json' "
            "-d @- "
            "http://127.0.0.1:8080/api/public/patient/recover/password"
        )
        stdin, stdout, stderr = client.exec_command(curl)
        stdin.channel.send(payload)
        stdin.channel.shutdown_write()
        print(stdout.read().decode())

        print("\n=== recent mail-related logs ===")
        stdin, stdout, stderr = client.exec_command(
            "docker logs --since 2m cama-plus-server 2>&1 | grep -iE 'mail|smtp|javax.mail|Email' | tail -20"
        )
        logs = stdout.read().decode().strip()
        if logs:
            print(logs)
        else:
            print("(no mail log lines in last 2m)")

    finally:
        client.close()


if __name__ == "__main__":
    main()
