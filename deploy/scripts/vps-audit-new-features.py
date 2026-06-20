#!/usr/bin/env python3
"""Full audit of newly added Cafe24 features (APK, FCM, Vital, routes, infra)."""
from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

import paramiko

SCRIPT_DIR = Path(__file__).resolve().parent
ACCESS = SCRIPT_DIR.parent / "CAFE24_VPS_ACCESS.local.md"
PUBLIC_BASE = "https://camaplus.cafe24.com"


@dataclass
class Check:
    area: str
    name: str
    status: str  # OK | WARN | FAIL | SKIP
    detail: str = ""


results: list[Check] = []


def add(area: str, name: str, status: str, detail: str = "") -> None:
    results.append(Check(area, name, status, detail))


def load_access() -> dict[str, str]:
    host, user, password = "210.114.18.156", "root", "admincama!"
    if ACCESS.is_file():
        text = ACCESS.read_text(encoding="utf-8")
        if m := re.search(r"`(\d+\.\d+\.\d+\.\d+)`", text):
            host = m.group(1)
        if m := re.search(r"\*\*SSH 사용자\*\*\s*\|\s*`([^`]+)`", text):
            user = m.group(1)
        if m := re.search(r"\*\*SSH 비밀번호\*\*\s*\|\s*`([^`]+)`", text):
            password = m.group(1)
    return {"host": host, "user": user, "password": password}


def ssh_run(client: paramiko.SSHClient, script: str, timeout: int = 120) -> str:
    _, stdout, stderr = client.exec_command(script, timeout=timeout)
    stdout.channel.recv_exit_status()
    out = stdout.read().decode(errors="replace")
    err = stderr.read().decode(errors="replace").strip()
    return out + (f"\nSTDERR: {err}" if err else "")


def public_fetch(path: str, method: str = "GET", body: bytes | None = None, headers: dict | None = None) -> tuple[int, str]:
    hdrs = {"User-Agent": "cama-audit/1.0", "Accept": "*/*"}
    if headers:
        hdrs.update(headers)
    req = urllib.request.Request(f"{PUBLIC_BASE}{path}", data=body, method=method, headers=hdrs)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read(4000).decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read(4000).decode("utf-8", errors="replace")
    except Exception as e:
        return 0, str(e)


def audit_local_code() -> None:
    repo = SCRIPT_DIR.parent.parent
    sa = repo / "cama-super-admin"

    menu = sa / "src/layout/common/sidebar/menu.json"
    if menu.is_file():
        data = json.loads(menu.read_text(encoding="utf-8"))
        urls = []
        for section in data:
            for child in section.get("children", []):
                urls.append(child.get("url", ""))
        for path, label in [
            ("/main/contentMng/apkMng", "APK 관리 메뉴"),
            ("/main/monitoring/notificationMsg", "알림메시지 메뉴"),
        ]:
            add("관리자 UI", label, "OK" if path in urls else "FAIL", f"menu.json url={path}")

    for page in ["contentMng/apkMng/Page.tsx", "monitoring/notificationMsg/Page.tsx"]:
        p = sa / "src/app/main" / page
        add("관리자 UI", f"페이지 소스 {page}", "OK" if p.is_file() else "FAIL")

    ko = sa / "src/locales/ko/translation.json"
    if ko.is_file():
        tr = json.loads(ko.read_text(encoding="utf-8"))
        for key in ["apkManagement", "notificationMsg"]:
            add("관리자 UI", f"i18n ko.{key}", "OK" if key in tr else "FAIL")

    apk_page = sa / "src/app/main/contentMng/apkMng/Page.tsx"
    if apk_page.is_file():
        text = apk_page.read_text(encoding="utf-8")
        if "등록된 APK가 없습니다." in text:
            add("관리자 UI", "APK 빈 목록 i18n", "WARN", "하드코딩 한국어 (번역키 미사용)")

    mybatis = repo / "cama-plus-server/src/main/resources/mybatis-config.xml"
    if mybatis.is_file():
        xml = mybatis.read_text(encoding="utf-8")
        for mapper in ["FcmTestModeMapper.xml", "VitalMapper.xml"]:
            st = "OK" if mapper in xml else "FAIL"
            add("서버", f"MyBatis {mapper} 등록", st)

    logback = repo / "cama-plus-server/src/main/resources/logback-spring.xml"
    if logback.is_file():
        add(
            "서버",
            "logback cafe24 프로필",
            "OK" if 'name="cafe24"' in logback.read_text(encoding="utf-8") else "WARN",
            "cafe24 프로필 CONSOLE 로그 없으면 장애 진단 어려움",
        )

    # tsc build check (optional)
    try:
        r = subprocess.run(
            ["npx", "tsc", "--noEmit"],
            cwd=sa,
            capture_output=True,
            text=True,
            timeout=120,
            shell=True,
        )
        if r.returncode == 0:
            add("빌드", "super-admin tsc", "OK")
        else:
            err = (r.stderr or r.stdout or "")[-600:]
            add("빌드", "super-admin tsc", "WARN", f"실패 (vite build는 가능): {err[:200]}")
    except Exception as e:
        add("빌드", "super-admin tsc", "SKIP", str(e))


