#!/usr/bin/env python3
"""Compare Super Admin responses: mobile vs desktop user agents."""
import re
import requests

BASE = "https://camaplus.cafe24.com"
UA_MOBILE = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)
UA_ANDROID = (
    "Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
)
UA_DESK = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"

PATHS = ["/admin/", "/admin/login", "/admin/main/contentMng/apkMng"]


def check(label: str, ua: str) -> None:
    print(f"\n=== {label} ===")
    for path in PATHS:
        r = requests.get(BASE + path, headers={"User-Agent": ua}, timeout=60)
        js = re.findall(r'src="(/admin/assets/[^"]+\.js)"', r.text)
        css = re.findall(r'href="(/admin/assets/[^"]+\.css)"', r.text)
        print(f"{path} -> {r.status_code} final={r.url}")
        print(f"  js={js[:1]} css={css[:1]} devmsg={'개발 진행' in r.text}")
        if js:
            jr = requests.get(BASE + js[0], headers={"User-Agent": ua}, timeout=120)
            print(f"  js load: {jr.status_code} len={len(jr.content)}")


if __name__ == "__main__":
    check("desktop", UA_DESK)
    check("iphone", UA_MOBILE)
    check("android", UA_ANDROID)
