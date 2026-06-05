#!/usr/bin/env python3
"""Probe Brevo SMTP with env from VPS (no full secrets printed)."""
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

REMOTE = "/tmp/cama-smtp-probe.py"
LOCAL = Path(__file__).resolve().parent / "_smtp_probe_remote.py"
LOCAL.write_text(
    """import os, smtplib, ssl, sys

host = os.environ.get("SPRING_MAIL_HOST", "smtp-relay.brevo.com")
password = os.environ.get("SPRING_MAIL_PASSWORD", "")
users = os.environ.get("SMTP_USERS", "").split(",")
port = int(os.environ.get("SPRING_MAIL_PORT", "587"))
mode = os.environ.get("SMTP_MODE", "starttls")

print("key_suffix", password[-8:] if len(password) >= 8 else "(short)")

for user in users:
    user = user.strip()
    if not user:
        continue
    try:
        if mode == "ssl":
            ctx = ssl.create_default_context()
            with smtplib.SMTP_SSL(host, 465, timeout=20, context=ctx) as s:
                s.login(user, password)
        else:
            with smtplib.SMTP(host, port, timeout=20) as s:
                s.ehlo()
                s.starttls(context=ssl.create_default_context())
                s.ehlo()
                s.login(user, password)
        print("OK", mode, user)
        sys.exit(0)
    except Exception as e:
        print("FAIL", mode, user, type(e).__name__, str(e)[:120])
print("ALL_FAILED")
sys.exit(1)
""",
    encoding="utf-8",
)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
sftp = c.open_sftp()
sftp.put(str(LOCAL), REMOTE)
sftp.close()

users = "happycog@gmail.com,HUDIT,rua@dmarc.brevo.com,noreply@camaplus.com"
for mode in ("starttls", "ssl"):
    cmd = (
        "eval $(docker exec cama-plus-server env | grep -E '^(SPRING_MAIL_|CAMA_MAIL_)' | sed 's/^/export /'); "
        f"export SMTP_USERS='{users}'; export SMTP_MODE='{mode}'; python3 {REMOTE}"
    )
    _, o, _ = c.exec_command(cmd, timeout=60)
    time.sleep(4)
    print(f"=== mode={mode} ===")
    print(o.read().decode(errors="replace"))

c.close()
LOCAL.unlink(missing_ok=True)
