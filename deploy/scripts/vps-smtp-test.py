#!/usr/bin/env python3
"""Test Brevo SMTP from VPS using container env vars (no secrets printed)."""
import re
import time
from pathlib import Path

import paramiko

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
text = ACCESS.read_text(encoding="utf-8")
host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)

REMOTE_SCRIPT = "/tmp/cama-smtp-test.py"
LOCAL_SCRIPT = Path(__file__).resolve().parent / "_smtp_test_remote.py"
LOCAL_SCRIPT.write_text(
    """import os, smtplib, ssl, sys
from email.mime.text import MIMEText

host = os.environ.get("SPRING_MAIL_HOST", "")
port = int(os.environ.get("SPRING_MAIL_PORT", "587"))
user = os.environ.get("SPRING_MAIL_USERNAME", "")
password = os.environ.get("SPRING_MAIL_PASSWORD", "")
to = os.environ.get("TEST_TO", user)
from_addr = os.environ.get("CAMA_MAIL_FROM", "noreply@camaplus.com")

msg = MIMEText("CAMA VPS SMTP smoke test", "plain", "utf-8")
msg["Subject"] = "[CAMA] SMTP test"
msg["From"] = from_addr
msg["To"] = to

try:
    with smtplib.SMTP(host, port, timeout=20) as s:
        s.ehlo()
        s.starttls(context=ssl.create_default_context())
        s.ehlo()
        s.login(user, password)
        s.sendmail(from_addr, [to], msg.as_string())
    print("SMTP_OK sent to", to)
except Exception as e:
    print("SMTP_FAIL", type(e).__name__, str(e)[:300])
    sys.exit(1)
""",
    encoding="utf-8",
)

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)

sftp = c.open_sftp()
sftp.put(str(LOCAL_SCRIPT), REMOTE_SCRIPT)
sftp.close()

cmd = (
    "eval $(docker exec cama-plus-server env | grep -E '^(SPRING_MAIL_|CAMA_MAIL_)' | sed 's/^/export /'); "
    f"export TEST_TO=happycog@gmail.com; python3 {REMOTE_SCRIPT}"
)
_, o, e = c.exec_command(cmd, timeout=60)
time.sleep(5)
out = o.read().decode(errors="replace")
err = e.read().decode(errors="replace")
print(out or err)
c.close()
LOCAL_SCRIPT.unlink(missing_ok=True)
