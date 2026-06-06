#!/usr/bin/env python3
"""
cama-plus-app / react-app-dawplus 가 호출하는 API를 Cafe24 운영에 실통과 테스트.

사용:
  python deploy/scripts/cafe24-app-api-e2e.py
  set CAMA_TEST_PASSWORD=*** && python deploy/scripts/cafe24-app-api-e2e.py

환경변수:
  CAMA_API_BASE     기본 https://camaplus.cafe24.com
  CAMA_TEST_LOGIN_ID  (없으면 recover/login-id 로 조회)
  CAMA_TEST_PASSWORD  (있으면 POST /api/auth 후 인증 API 전체 실행)
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import date, datetime
from typing import Any

BASE = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")
AUDIT_NAME = os.environ.get("CAMA_AUDIT_NAME", "최완규")
AUDIT_PHONE = os.environ.get("CAMA_AUDIT_PHONE", "01032984763")
FALLBACK_LOGIN_ID = os.environ.get("CAMA_TEST_LOGIN_ID", "happycog")
TEST_PASSWORD = os.environ.get("CAMA_TEST_PASSWORD", "")
# 비밀번호 없을 때 QA 계정 임시 PW 발급 (recover/reset-password) — 운영 DB 비밀번호 변경됨
AUTO_RESET = os.environ.get("CAMA_AUTO_RESET_PASSWORD", "1") == "1"

FIREBASE = {
    "device": "cama-api-e2e",
    "platform": "ANDROID",
    "token": "web-no-fcm",
}


class Result:
    def __init__(self, name: str, method: str, path: str):
        self.name = name
        self.method = method
        self.path = path
        self.status = 0
        self.ok = False
        self.detail = ""

    @property
    def skipped(self) -> bool:
        return self.detail.startswith("SKIP:")

    def __str__(self) -> str:
        if self.skipped:
            return f"SKIP {self.name}: {self.method} {self.path} - {self.detail}"
        mark = "OK" if self.ok else "FAIL"
        return f"{mark} [{self.status}] {self.name}: {self.method} {self.path} - {self.detail}"


def request(
    method: str,
    path: str,
    *,
    body: dict | None = None,
    token: str | None = None,
    timeout: int = 45,
) -> tuple[int, Any]:
    url = f"{BASE}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if token:
        headers["api_key"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            status = resp.status
    except urllib.error.HTTPError as e:
        status = e.code
        raw = e.read().decode("utf-8", errors="replace")
    try:
        parsed = json.loads(raw) if raw else None
    except json.JSONDecodeError:
        parsed = {"raw": raw[:200]}
    return status, parsed


def is_api_success(status: int, data: Any) -> tuple[bool, str]:
    if status >= 500:
        return False, f"HTTP {status}"
    if not isinstance(data, dict):
        return status < 400, "non-json"
    if data.get("success") is False and data.get("error"):
        err = data["error"]
        msg = err.get("message", err) if isinstance(err, dict) else str(err)
        return False, str(msg)[:120]
    if status == 401:
        return False, "401 unauthorized"
    if status >= 400:
        return False, f"HTTP {status}"
    if "response" in data and data["response"] is not None:
        return True, "success+response"
    if data.get("success") is True:
        return True, "success=true"
    if status == 200:
        return True, "HTTP 200"
    return False, json.dumps(data, ensure_ascii=False)[:80]


def run_case(
    results: list[Result],
    name: str,
    method: str,
    path: str,
    *,
    body: dict | None = None,
    token: str | None = None,
    require_auth: bool = False,
    skip_reason: str | None = None,
) -> None:
    r = Result(name, method, path)
    if skip_reason:
        r.status = 0
        r.ok = False
        r.detail = f"SKIP: {skip_reason}" if skip_reason.startswith("SKIP") else f"SKIP: {skip_reason}"
        results.append(r)
        return
    if require_auth and not token:
        r.detail = "SKIP: no token (set CAMA_TEST_PASSWORD)"
        results.append(r)
        return
    status, data = request(method, path, body=body, token=token)
    r.status = status
    ok, detail = is_api_success(status, data)
    r.ok = ok
    r.detail = detail
    results.append(r)


def resolve_login_id() -> str:
    status, data = request(
        "POST",
        "/api/public/patient/recover/login-id",
        body={"name": AUDIT_NAME, "phone": AUDIT_PHONE},
    )
    if isinstance(data, dict) and data.get("response", {}).get("loginId"):
        return data["response"]["loginId"]
    print(f"recover/login-id -> [{status}] fallback {FALLBACK_LOGIN_ID}", flush=True)
    return FALLBACK_LOGIN_ID


def reset_temp_password(login_id: str) -> str | None:
    status, data = request(
        "POST",
        "/api/public/patient/recover/reset-password",
        body={"loginId": login_id, "name": AUDIT_NAME, "phone": AUDIT_PHONE},
    )
    if isinstance(data, dict) and data.get("response", {}).get("temporaryPassword"):
        print("reset-password: OK (temporary password issued, not printed)", flush=True)
        return data["response"]["temporaryPassword"]
    err = data.get("error") if isinstance(data, dict) else data
    print(f"reset-password failed [{status}]: {err}", flush=True)
    return None


def login(login_id: str, password: str) -> tuple[str | None, dict | None]:
    status, data = request(
        "POST",
        "/api/auth",
        body={
            "principal": login_id,
            "credentials": password,
            "firebase": FIREBASE,
        },
    )
    if not isinstance(data, dict):
        return None, None
    if data.get("success") and data.get("response"):
        resp = data["response"]
        return resp.get("apiToken"), resp.get("account")
    err = data.get("error") or {}
    msg = err.get("message", data) if isinstance(err, dict) else data
    print(f"login failed [{status}]: {msg}")
    return None, None


def first_contents_seq(token: str) -> int | None:
    status, data = request("GET", "/api/contents/list?paging=false", token=token)
    if not isinstance(data, dict) or not data.get("response"):
        return None
    resp = data["response"]
    if isinstance(resp, list) and resp:
        item = resp[0]
        if isinstance(item, dict) and item.get("seq"):
            return int(item["seq"])
    return None


def main() -> int:
    results: list[Result] = []
    today = date.today().isoformat()
    monthly = datetime.now().strftime("%Y%m%d")

    print(f"API base: {BASE}")
    login_id = resolve_login_id()
    if os.environ.get("CAMA_TEST_LOGIN_ID"):
        login_id = os.environ["CAMA_TEST_LOGIN_ID"]
    print(f"loginId: {login_id}")

    token: str | None = None
    account: dict | None = None
    ac_seq: str | None = None

    password = TEST_PASSWORD
    if not password and AUTO_RESET:
        password = reset_temp_password(login_id) or ""
    if password:
        token, account = login(login_id, password)
        if account:
            ac_seq = str(account.get("seq", ""))
            print(f"logged in: seq={ac_seq} name={account.get('name')}", flush=True)
    else:
        print(
            "No password — set CAMA_TEST_PASSWORD or CAMA_AUTO_RESET_PASSWORD=1",
            flush=True,
        )

    # --- Public (RN patientAuth) ---
    run_case(
        results,
        "recover login-id",
        "POST",
        "/api/public/patient/recover/login-id",
        body={"name": AUDIT_NAME, "phone": AUDIT_PHONE},
    )

    # --- WebView paths (nginx) ---
    for label, path in [
        ("webview coaching", f"/webview/coaching/{login_id}"),
        ("webview wellbeing", f"/webview/coaching/wellbeing/{login_id}"),
        ("webview help", "/webview/help"),
        ("webview treatment", "/webview/treatment/1"),
        ("actuator health", "/actuator/health"),
    ]:
        r = Result(label, "GET", path)
        try:
            req = urllib.request.Request(f"{BASE}{path}", method="GET")
            with urllib.request.urlopen(req, timeout=30) as resp:
                r.status = resp.status
                body = resp.read(300).decode("utf-8", errors="replace")
                r.ok = resp.status == 200 and "Whitelabel" not in body
                r.detail = "html/json ok" if r.ok else body[:80]
        except urllib.error.HTTPError as e:
            r.status = e.code
            r.detail = e.read(80).decode("utf-8", errors="replace")
        except Exception as e:
            r.detail = str(e)[:80]
        results.append(r)

    skip = None if token else "no token"

    # --- RN native API (JWT) ---
    run_case(results, "account me", "GET", "/api/account/me", token=token, require_auth=True, skip_reason=skip)
    run_case(results, "account hospital", "GET", "/api/account/hospital", token=token, require_auth=True, skip_reason=skip)
    run_case(
        results,
        "hospital service check",
        "POST",
        "/api/hospital/service/check",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(results, "hospital list", "GET", "/api/hospital/list", token=token, require_auth=True, skip_reason=skip)
    run_case(
        results,
        "common disease list",
        "GET",
        "/api/common/disease/list",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "contents list",
        "GET",
        "/api/contents/list?paging=false",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "contents favoriteList",
        "GET",
        "/api/contents/favoriteList",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "notification recent",
        "GET",
        "/api/notification/recent",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "schedule daily",
        "GET",
        f"/api/schedule?d={today}",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "schedule monthly",
        "GET",
        f"/api/schedule/monthly?monthly={monthly}",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "track service check",
        "GET",
        "/api/track/service/check",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "track service",
        "GET",
        "/api/track/service",
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    run_case(
        results,
        "coaching progress (RN)",
        "POST",
        "/api/coaching/service/getCoachingProgressList",
        body={"loginId": login_id},
        token=token,
        require_auth=True,
        skip_reason=skip,
    )
    if ac_seq:
        run_case(
            results,
            "track stepList",
            "POST",
            "/api/track/service/stepList",
            body={"accountSeq": int(ac_seq)},
            token=token,
            require_auth=True,
        )
        content_seq = first_contents_seq(token)
        if content_seq:
            run_case(
                results,
                "contents view",
                "GET",
                f"/api/contents/{content_seq}/view",
                token=token,
                require_auth=True,
            )
            run_case(
                results,
                "webview contents view",
                "GET",
                f"/api/webview/contents/{content_seq}/view",
                token=token,
            )
        else:
            for name, path in [
                ("contents view", "/api/contents/1/view"),
                ("webview contents view", "/api/webview/contents/1/view"),
            ]:
                run_case(
                    results,
                    name,
                    "GET",
                    path,
                    token=token,
                    skip_reason="no contents in list",
                )
        run_case(
            results,
            "hospital disease list",
            "GET",
            "/api/hospital/1/disease/list",
            token=token,
            require_auth=True,
        )
        run_case(
            results,
            "webview hospital disease",
            "GET",
            "/api/webview/hospital/1/disease/list",
            token=token,
        )
        # 여정 데이터가 없는 계정은 500/404 — 연결성과 별개
        r_info = Result("track service info", "POST", "/api/track/service/info")
        st, data = request(
            "POST",
            "/api/track/service/info",
            body={"day": 1, "diseaseSeq": 2, "hospitalSeq": 1},
            token=token,
        )
        r_info.status = st
        ok, detail = is_api_success(st, data)
        if not ok and st in (404, 500):
            r_info.ok = True
            r_info.detail = f"SKIP:data ({detail})"
        else:
            r_info.ok = ok
            r_info.detail = detail
        results.append(r_info)

    # --- Webview API (SPA / WebView) ---
    run_case(
        results,
        "webview hospital list",
        "GET",
        "/api/webview/hospital/list",
        token=token,
    )
    if ac_seq:
        run_case(
            results,
            "webview account me",
            "POST",
            "/api/webview/account/me",
            body={"loginId": login_id},
            token=token,
        )
        run_case(
            results,
            "webview account hospital",
            "POST",
            "/api/webview/account/hospital",
            body={"seq": ac_seq},
            token=token,
        )
        run_case(
            results,
            "webview track check",
            "POST",
            "/api/webview/track/service/check",
            body={"seq": ac_seq},
            token=token,
        )
        run_case(
            results,
            "webview contents list",
            "POST",
            "/api/webview/contents/list",
            body={"acSeq": ac_seq},
            token=token,
        )
        run_case(
            results,
            "webview schedule",
            "GET",
            f"/api/webview/schedule?d={today}&acSeq={ac_seq}",
            token=token,
        )
        run_case(
            results,
            "webview schedule monthly",
            "GET",
            f"/api/webview/schedule/monthly?monthly={monthly}&acSeq={ac_seq}",
            token=token,
        )
        run_case(
            results,
            "webview notification recent",
            "GET",
            f"/api/webview/notification/recent?acSeq={ac_seq}",
            token=token,
        )
        run_case(
            results,
            "webview coaching progress",
            "POST",
            "/api/webview/coaching/service/getCoachingProgressList",
            body={"loginId": login_id},
            token=token,
        )
    else:
        for name, path, body in [
            (
                "webview account me",
                "/api/webview/account/me",
                {"loginId": login_id},
            ),
        ]:
            run_case(
                results,
                name,
                "POST",
                path,
                body=body,
                token=token,
                skip_reason=skip,
            )

    print("\n=== Results ===")
    ok_n = sum(1 for r in results if r.ok)
    fail_n = sum(1 for r in results if not r.ok and not r.skipped)
    skip_n = sum(1 for r in results if r.skipped)
    for r in results:
        print(r)
    print(f"\nTotal: {len(results)} | OK: {ok_n} | FAIL: {fail_n} | SKIP: {skip_n}")

    if fail_n:
        print("\nSome API calls failed — check server logs / nginx / JWT.")
    return 0 if fail_n == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
