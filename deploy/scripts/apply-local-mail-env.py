#!/usr/bin/env python3
"""Read local-cafe24.mail.env and apply mail settings to VPS."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
LOCAL_ENV = REPO / "local-cafe24.mail.env"
APPLY_SCRIPT = Path(__file__).resolve().parent / "vps-mail-apply-and-test.py"


def load_local_env() -> dict[str, str]:
    if not LOCAL_ENV.is_file():
        print(f"missing {LOCAL_ENV}", file=sys.stderr)
        raise SystemExit(1)
    out: dict[str, str] = {}
    for line in LOCAL_ENV.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        out[k.strip()] = v.strip()
    return out


def main() -> None:
    env = load_local_env()
    provider = env.get("CAMA_MAIL_PROVIDER", "smtp").strip() or "smtp"
    test_email = env.get("BREVO_ACCOUNT_EMAIL", "happycog@gmail.com").strip()

    os.environ["CAMA_MAIL_PROVIDER"] = provider
    os.environ["TEST_EMAIL"] = test_email
    if env.get("CAMA_MAIL_SENDER_NAME"):
        os.environ["CAMA_MAIL_SENDER_NAME"] = env["CAMA_MAIL_SENDER_NAME"]

    if provider == "brevo-api":
        api_key = env.get("BREVO_API_KEY", "").strip()
        if not api_key:
            print("BREVO_API_KEY missing in local-cafe24.mail.env", file=sys.stderr)
            raise SystemExit(1)
        os.environ["BREVO_API_KEY"] = api_key
        print(f"Applying Brevo API mail (key name: {env.get('BREVO_API_KEY_NAME', 'n/a')})")
    else:
        user = env.get("SPRING_MAIL_USERNAME", "").strip()
        password = env.get("SPRING_MAIL_PASSWORD", "").strip()
        if not user or not password:
            print("SPRING_MAIL_USERNAME / SPRING_MAIL_PASSWORD required for smtp provider", file=sys.stderr)
            raise SystemExit(1)
        os.environ["SMTP_USER"] = user
        os.environ["SMTP_PASS"] = password
        print(f"Applying Brevo SMTP mail (login suffix: ...{user[-20:]})")

    r = subprocess.run([sys.executable, str(APPLY_SCRIPT)], cwd=REPO)
    raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
