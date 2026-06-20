#!/usr/bin/env python3
"""Deploy notification message management: server + super-admin + FCM live test."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent


def run(script: str) -> None:
    path = SCRIPT_DIR / script
    print(f"\n>>> {script}")
    r = subprocess.run([sys.executable, str(path)], cwd=REPO_ROOT)
    if r.returncode != 0:
        raise SystemExit(r.returncode)


def main() -> None:
    run("vps-rebuild-server-jar.py")
    run("vps-deploy-super-admin.py")
    run("vps-restore-server-fcm.py")
    run("vps-enable-fcm-live-test.py")
    print("\nNotification message management deployed.")


if __name__ == "__main__":
    main()
