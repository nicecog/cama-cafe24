#!/usr/bin/env python3
"""Restore cama-plus-server with correct env + apk_down mount."""
from __future__ import annotations

import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"


def load_access() -> dict[str, str]:
    text = ACCESS.read_text(encoding="utf-8")
    return {
        "host": re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1),
        "user": re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text).group(1),
        "password": re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1),
    }


def main() -> None:
    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        acc["host"], username=acc["user"], password=acc["password"],
        timeout=30, allow_agent=False, look_for_keys=False,
    )

    remote_py = r'''
import re, subprocess, time
from pathlib import Path

env = {}
for line in Path("/opt/cama/deploy/.env.cafe24").read_text(encoding="utf-8").splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    env[k.strip()] = v.strip()

def run(cmd):
    print(">", cmd[:120])
    r = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    if r.stdout.strip():
        print(r.stdout)
    if r.stderr.strip():
        print(r.stderr)
    return r.returncode

run("docker rm -f cama-plus-server e6dee92c77c4_cama-plus-server 2>/dev/null || true")
run("cd /opt/cama/deploy && docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 rm -sf cama-plus-server 2>/dev/null || true")

args = []
for k in [
    "SERVER_PORT", "DB_URL", "DB_USER", "DB_PASSWORD", "JWT_CLIENT_SECRET",
    "IAMPORT_KEY", "IAMPORT_SECRET", "CAMA_STORAGE_TYPE", "FILE_STORAGE_PATH",
    "APK_STORAGE_PATH", "APK_PUBLIC_BASE_URL", "IMAGE_CDN_BASE_URL", "CAMA_CORS_ORIGINS",
    "CAMA_MAIL_ENABLED", "CAMA_MAIL_FROM", "CAMA_MAIL_PROVIDER", "CAMA_MAIL_SENDER_NAME",
    "BREVO_API_KEY", "SPRING_MAIL_HOST", "SPRING_MAIL_PORT", "SPRING_MAIL_USERNAME", "SPRING_MAIL_PASSWORD",
]:
    val = env.get(k, "")
    if k == "SERVER_PORT" and not val:
        val = "8080"
    if k == "DB_URL" and not val:
        val = "jdbc:postgresql://postgres:5432/cama"
    if k == "DB_USER" and not val:
        val = env.get("POSTGRES_USER", "cama")
    if k == "DB_PASSWORD" and not val:
        val = env.get("POSTGRES_PASSWORD", "")
    if k == "CAMA_STORAGE_TYPE" and not val:
        val = "local"
    if k == "FILE_STORAGE_PATH" and not val:
        val = "/opt/cama/data/cama-files"
    if k == "APK_STORAGE_PATH" and not val:
        val = "/opt/cama/data/apk_down"
    if k == "APK_PUBLIC_BASE_URL" and not val:
        val = "https://camaplus.cafe24.com/apk_down"
    if val:
        args.append(f'-e "{k}={val}"')

cmd = "docker run -d --name cama-plus-server --restart unless-stopped --network deploy_default " \
      "-p 127.0.0.1:8080:8080 " \
      "-v /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro " \
      "-v /opt/cama/data/cama-files:/opt/cama/data/cama-files " \
      "-v /opt/cama/data/apk_down:/opt/cama/data/apk_down " \
      "-w /app " + " ".join(args) + " " \
      "eclipse-temurin:21-jre-jammy java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24"
run(cmd)
time.sleep(30)
run("docker ps | grep cama-plus-server")
run("docker logs cama-plus-server 2>&1 | tail -8")
run("curl -s -o /dev/null -w 'health=%{http_code}\\n' -X POST http://127.0.0.1:8080/api/public/patient/recover/login-id -H 'Content-Type: application/json' -d '{}'")
run("curl -s -o /dev/null -w 'apk=%{http_code}\\n' http://127.0.0.1:8080/apk_down/cama-plus-cafe24-2026-06-17.apk")
run("""DT=$(curl -s -X POST http://127.0.0.1:8080/api/auth/doctor -H 'Content-Type: application/json' -d '{"principal":"cama","credentials":"admincama!"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['response']['apiToken'])")
curl -s -X POST http://127.0.0.1:8080/api/doctor/apk/list -H 'Content-Type: application/json' -H "api_key: Bearer $DT" -d '{}'""")
'''

    _, stdout, stderr = client.exec_command(f"python3 - <<'PY'\n{remote_py}\nPY", timeout=180)
    code = stdout.channel.recv_exit_status()
    print(stdout.read().decode())
    err = stderr.read().decode().strip()
    if err:
        print("STDERR:", err)
    if code != 0:
        raise SystemExit(code)
    client.close()


if __name__ == "__main__":
    main()
