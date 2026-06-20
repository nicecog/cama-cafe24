#!/usr/bin/env python3
"""Upload APK to Cafe24 VPS via doctor API (admin APK management list)."""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

import requests

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
ACCESS_LOCAL = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"

DEFAULT_APK = REPO_ROOT / "dist" / "cama-plus-cafe24-2026-06-03.apk"
DEFAULT_VERSION = os.environ.get("CAMA_APK_VERSION", "1.2.8")
BASE_URL = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com")


def load_doctor_credentials() -> tuple[str, str]:
    principal = os.environ.get("CAMA_DOCTOR_PRINCIPAL", "cama")
    credentials = os.environ.get("CAMA_DOCTOR_CREDENTIALS", "cama!")
    if ACCESS_LOCAL.is_file():
        text = ACCESS_LOCAL.read_text(encoding="utf-8")
        if m := re.search(r"doctor.*?`([^`]+)`", text, re.I):
            principal = m.group(1)
    return principal, credentials


def doctor_token(session: requests.Session, base: str) -> str:
    principal, credentials = load_doctor_credentials()
    for creds in [
        (principal, credentials),
        ("cama", "cama!"),
        ("happycog", "admincama!"),
    ]:
        r = session.post(
            f"{base}/api/auth/doctor",
            json={"principal": creds[0], "credentials": creds[1]},
            timeout=60,
        )
        r.raise_for_status()
        body = r.json()
        token = (body.get("response") or {}).get("apiToken")
        if token:
            print(f"Doctor auth OK: {creds[0]}")
            return token
    raise RuntimeError("Doctor login failed for all credential sets")


def main() -> None:
    apk_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_APK
    version = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_VERSION
    if not apk_path.is_file():
        raise SystemExit(f"APK not found: {apk_path}")

    base = BASE_URL.rstrip("/")
    session = requests.Session()
    token = doctor_token(session, base)
    headers = {"api_key": f"Bearer {token}"}

    with apk_path.open("rb") as f:
        r = session.post(
            f"{base}/api/doctor/apk/upload",
            headers=headers,
            files={
                "file": (
                    apk_path.name,
                    f,
                    "application/vnd.android.package-archive",
                )
            },
            data={"version": version},
            timeout=300,
        )
    print(f"Upload HTTP {r.status_code}")
    print(r.text[:500])
    r.raise_for_status()

    listed = session.post(
        f"{base}/api/doctor/apk/list",
        headers=headers,
        json={},
        timeout=60,
    )
    listed.raise_for_status()
    releases = listed.json().get("response") or []
    print(f"\nAPK list ({len(releases)} items):")
    for item in releases[:5]:
        print(
            f"  - v{item.get('version')} {item.get('fileName')} "
            f"({item.get('uploadedAt')}) {item.get('downloadUrl')}"
        )
    print(f"\nAdmin: {base}/admin/main/contentMng/apkMng")


if __name__ == "__main__":
    main()
