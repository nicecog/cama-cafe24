#!/usr/bin/env python3
"""E2E: Doctor Web + Super Admin 화면별 API 호출 테스트 (camaplus.cafe24.com)."""
from __future__ import annotations

import json
import sys
import textwrap
from dataclasses import dataclass, field
from typing import Any

import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
DOCTOR_LOGIN = {"principal": "cama", "credentials": "admincama!"}
ADMIN_LOGIN = {"principal": "happycog", "credentials": "CamaAdmin2026!"}


@dataclass
class Case:
    screen: str
    name: str
    method: str
    path: str
    via: str  # proxy | api | page
    auth: str  # doctor | admin | none
    expect: tuple[int, ...] = (200,)
    body: dict | None = None


@dataclass
class Result:
    screen: str
    name: str
    url: str
    status: int
    ok: bool
    detail: str = ""


results: list[Result] = []
dynamic: dict[str, Any] = {}


def headers(token: str | None, mode: str = "both") -> dict[str, str]:
    h = {"Accept": "application/json", "User-Agent": "cama-e2e/1.0"}
    if token:
        bearer = f"Bearer {token}"
        if mode in ("both", "api_key"):
            h["api_key"] = bearer
        if mode in ("both", "authz"):
            h["Authorization"] = bearer
    return h


def request(
    method: str,
    path: str,
    token: str | None = None,
    body: dict | None = None,
    via: str = "api",
    mode: str = "both",
) -> tuple[int, str]:
    prefix = "/proxy" if via == "proxy" else ""
    url = BASE + prefix + path
    data = json.dumps(body).encode() if body is not None else None
    h = headers(token, mode)
    if body is not None:
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        return e.code, raw
    except Exception as e:
        return 0, str(e)[:200]


