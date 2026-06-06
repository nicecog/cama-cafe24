#!/usr/bin/env python3
"""Super Admin screen API probe — wellbeing, statistics, monitoring, etc."""
from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass

BASE = "https://camaplus.cafe24.com"
LOGIN = {"principal": "cama", "credentials": "admincama!"}


@dataclass
class Probe:
    screen: str
    name: str
    method: str
    path: str
    body: dict | None = None


PROBES = [
    Probe("웰빙자원관리", "getWellbeingResourceList", "POST",
          "/api/doctor/wellbeing/resources/getWellbeingResourceList",
          {"page": 1, "searchText": "", "searchType": "title", "lang": "KO"}),
    Probe("즐겨찾기 통계", "getFavoriteStatList", "POST",
          "/api/monitoring/contents/getFavoriteStatList", {"lang": "KO"}),
    Probe("월평가지표", "getAccountStatList", "POST",
          "/api/monitoring/account/getAccountStatList",
          {"page": 1, "searchText": "", "searchType": "", "lang": "KO"}),
    Probe("사용자 검색어 로그", "getSearchTextList", "POST",
          "/api/monitoring/account/getSearchTextList",
          {"page": 1, "searchText": "", "searchType": "", "lang": "KO"}),
    Probe("코칭 진행 모니터링", "getUserCoachingMonitoringList", "POST",
          "/api/monitoring/coaching/getUserCoachingMonitoringList",
          {"page": 1, "searchText": "", "searchType": "name", "lang": "KO"}),
    Probe("코칭 모니터링", "getStepInfoList", "POST",
          "/api/monitoring/coaching/getStepInfoList",
          {"page": 1, "searchText": "", "searchType": "name", "lang": "KO"}),
    Probe("코칭 모니터링", "getTrackReqHstList", "POST",
          "/api/monitoring/coaching/getTrackReqHstList",
          {"page": 1, "searchText": "", "searchType": "name", "lang": "KO"}),
    Probe("코칭 모니터링", "getExerciseSurveyResultList", "POST",
          "/api/monitoring/coaching/getExerciseSurveyResultList",
          {"page": 1, "searchText": "", "searchType": "name", "lang": "KO"}),
    Probe("비디오관리", "getCmVideoInfoList", "POST",
          "/api/doctor/contents/getCmVideoInfoList",
          {"page": 1, "searchText": "", "searchType": "", "lang": "KO"}),
    Probe("치료정보", "getDoctorContents", "GET",
          "/api/doctor/contents?page=1&searchType=&searchText="),
    Probe("작성중인치료", "getDisabledContents", "GET",
          "/api/doctor/disable/contents?page=1&searchType=&searchText="),
    Probe("공통코드", "codeList", "POST",
          "/api/coaching/service/codeList", {"code": "WELLBEING_CATEGORY", "cd": ""}),
]


def login() -> str:
    url = BASE + "/api/auth/doctor"
    req = urllib.request.Request(
        url,
        data=json.dumps(LOGIN).encode(),
        headers={"Content-Type": "application/json", "User-Agent": "cama-probe/1.0"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        j = json.loads(resp.read().decode())
    return j["response"]["apiToken"]


def call(method: str, path: str, token: str, body: dict | None) -> tuple[int, float, str, int]:
    url = BASE + path
    bearer = f"Bearer {token}"
    headers = {
        "Accept": "application/json",
        "User-Agent": "cama-probe/1.0",
        "api_key": bearer,
        "Authorization": bearer,
    }
    data = json.dumps(body).encode() if body is not None else None
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            elapsed = time.perf_counter() - t0
            return resp.status, elapsed, raw, len(raw)
    except urllib.error.HTTPError as e:
        elapsed = time.perf_counter() - t0
        raw = e.read().decode("utf-8", errors="replace")
        return e.code, elapsed, raw, len(raw)
    except Exception as e:
        elapsed = time.perf_counter() - t0
        return 0, elapsed, str(e)[:300], 0


def summarize(raw: str) -> str:
    try:
        j = json.loads(raw)
        ok = j.get("success")
        err = j.get("error")
        resp = j.get("response")
        pag = j.get("pagination")
        if isinstance(resp, list):
            extra = f"items={len(resp)}"
        elif isinstance(resp, dict):
            extra = f"keys={list(resp.keys())[:5]}"
        else:
            extra = f"type={type(resp).__name__}"
        if pag:
            extra += f" total={pag.get('totalCount', pag.get('total', '?'))}"
        if err:
            extra += f" error={err}"
        return f"success={ok} {extra}"
    except json.JSONDecodeError:
        return raw.replace("\n", " ")[:120]


def main() -> int:
    print(f"Target: {BASE}\n")
    token = login()
    print("Login OK\n")
    print(f"{'Screen':<16} {'API':<35} {'HTTP':>4} {'Time':>7}  Summary")
    print("-" * 100)

    failed = 0
    slow = 0
    current = ""
    for p in PROBES:
        code, elapsed, raw, size = call(p.method, p.path, token, p.body)
        ok = code == 200 and '"success":true' in raw
        if not ok:
            failed += 1
        if elapsed > 5:
            slow += 1
        mark = "OK" if ok else "FAIL"
        if p.screen != current:
            current = p.screen
        line = f"{p.screen:<16} {p.name:<35} {code:>4} {elapsed:>6.2f}s  [{mark}] {summarize(raw)}"
        print(line)
        if not ok:
            print(f"    detail: {raw[:200]}")

    print("-" * 100)
    print(f"Total: {len(PROBES)} probes, {failed} failed, {slow} slow (>5s)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