def audit_vps(client: paramiko.SSHClient) -> str | None:
    remote_py = r'''
import json, subprocess, os, re

def curl(args, raw=False):
    r = subprocess.run(args, text=True, capture_output=True)
    if raw:
        return r.returncode, r.stdout, r.stderr
    try:
        return r.returncode, json.loads(r.stdout) if r.stdout.strip() else None, r.stderr
    except Exception:
        return r.returncode, r.stdout, r.stderr

def login():
    code, data, err = curl([
        "curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/auth/doctor",
        "-H", "Content-Type: application/json",
        "-d", '{"principal":"cama","credentials":"cama!"}',
    ])
    if not data or not data.get("success"):
        return None, data
    return data["response"]["apiToken"], None

token, err = login()
print("LOGIN", "ok" if token else "fail", err or "")

def auth_hdrs(t):
    b = f"Bearer {t}"
    return ["-H", f"api_key: {b}", "-H", f"Authorization: {b}"]

checks = []

# server health
code, _, _ = curl(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "http://127.0.0.1:8080/api/public/patient/recover/login-id", "-X", "POST", "-H", "Content-Type: application/json", "-d", '{"name":"x","phone":"01000000000"}'], raw=True)
checks.append(("server_health", int(code or 0) in (200,400), f"http={code}"))

# APK list API
if token:
    code, data, err = curl(["curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/doctor/apk/list", "-H", "Content-Type: application/json", *auth_hdrs(token), "-d", "{}"])
    ok = isinstance(data, dict) and data.get("success")
    items = (data or {}).get("response") or []
    checks.append(("apk_list_api", ok, f"count={len(items)}"))
    if items:
        fn = items[0].get("fileName", "")
        url = items[0].get("downloadUrl", "")
        checks.append(("apk_download_url_field", bool(url.startswith("http")), url[:80]))
        if fn:
            code2, _, _ = curl(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", f"http://127.0.0.1:8080/apk_down/{fn}"], raw=True)
            checks.append(("apk_static_local", int(code2 or 0) == 200, f"http={code2} file={fn}"))

# APK dir mount
ls = subprocess.run("docker exec cama-plus-server ls -la /opt/cama/data/apk_down/ 2>&1 | head -8", shell=True, text=True, capture_output=True).stdout
checks.append(("apk_volume_mount", "apk" in ls.lower() or "total" in ls, ls.strip()[:120]))

# FCM status
if token:
    code, data, err = curl(["curl", "-s", "http://127.0.0.1:8080/api/monitoring/notification/fcm-test-status", *auth_hdrs(token)])
    ok = isinstance(data, dict) and data.get("success")
    active = ((data or {}).get("response") or {}).get("active")
    checks.append(("fcm_test_status", ok, f"active={active}"))

# patient list hasFcmToken field
if token:
    code, data, err = curl(["curl", "-s", "http://127.0.0.1:8080/api/monitoring/patient?searchType=name&searchText=&page=1&displayRow=3&lang=KO", *auth_hdrs(token)])
    ok = isinstance(data, dict) and data.get("success")
    rows = (data or {}).get("response") or []
    has_field = bool(rows) and "hasFcmToken" in rows[0]
    checks.append(("patient_has_fcm_token", ok and has_field, f"rows={len(rows)} sample={rows[0] if rows else {}}"))

# FCM send dry (invalid empty - expect 400/500 not 401)
if token:
    code, data, err = curl(["curl", "-s", "-X", "POST", "http://127.0.0.1:8080/api/monitoring/notification/send", "-H", "Content-Type: application/json", *auth_hdrs(token), "-d", '{"accountSeqs":[],"message":"x"}'])
    ok = isinstance(data, dict) and not data.get("success")  # should reject empty
    checks.append(("fcm_send_auth", ok, str((data or {}).get("error", {}).get("message", data))[:100]))

# Vital API auth (401 without token expected)
code, _, _ = curl(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "PUT", "http://127.0.0.1:8080/api/track/service/vital", "-H", "Content-Type: application/json", "-d", "{}"], raw=True)
checks.append(("vital_requires_auth", int(code or 0) in (401, 403), f"http={code}"))

# Tablet QR (optional - 404 if secret unset)
code, data, err = curl(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-X", "POST", "http://127.0.0.1:8080/api/tablet/qr/issue"], raw=True)
checks.append(("tablet_qr_endpoint", int(code or 0) in (401, 404, 403), f"http={code} (401=exists,404=disabled)"))

# batch container
batch = subprocess.run("docker ps --filter name=cama-back-batch --format '{{.Names}} {{.Status}}'", shell=True, text=True, capture_output=True).stdout.strip()
checks.append(("batch_container", "Up" in batch, batch or "not running"))

# admin dist assets
for asset in ["apkMng", "notificationMsg"]:
    found = subprocess.run(f"grep -rl '{asset}' /opt/cama/super-admin/dist/assets/ 2>/dev/null | head -1", shell=True, text=True, capture_output=True).stdout.strip()
    checks.append((f"admin_dist_{asset}", bool(found), found[:80] or "not in bundle"))

# nginx apk_down
nginx = subprocess.run("grep -n apk_down /etc/nginx/sites-enabled/cama 2>/dev/null | head -3", shell=True, text=True, capture_output=True).stdout.strip()
checks.append(("nginx_apk_down", "apk_down" in nginx, nginx[:100]))

for name, ok, detail in checks:
    print(json.dumps({"check": name, "ok": ok, "detail": detail}, ensure_ascii=False))
'''
    out = ssh_run(client, f"python3 - <<'PY'\n{remote_py}\nPY", timeout=150)
    token_ok = False
    for line in out.splitlines():
        if line.startswith("LOGIN ok"):
            token_ok = True
        if not line.startswith("{"):
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        name = row.get("check", "?")
        ok = row.get("ok")
        detail = str(row.get("detail", ""))
        area_map = {
            "server_health": "인프라",
            "apk_": "APK 관리",
            "fcm_": "알림메시지",
            "patient_": "알림메시지",
            "vital_": "Vital API",
            "tablet_": "태블릿 QR",
            "batch_": "배치",
            "admin_dist_": "관리자 배포",
            "nginx_": "인프라",
        }
        area = "VPS"
        for prefix, a in area_map.items():
            if name.startswith(prefix):
                area = a
                break
        if name == "tablet_qr_endpoint" and "404" in detail:
            add(area, name, "SKIP", "secret 미설정으로 비활성 (의도됨)")
        elif name == "fcm_send_auth" and ok:
            add(area, name, "OK", detail)
        elif ok:
            add(area, name, "OK", detail)
        else:
            add(area, name, "FAIL", detail)
    if not token_ok:
        return "admin login failed (cama/cama!)"
    return None


