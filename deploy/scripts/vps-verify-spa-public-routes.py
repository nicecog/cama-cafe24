#!/usr/bin/env python3
"""Smoke-test patient SPA + admin public routes (no Whitelabel)."""
import sys
import urllib.error
import urllib.request

BASE = "https://camaplus.cafe24.com"
UA = "Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile"

PATHS = [
    ("/", {301, 302}),
    ("/login", {200}),
    ("/login/credentials", {200}),
    ("/admin/login", {200}),
    ("/legacy/login", {200}),
    ("/legacy/content-management/treatment/done/list", {200}),
    ("/content-management/treatment/done/list", {301, 302}),
    ("/coaching/?wvLoginId=happycog", {200}),
    ("/coaching/sleep?wvLoginId=happycog", {200}),
    ("/webview/help", {200}),
    ("/webview/coaching/happycog", {200}),
    ("/wellbeing?wvLoginId=happycog", {200}),
    ("/home", {200}),
    ("/schedule", {200}),
    ("/favorite", {200}),
    ("/signup", {200}),
    ("/hospital/select", {200}),
    ("/login/credentials", {200}),
    ("/admin/", {200}),
    ("/coaching", {301, 302, 200}),
]


def fetch(path: str, follow_redirects: bool = True) -> tuple[int, str]:
    if follow_redirects:
        opener = urllib.request.build_opener()
    else:

        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None

        opener = urllib.request.build_opener(NoRedirect)
    req = urllib.request.Request(
        f"{BASE}{path}",
        headers={"User-Agent": UA, "Accept": "text/html"},
    )
    try:
        with opener.open(req, timeout=30) as resp:
            return resp.status, resp.read(8000).decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read(8000).decode("utf-8", errors="replace")


REDIRECT_PATHS = {
    "/",
    "/content-management/treatment/done/list",
}

fail = 0
for path, ok_codes in PATHS:
    code, body = fetch(path, follow_redirects=path not in REDIRECT_PATHS)
    bad = code not in ok_codes or "Whitelabel Error Page" in body
    mark = "FAIL" if bad else "OK"
    if bad:
        fail += 1
    print(f"{mark} [{code}] {path}")

if fail:
    sys.exit(1)
print(f"All {len(PATHS)} routes OK")