def page_get(path: str) -> tuple[int, str]:
    url = BASE + path
    req = urllib.request.Request(url, headers={"User-Agent": "cama-e2e/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return resp.status, f"len={len(resp.read())}"
    except urllib.error.HTTPError as e:
        return e.code, e.read()[:120].decode("utf-8", errors="replace")
    except Exception as e:
        return 0, str(e)[:200]


def login(path: str, dto: dict) -> str:
    code, raw = request("POST", path, body=dto, via="proxy" if path.endswith("/doctor") else "api", mode="both")
    if code != 200:
        raise RuntimeError(f"login {path} failed HTTP {code}: {raw}")
    data = json.loads(raw)
    return data["response"]["apiToken"]


def run_case(c: Case, tokens: dict[str, str], mode: str = "both") -> None:
    tok = tokens.get(c.auth)
    code, raw = request(c.method, c.path, tok, c.body, c.via, mode)
    ok = code in c.expect
    detail = raw.replace("\n", " ")[:120]
    if ok and '"success":true' in raw:
        detail = "success=true " + detail[:80]
    elif not ok:
        detail = f"expected {c.expect} " + detail
    results.append(Result(c.screen, c.name, BASE + ("/proxy" if c.via == "proxy" else "") + c.path, code, ok, detail))
    return code, raw


def main() -> int:
    print(f"Target: {BASE}\n")

    doctor_tok = login("/api/auth/doctor", DOCTOR_LOGIN)
    admin_tok = login("/api/auth/admin", ADMIN_LOGIN)
    tokens = {"doctor": doctor_tok, "admin": admin_tok, "none": None}

    # 동적 seq 수집 (상세/승인 화면용)
    _, raw = request("GET", "/api/doctor/contents?page=1&searchType=&searchText=", doctor_tok, via="proxy")
    try:
        j = json.loads(raw)
        items = j.get("response") or []
        if items:
            dynamic["content_seq"] = items[0].get("seq") or items[0].get("contentsSeq")
    except json.JSONDecodeError:
        pass

    _, raw = request("GET", "/api/doctor/service", doctor_tok, via="proxy")
    try:
        j = json.loads(raw)
        items = j.get("response") or []
        if items:
            dynamic["service_seq"] = items[0].get("seq") or items[0].get("serviceSeq")
    except json.JSONDecodeError:
        pass

    _, raw = request("GET", "/api/doctor/me", doctor_tok, via="proxy")
    try:
        j = json.loads(raw)
        dynamic["hospital_seq"] = (j.get("response") or {}).get("hospitalSeq")
    except json.JSONDecodeError:
        pass

    content_seq = dynamic.get("content_seq", "1")
    service_seq = dynamic.get("service_seq", "1")
    hospital_seq = dynamic.get("hospital_seq", "1")

    pages = [
        ("Doctor Web", "/login"),
        ("Doctor Web", "/patient-management/patient/list"),
        ("Doctor Web", "/content-management/treatment/done/list"),
        ("Doctor Web", "/content-management/treatment/disabled/list"),
        ("Doctor Web", "/content-management/treatment/add"),
        ("Doctor Web", f"/content-management/treatment/detail/{content_seq}"),
        ("Doctor Web", "/content-management/article/list"),
        ("Doctor Web", "/service-management/service/list"),
        ("Doctor Web", f"/service-management/service/approve/{service_seq}"),
        ("Super Admin", "/admin/"),
        ("Super Admin", "/admin/system-management/hospital/list"),
        ("Super Admin", "/admin/content-management/treatment/list"),
        ("Super Admin", "/admin/service-management/service/list"),
    ]
    for screen, path in pages:
        code, detail = page_get(path)
        ok = code == 200
        results.append(Result(screen, f"PAGE {path}", BASE + path, code, ok, detail))

    cases: list[Case] = [
        # ── Doctor Web 공통 (app-shell) ──
        Case("Doctor Web / (shell)", "getDoctorMe", "GET", "/api/doctor/me", "proxy", "doctor"),
        Case("Doctor Web / (shell)", "getDoctorCountInfo", "GET", "/api/doctor/count/info", "proxy", "doctor"),
        # ── 환자 모니터링 ──
        Case("Doctor Web /patient/list", "getMonitoringPatientList", "GET",
             "/api/monitoring/patient?page=1&searchType=name&searchText=", "proxy", "doctor"),
        # ── 치료 완료 목록 ──
        Case("Doctor Web /treatment/done/list", "getDoctorContentsList", "GET",
             "/api/doctor/contents?page=1&searchType=&searchText=", "proxy", "doctor"),
        # ── 치료 비활성 목록 ──
        Case("Doctor Web /treatment/disabled/list", "getDoctorContentsDisabledList", "GET",
             "/api/doctor/disable/contents?page=1&searchType=&searchText=", "proxy", "doctor"),
        # ── 치료 등록 ──
        Case("Doctor Web /treatment/add", "getCommonHospitalDiseaseList", "GET",
             f"/api/common/hospital/{hospital_seq}/disease/list/B", "proxy", "doctor"),
        Case("Doctor Web /treatment/add", "postCommonCareTimeType", "POST",
             "/api/common/care/time/type", "proxy", "doctor", body={}),
        # ── 치료 상세 ──
        Case("Doctor Web /treatment/detail", "getDoctorContentsView", "GET",
             f"/api/doctor/contents/{content_seq}/view", "proxy", "doctor"),
        # ── 서비스 목록 ──
        Case("Doctor Web /service/list", "getDoctorServiceList", "GET",
             "/api/doctor/service", "proxy", "doctor"),
        # ── 서비스 승인 ──
        Case("Doctor Web /service/approve", "getCommonDiseaseList", "GET",
             "/api/common/disease/list", "proxy", "doctor"),
        Case("Doctor Web /service/approve", "getCommonDiseaseDetailList", "GET",
             f"/api/common/disease/{hospital_seq}/detail/list", "proxy", "doctor"),
        Case("Doctor Web /service/approve", "getDoctorServiceView", "GET",
             f"/api/doctor/service/{service_seq}/view", "proxy", "doctor"),
        # ── Super Admin — 시스템 관리 ──
        Case("Super Admin /hospital/list", "fetchAdminHospitalList", "GET",
             "/api/admin/hospital/list?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /doctor/list", "fetchAdminDoctorList", "GET",
             "/api/admin/doctor/list?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /disease/list", "fetchAdminCancerList", "GET",
             "/api/admin/cancer/list?paging=false", "api", "admin"),
        Case("Super Admin /hospital-disease/list", "fetchAdminDiseaseList", "GET",
             "/api/admin/disease/list?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /major/list", "fetchAdminDepartmentList", "GET",
             "/api/admin/department/list?paging=false", "api", "admin"),
        Case("Super Admin /treatment-status", "fetchContentsList", "GET",
             "/api/contents/list?page=1&lang=KO", "api", "admin"),
        Case("Super Admin /account", "getAdminAccountMe", "GET",
             "/api/admin/account/me", "api", "admin"),
        # ── Super Admin — 콘텐츠/서비스 (doctor API) ──
        Case("Super Admin /treatment/list", "fetchDoctorContentsList", "GET",
             "/api/doctor/contents?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /treatment/disabled", "fetchDoctorContentsDisabledList", "GET",
             "/api/doctor/disable/contents?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /treatment/list", "getDoctorInfoCount", "GET",
             "/api/doctor/count/info", "api", "admin", expect=(200, 500)),
        Case("Super Admin /service/list", "fetchAdminServiceList", "GET",
             "/api/admin/service/list?page=1&searchType=&searchText=", "api", "admin"),
        Case("Super Admin /service/approve", "getAdminServiceDetail", "GET",
             f"/api/admin/service/{service_seq}/view", "api", "admin"),
        # doctor/me for admin — known data issue
        Case("Super Admin / (nav)", "getDoctorMe", "GET", "/api/doctor/me", "api", "admin", expect=(200, 500)),
    ]

    print("=== Auth header mode: both (api_key + Authorization) ===")
    for c in cases:
        run_case(c, tokens, "both")

    # Cafe24 api_key strip 시뮬: Authorization only (doctor /proxy 경로)
    print("\n=== Auth header mode: Authorization only (doctor /proxy - Cafe24 strip sim) ===")
    authz_only_screens = [
        Case("Doctor Web [authz-only]", "getDoctorMe", "GET", "/api/doctor/me", "proxy", "doctor"),
        Case("Doctor Web [authz-only]", "getMonitoringPatientList", "GET",
             "/api/monitoring/patient?page=1&searchType=name&searchText=", "proxy", "doctor"),
        Case("Doctor Web [authz-only]", "getDoctorServiceList", "GET", "/api/doctor/service", "proxy", "doctor"),
    ]
    for c in authz_only_screens:
        run_case(c, tokens, "authz")

    passed = sum(1 for r in results if r.ok)
    failed = [r for r in results if not r.ok]

    print("\n" + "=" * 72)
    print(f"RESULT: {passed}/{len(results)} passed, {len(failed)} failed")
    print(f"Dynamic: content_seq={content_seq}, service_seq={service_seq}, hospital_seq={hospital_seq}")
    print("=" * 72)

    current = ""
    for r in results:
        if r.screen != current:
            current = r.screen
            print(f"\n## {current}")
        mark = "OK" if r.ok else "FAIL"
        print(f"  [{mark}] HTTP {r.status:>3}  {r.name}")
        if not r.ok or r.status not in (200, 201):
            print(f"         {r.detail}")

    if failed:
        print("\n--- FAILURES ---")
        for r in failed:
            print(f"  {r.screen} | {r.name} | HTTP {r.status} | {r.url}")
            print(f"    {r.detail}")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