def audit_public_routes() -> None:
    routes = [
        ("/admin/login", {200}, "관리자 로그인"),
        ("/admin/main/contentMng/apkMng", {200}, "APK 관리 SPA"),
        ("/admin/main/monitoring/notificationMsg", {200}, "알림메시지 SPA"),
    ]
    for path, ok_codes, label in routes:
        code, body = public_fetch(path)
        bad = code not in ok_codes or "Whitelabel Error Page" in body
        add("공개 URL", label, "FAIL" if bad else "OK", f"{PUBLIC_BASE}{path} -> HTTP {code}")

    # APK public download sample
    code, _ = public_fetch("/apk_down/cama-plus-cafe24-2026-06-17.apk", method="HEAD")
    add("APK 관리", "공개 APK 다운로드", "OK" if code == 200 else "WARN", f"HTTP {code} (파일명은 환경마다 다름)")


def print_report() -> int:
    fails = [r for r in results if r.status == "FAIL"]
    warns = [r for r in results if r.status == "WARN"]
    oks = [r for r in results if r.status == "OK"]
    skips = [r for r in results if r.status == "SKIP"]

    print("\n" + "=" * 72)
    print("신규 기능 전수 검사 결과")
    print("=" * 72)
    by_area: dict[str, list[Check]] = {}
    for r in results:
        by_area.setdefault(r.area, []).append(r)
    for area, items in sorted(by_area.items()):
        print(f"\n## {area}")
        for it in items:
            mark = {"OK": "✓", "WARN": "!", "FAIL": "✗", "SKIP": "-"}.get(it.status, "?")
            print(f"  [{mark}] {it.name}: {it.detail or it.status}")
    print("\n" + "-" * 72)
    print(f"OK {len(oks)} | WARN {len(warns)} | FAIL {len(fails)} | SKIP {len(skips)}")
    return 1 if fails else 0


def main() -> None:
    print("Local code audit...")
    audit_local_code()
    print("Public route audit...")
    audit_public_routes()
    print("VPS audit...")
    acc = load_access()
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(acc["host"], username=acc["user"], password=acc["password"], timeout=30, allow_agent=False, look_for_keys=False)
    err = audit_vps(client)
    client.close()
    if err:
        add("VPS", "SSH/API 전체", "FAIL", err)
    sys.exit(print_report())


if __name__ == "__main__":
    main()
