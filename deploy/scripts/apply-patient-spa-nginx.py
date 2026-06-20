#!/usr/bin/env python3
"""Deprecated: partial nginx patch removed super-admin /admin/ block. Use vps-deploy-nginx-full.py."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent


def main() -> None:
    print(
        "apply-patient-spa-nginx.py is deprecated — running vps-deploy-nginx-full.py "
        "to avoid overwriting /admin/ proxy.",
        file=sys.stderr,
    )
    r = subprocess.run(
        [sys.executable, str(SCRIPT_DIR / "vps-deploy-nginx-full.py")],
        cwd=REPO_ROOT,
    )
    raise SystemExit(r.returncode)


if __name__ == "__main__":
    main()
