#!/usr/bin/env python3
"""Update /opt/cama/deploy/.env.cafe24 mail settings (run on VPS only)."""
import os
import re
import sys
from pathlib import Path

ENV_PATH = Path("/opt/cama/deploy/.env.cafe24")

MAIL_KEYS = {
    "CAMA_MAIL_ENABLED": "true",
    "CAMA_MAIL_FROM": "noreply@camaplus.com",
    "SPRING_MAIL_HOST": "smtp-relay.brevo.com",
    "SPRING_MAIL_PORT": "587",
}


def main():
    smtp_pass = os.environ.get("SMTP_PASS")
    smtp_user = os.environ.get("SMTP_USER", "").strip()
    if not smtp_pass:
        print("SMTP_PASS env required", file=sys.stderr)
        sys.exit(1)
    if not smtp_user:
        print("WARN: SMTP_USER empty — set SPRING_MAIL_USERNAME to Brevo login email", file=sys.stderr)

    MAIL_KEYS["SPRING_MAIL_PASSWORD"] = smtp_pass
    MAIL_KEYS["SPRING_MAIL_USERNAME"] = smtp_user

    if not ENV_PATH.exists():
        print(f"missing {ENV_PATH}", file=sys.stderr)
        sys.exit(1)

    lines = ENV_PATH.read_text(encoding="utf-8").splitlines()
    out = []
    seen = set()

    for line in lines:
        matched = False
        for key, val in MAIL_KEYS.items():
            if re.match(rf"^{re.escape(key)}=", line):
                out.append(f"{key}={val}")
                seen.add(key)
                matched = True
                break
        if not matched:
            out.append(line)

    for key, val in MAIL_KEYS.items():
        if key not in seen:
            out.append(f"{key}={val}")

    ENV_PATH.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("updated", ENV_PATH)
    for key in MAIL_KEYS:
        if key == "SPRING_MAIL_PASSWORD":
            print(f"{key}=***")
        else:
            print(f"{key}={MAIL_KEYS[key]}")


if __name__ == "__main__":
    main()
