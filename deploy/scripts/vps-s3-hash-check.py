#!/usr/bin/env python3
"""Check if legacy cama-files S3 hash objects exist on VPS."""
from __future__ import annotations

import base64
import re
from pathlib import Path

ACCESS = Path(__file__).resolve().parent.parent / "CAFE24_VPS_ACCESS.local.md"
HASH = "41375831f176357d66334a026f6ab5249def079af1a452cb6a3a5aa2db8309f0915f05f73e4003f045a1c32d1b6078e3"


def main() -> None:
    import paramiko

    text = ACCESS.read_text(encoding="utf-8")
    host = re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text).group(1)
    pw = re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text).group(1)
    cmd = f"""
ls -la /opt/cama/data/cama-files/{HASH} 2>&1 || true
find /opt/cama/data/cama-files -name '{HASH}*' 2>/dev/null | head -3
aws s3 ls s3://cama-files/{HASH} 2>&1 | head -1 || echo 'no aws cli or bucket'
"""
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(host, username="root", password=pw, timeout=30, allow_agent=False, look_for_keys=False)
    _, o, _ = c.exec_command(cmd, timeout=60)
    print(o.read().decode())
    c.close()


if __name__ == "__main__":
    main()
