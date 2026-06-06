#!/usr/bin/env python3
"""Probe coaching radial chart API for specific patient."""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://camaplus.cafe24.com"
LOGIN = {"principal": "cama", "credentials": "admincama!"}


def login() -> str:
    req = urllib.request.Request(
        BASE + "/api/auth/doctor",
        data=json.dumps(LOGIN).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())["response"]["apiToken"]


def post(path: str, token: str, body: dict) -> tuple[int, dict]:
    bearer = f"Bearer {token}"
    headers = {
        "Content-Type": "application/json",
        "api_key": bearer,
        "Authorization": bearer,
    }
    req = urllib.request.Request(
        BASE + path, data=json.dumps(body).encode(), headers=headers, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())


def main() -> int:
    name = sys.argv[1] if len(sys.argv) > 1 else "최정자"
    token = login()

    # find patient seq from monitoring list
    req = urllib.request.Request(
        BASE + "/api/monitoring/patient?searchType=name&searchText="
        + urllib.parse.quote(name)
        + "&page=1&displayRow=20",
        headers={
            "api_key": f"Bearer {token}",
            "Authorization": f"Bearer {token}",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        patients = json.loads(resp.read())["response"]

    if not patients:
        print(f"No patient found for name={name}")
        return 1

    p = patients[0]
    seq = p["seq"]
    print(f"Patient: {p.get('name')} seq={seq}\n")

    # current frontend call (page 1, acSeq ignored server-side)
    code, j = post(
        "/api/monitoring/coaching/getCoachingMonitoringList",
        token,
        {"acSeq": str(seq), "searchType": "name", "page": "1"},
    )
    rows = j.get("response") or []
    matched = [r for r in rows if r.get("seq") == seq or str(r.get("seq")) == str(seq)]
    print(f"getCoachingMonitoringList page=1: HTTP {code}, total_rows={len(rows)}, matched_for_seq={len(matched)}")
    for r in matched:
        print(f"  - {r.get('categoryNm')} progress={r.get('progress')}")
    if not matched:
        print("  seqs on page1:", sorted({r.get("seq") for r in rows}))

    # search by name (what SQL supports)
    code2, j2 = post(
        "/api/monitoring/coaching/getCoachingMonitoringList",
        token,
        {"searchType": "name", "searchText": name, "page": "1"},
    )
    rows2 = j2.get("response") or []
    matched2 = [r for r in rows2 if str(r.get("seq")) == str(seq)]
    print(f"\nwith searchText={name}: rows={len(rows2)}, matched={len(matched2)}")
    for r in matched2:
        print(f"  - {r.get('categoryNm')} progress={r.get('progress')}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
