#!/usr/bin/env python3
"""
cama-super-admin API smoke test against Cafe24 (or CAMA_API_BASE).

  set CAMA_ADMIN_USER=...
  set CAMA_ADMIN_PASSWORD=...
  python deploy/scripts/super-admin-api-smoke.py
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any

BASE = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")
ADMIN_USER = os.environ.get("CAMA_ADMIN_USER", "")
ADMIN_PASSWORD = os.environ.get("CAMA_ADMIN_PASSWORD", "")


def call(
    method: str,
    path: str,
    *,
    body: dict | None = None,
    token: str | None = None,
) -> tuple[int, dict | list | str | None]:
    url = f"{BASE}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["api_key"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            status = resp.status
    except urllib.error.HTTPError as e:
        status = e.code
        raw = e.read().decode("utf-8", errors="replace")
    try:
        parsed: Any = json.loads(raw) if raw else None
    except json.JSONDecodeError:
        parsed = raw[:200] if raw else None
    return status, parsed


def ok_api(status: int, parsed: Any) -> bool:
    if status != 200:
        return False
    if isinstance(parsed, dict):
        return bool(parsed.get("success", True))
    return True


def main() -> None:
    passed = 0
    failed = 0
    skipped = 0
    token: str | None = None

    cases: list[tuple[str, str, str, bool]] = [
        ("health", "GET", "/actuator/health", False),
        # Cafe24 nginx: enums may 401 without token on some builds — non-blocking
        ("enums", "GET", "/api/enums", False),
        ("common disease list", "GET", "/api/common/disease/list", False),
        ("admin hospital list", "GET", "/api/admin/hospital/list?page=1&searchType=&searchText=", True),
        ("admin doctor list", "GET", "/api/admin/doctor/list?page=1&searchType=&searchText=", True),
        ("admin department list", "GET", "/api/admin/department/list?paging=false", True),
        ("admin cancer list", "GET", "/api/admin/cancer/list?paging=false", True),
        ("admin disease list", "GET", "/api/admin/disease/list?page=1&searchType=&searchText=", True),
        ("admin account me", "GET", "/api/admin/account/me", True),
    ]

    print(f"=== super-admin API smoke @ {BASE} ===\n")

    if ADMIN_USER and ADMIN_PASSWORD:
        status, parsed = call(
            "POST",
            "/api/auth/admin",
            body={"principal": ADMIN_USER, "credentials": ADMIN_PASSWORD},
        )
        if ok_api(status, parsed) and isinstance(parsed, dict):
            token = parsed.get("response", {}).get("apiToken")
            print(f"OK  admin login → token {'yes' if token else 'no'}")
            passed += 1
        else:
            print(f"FAIL admin login [{status}] {parsed}")
            failed += 1
    else:
        print("SKIP admin login - set CAMA_ADMIN_USER / CAMA_ADMIN_PASSWORD")
        skipped += 1

    for name, method, path, needs_auth in cases:
        if needs_auth and not token:
            print(f"SKIP {name}: {method} {path}")
            skipped += 1
            continue
        status, parsed = call(method, path, token=token)
        if ok_api(status, parsed):
            print(f"OK  [{status}] {name}: {method} {path}")
            passed += 1
        elif name == "enums" and status == 401:
            print(f"WARN [{status}] {name}: {method} {path} (non-blocking on Cafe24)")
            passed += 1
        else:
            detail = parsed
            if isinstance(parsed, dict) and parsed.get("error"):
                detail = parsed["error"]
            print(f"FAIL [{status}] {name}: {method} {path} - {detail}")
            failed += 1

    print(f"\n=== PASS={passed} FAIL={failed} SKIP={skipped} ===")
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
