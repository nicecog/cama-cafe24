#!/usr/bin/env python3
"""Quick smoke test for vital + tablet QR APIs (authenticated)."""
from __future__ import annotations

import importlib.util
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "e2e", ROOT / "deploy/scripts/cafe24-app-api-e2e.py"
)
e2e = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(e2e)


def main() -> int:
    login_id = e2e.resolve_login_id()
    token = None
    if e2e.AUTO_RESET:
        pw = e2e.reset_temp_password(login_id)
        if pw:
            token, _ = e2e.login(login_id, pw)

    if not token:
        print("AUTH FAIL")
        return 1

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    tests = [
        ("POST", "/api/tablet/qr/issue", None, "tablet qr issue"),
        (
            "PUT",
            "/api/track/service/vital",
            {
                "measuredAt": now,
                "vitalTypeCd": "HEART_RATE",
                "valueNum": 72.0,
                "unit": "bpm",
                "sourceCd": "PHONE",
            },
            "vital put",
        ),
        (
            "POST",
            "/api/track/service/vitalList",
            {
                "vitalTypeCd": "HEART_RATE",
                "fromDate": "2026-01-01",
                "toDate": "2026-12-31",
            },
            "vital list",
        ),
    ]
    fail = 0
    for method, path, body, name in tests:
        st, data = e2e.request(method, path, body=body, token=token)
        ok = isinstance(data, dict) and data.get("success") is True
        mark = "OK" if ok else "FAIL"
        print(f"{mark} [{st}] {name}: {path}")
        if not ok:
            fail += 1
            print(" ", str(data)[:400])
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
