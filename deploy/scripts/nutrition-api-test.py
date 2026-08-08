#!/usr/bin/env python3
"""배포된 영양 API 실호출 테스트. 결과: dist/nutrition-api-test.log"""
from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from urllib import error, request

BASE = "https://camaplus.cafe24.com"
ROOT = Path(__file__).resolve().parents[2]
LOG = ROOT / "dist" / "nutrition-api-test.log"
lines: list[str] = []
fails = 0


def log(msg: str) -> None:
    print(msg)
    lines.append(msg)


def req(method: str, path: str, body: dict | None = None, token: str | None = None):
    data = json.dumps(body).encode() if body is not None else None
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if token:
        headers["api_key"] = f"Bearer {token}"
    r = request.Request(BASE + path, data=data, headers=headers, method=method)
    try:
        with request.urlopen(r, timeout=45) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return resp.status, json.loads(raw) if raw else None
    except error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw) if raw else None
        except json.JSONDecodeError:
            parsed = {"raw": raw[:300]}
        return e.code, parsed


def check(name: str, ok: bool, detail: str = "") -> None:
    global fails
    mark = "OK" if ok else "FAIL"
    if not ok:
        fails += 1
    log(f"[{mark}] {name}" + (f" — {detail}" if detail else ""))


def main() -> int:
    log(f"=== nutrition API test {datetime.now().isoformat(timespec='seconds')} ===")

    st, data = req("POST", "/api/public/patient/recover/login-id", {"name": "최완규", "phone": "01032984763"})
    login_id = ((data or {}).get("response") or {}).get("loginId")
    check("recover login-id", st == 200 and bool(login_id), f"{st} id={login_id}")

    st, data = req("POST", "/api/public/patient/recover/reset-password", {"loginId": login_id, "name": "최완규", "phone": "01032984763"})
    pw = ((data or {}).get("response") or {}).get("temporaryPassword")
    check("reset-password", st == 200 and bool(pw), str(st))

    st, data = req("POST", "/api/auth", {"principal": login_id, "credentials": pw, "firebase": {"device": "api-test", "platform": "ANDROID", "token": "web-no-fcm"}})
    token = ((data or {}).get("response") or {}).get("apiToken")
    check("auth", st == 200 and bool(token), str(st))
    if not token:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        LOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return 1

    st, data = req("GET", "/api/nutrition/catalog", token=token)
    resp = (data or {}).get("response") or {}
    changed = resp.get("changed") or []
    check("GET catalog", st == 200 and len(changed) >= 90, f"status={st} classes={len(changed)} ver={resp.get('catalogVersion')}")
    white = next((c for c in changed if c.get("classKey") == "white_rice"), None)
    check("catalog white_rice FC10 kcal", bool(white) and abs(float(white.get("kcalPer100g") or 0) - 152) < 1, f"kcal={None if not white else white.get('kcalPer100g')}")

    st, data = req("POST", "/api/nutrition/food/search", {"keyword": "김밥", "limit": 5}, token=token)
    hits = (data or {}).get("response") or []
    check("POST food/search", st == 200 and isinstance(hits, list) and len(hits) > 0, f"{st} n={len(hits) if isinstance(hits, list) else 0}")

    eaten = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    estimate_body = {
        "mealTypeCd": "LUNCH",
        "sourceCd": "MANUAL",
        "eatenAt": eaten,
        "items": [
            {"classKey": "white_rice", "confidence": 0.95, "portionFactor": 1, "quantity": 1, "clientKcalPreview": 999},
            {"classKey": "apple", "confidence": 0.9, "portionFactor": 1, "quantity": 1, "clientKcalPreview": 50},
            {"classKey": "dakgalbi", "confidence": 0.88, "portionFactor": 1, "quantity": 1, "clientKcalPreview": 200},
            {"classKey": "egg_soup", "confidence": 0.7, "portionFactor": 1, "quantity": 1, "clientKcalPreview": 80},
        ],
    }
    st, data = req("POST", "/api/nutrition/meal/estimate", estimate_body, token=token)
    resp = (data or {}).get("response") or {}
    items = resp.get("items") or []
    by_key = {i.get("classKey"): i for i in items if isinstance(i, dict)}
    check("POST estimate", st == 200 and resp.get("totalKcal") is not None, f"{st} total={resp.get('totalKcal')} ver={resp.get('nutritionVersion')}")
    wr = by_key.get("white_rice") or {}
    check("estimate white_rice FC10", wr.get("nutritionSourceCd") == "MFDS" and str(wr.get("foodCode", "")).startswith("A"), f"src={wr.get('nutritionSourceCd')} code={wr.get('foodCode')} kcal={wr.get('kcal')}")
    ap = by_key.get("apple") or {}
    check("estimate apple FC10", wr.get("nutritionSourceCd") == "MFDS" and str(ap.get("foodCode", "")).startswith("H"), f"code={ap.get('foodCode')} kcal={ap.get('kcal')}")
    dg = by_key.get("dakgalbi") or {}
    check("estimate dakgalbi MFDS", dg.get("nutritionSourceCd") == "MFDS" and str(dg.get("foodCode", "")).startswith("D"), f"code={dg.get('foodCode')} kcal={dg.get('kcal')}")
    es = by_key.get("egg_soup") or {}
    check("estimate egg_soup fallback", es.get("nutritionSourceCd") in {"CLASS_FALLBACK", "NONE"}, f"src={es.get('nutritionSourceCd')}")

    client_log_id = str(uuid.uuid4())
    save_body = {**estimate_body, "clientLogId": client_log_id, "items": estimate_body["items"][:2]}
    st, data = req("POST", "/api/nutrition/meal", save_body, token=token)
    resp = (data or {}).get("response") or {}
    seq = resp.get("seq")
    check("POST meal save", st == 200 and seq is not None, f"{st} seq={seq} total={resp.get('totalKcal')}")

    st2, data2 = req("POST", "/api/nutrition/meal", save_body, token=token)
    resp2 = (data2 or {}).get("response") or {}
    check("POST meal idempotent", st2 == 200 and resp2.get("seq") == seq, f"seq={resp2.get('seq')}")

    st, data = req("GET", f"/api/nutrition/meal/{seq}", token=token)
    check("GET meal detail", st == 200 and ((data or {}).get("response") or {}).get("seq") == seq, str(st))

    today = datetime.now().strftime("%Y-%m-%d")
    st, data = req("POST", "/api/nutrition/mealList", {"fromDate": today, "toDate": today}, token=token)
    lst = (data or {}).get("response") or []
    check("POST mealList", st == 200 and isinstance(lst, list), f"{st} n={len(lst) if isinstance(lst, list) else 0}")

    st, data = req("POST", "/api/nutrition/mealDailySummary", {"fromDate": today, "toDate": today}, token=token)
    check("POST mealDailySummary", st == 200, str(st))

    upd = {**save_body, "memo": "api-test", "items": [{"classKey": "white_rice", "confidence": 0.95, "portionFactor": 1.5, "quantity": 1, "clientKcalPreview": 999}]}
    st, data = req("PUT", f"/api/nutrition/meal/{seq}", upd, token=token)
    resp = (data or {}).get("response") or {}
    check("PUT meal update", st == 200 and resp.get("seq") == seq, f"{st} total={resp.get('totalKcal')}")

    item_seq = None
    for it in resp.get("items") or []:
        if it.get("seq"):
            item_seq = it["seq"]
            break
    if not item_seq:
        st, data = req("GET", f"/api/nutrition/meal/{seq}", token=token)
        for it in ((data or {}).get("response") or {}).get("items") or []:
            if it.get("seq"):
                item_seq = it["seq"]
                break
    if item_seq:
        st, data = req("POST", "/api/nutrition/meal/feedback", {"mealLogItemSeq": item_seq, "predictedClass": "white_rice", "correctedClass": "brown_rice", "memo": "api-test"}, token=token)
        check("POST feedback", st == 200, str(st))
    else:
        check("POST feedback", False, "no item seq")

    st, data = req("POST", "/api/nutrition/meal/delete", {"seq": seq}, token=token)
    check("POST meal delete", st == 200, str(st))

    log(f"=== summary fails={fails} ===")
    LOG.parent.mkdir(parents=True, exist_ok=True)
    LOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
    log(f"wrote {LOG}")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
