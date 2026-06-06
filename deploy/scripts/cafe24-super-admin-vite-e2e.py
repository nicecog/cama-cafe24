#!/usr/bin/env python3
"""E2E: New Vite Super Admin (/admin/) — page load, login, doctor APIs."""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
DOCTOR_LOGIN = {"principal": "cama", "credentials": "admincama!"}

ADMIN_PAGES = [
    "/admin/",
    "/admin/login",
    "/admin/main/patientMng/patientMonitoring",
    "/admin/main/patientMng/coachingMonitoring",
    "/admin/main/contentMng/treatmentInfo",
    "/admin/main/contentMng/videoMng",
    "/admin/main/contentMng/wellbeing",
    "/admin/main/monitoring/monthly",
    "/admin/main/monitoring/userSearch",
    "/admin/main/monitoring/coachingProgress",
    "/admin/main/contentMng/statistics",
]

API_CASES = [
    ("GET", "/api/doctor/me"),
    ("GET", "/api/doctor/count/info"),
    ("GET", "/api/monitoring/patient?page=1&searchType=name&searchText="),
    ("GET", "/api/doctor/contents?page=1&searchType=&searchText="),
    ("GET", "/api/doctor/disable/contents?page=1&searchType=&searchText="),
    ("GET", "/api/doctor/service"),
    ("GET", "/api/common/disease/list"),
]


def page_get(path: str) -> tuple[int, str]:
    url = BASE + path
    req = urllib.request.Request(url, headers={"User-Agent": "cama-super-admin-e2e/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            return resp.status, body[:200]
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:200].decode("utf-8", errors="replace")


def api_request(method: str, path: str, token: str) -> tuple[int, str]:
    url = BASE + path
    bearer = f"Bearer {token}"
    headers = {
        "Accept": "application/json",
        "User-Agent": "cama-super-admin-e2e/1.0",
        "api_key": bearer,
        "Authorization": bearer,
    }
    req = urllib.request.Request(url, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return resp.status, resp.read()[:120].decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:120].decode("utf-8", errors="replace")


def login() -> str:
    url = BASE + "/api/auth/doctor"
    data = json.dumps(DOCTOR_LOGIN).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": "cama-super-admin-e2e/1.0"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        raw = resp.read().decode()
    j = json.loads(raw)
    tok = j["response"]["apiToken"]
    doctor = j["response"].get("doctor")
    if not tok or not doctor:
        raise RuntimeError("doctor login response missing apiToken/doctor")
    return tok


def main() -> int:
    print(f"Target: {BASE}\n")
    failed = 0
    passed = 0

    print("=== Pages (expect 200 + SPA shell) ===")
    for path in ADMIN_PAGES:
        code, snippet = page_get(path)
        ok = code == 200 and ("CAMA" in snippet or "root" in snippet or "DOCTYPE" in snippet)
        mark = "OK" if ok else "FAIL"
        print(f"  [{mark}] HTTP {code:>3}  {path}")
        if not ok:
            print(f"         {snippet[:100]}")
            failed += 1
        else:
            passed += 1

    print("\n=== Assets ===")
    _, html = page_get("/admin/")
    import re

    m = re.search(r'src="(/admin/assets/[^"]+\.js)"', html)
    if m:
        asset_path = m.group(1)
        code, _ = page_get(asset_path)
        ok = code == 200
        mark = "OK" if ok else "FAIL"
        print(f"  [{mark}] HTTP {code:>3}  {asset_path}")
        if ok:
            passed += 1
        else:
            failed += 1
    else:
        print("  [FAIL] could not find main JS asset in index.html")
        failed += 1

    print("\n=== Doctor login + APIs (Super Admin uses doctor auth) ===")
    try:
        token = login()
        print("  [OK] POST /api/auth/doctor")
        passed += 1
    except Exception as e:
        print(f"  [FAIL] login: {e}")
        failed += 1
        return 1

    for method, path in API_CASES:
        code, detail = api_request(method, path, token)
        ok = code == 200 and '"success":true' in detail
        mark = "OK" if ok else "FAIL"
        print(f"  [{mark}] HTTP {code:>3}  {method} {path}")
        if not ok:
            print(f"         {detail}")
            failed += 1
        else:
            passed += 1

    print(f"\nRESULT: {passed} passed, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
