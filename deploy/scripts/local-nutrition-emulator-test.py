#!/usr/bin/env python3
"""로컬 에뮬레이터 + Vite SPA 스모크 (서버 배포 없음).

로그: dist/local-nutrition-emulator-test.log
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
LOG = DIST / "local-nutrition-emulator-test.log"
PKG = "com.camaplus.app"
ACTIVITY = "com.camaplus.app/.MainActivity"
ADB = os.environ.get(
    "ADB",
    str(Path(os.environ.get("LOCALAPPDATA", "")) / "Android/Sdk/platform-tools/adb.exe"),
)
BASE = os.environ.get("CAMA_API_BASE", "https://camaplus.cafe24.com").rstrip("/")

lines: list[str] = []


def log(msg: str) -> None:
    stamp = datetime.now().strftime("%H:%M:%S")
    text = f"[{stamp}] {msg}"
    print(text)
    lines.append(text)


def adb(*args: str) -> subprocess.CompletedProcess:
    cmd = [ADB, *args] if Path(ADB).is_file() else ["adb", *args]
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")


def wait_device(timeout: int = 240) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        r = adb("get-state")
        if r.returncode == 0 and "device" in (r.stdout or "").strip():
            boot = adb("shell", "getprop", "sys.boot_completed")
            if boot.returncode == 0 and (boot.stdout or "").strip() == "1":
                return True
        time.sleep(3)
    return False


def check_vite() -> bool:
    try:
        with urllib.request.urlopen("http://127.0.0.1:5173/", timeout=5) as resp:
            log(f"vite HTTP {resp.status}")
            return resp.status < 500
    except Exception as exc:  # noqa: BLE001
        log(f"vite FAIL: {exc}")
        return False


def check_prod_catalog_public() -> None:
    """서버 배포 전이라도 운영 catalog 엔드포인트 존재 여부만 확인."""
    url = f"{BASE}/api/nutrition/catalog"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            log(f"prod catalog (no auth) HTTP {resp.status}")
    except urllib.error.HTTPError as e:
        log(f"prod catalog HTTP {e.code} (expected 401 without token)")
    except Exception as exc:  # noqa: BLE001
        log(f"prod catalog error: {exc}")


def emulator_smoke(apk: Path) -> list[str]:
    fails: list[str] = []
    if not wait_device():
        return ["emulator not ready"]

    log(f"device ready; apk={apk}")
    rev = adb("reverse", "tcp:5173", "tcp:5173")
    log(f"adb reverse rc={rev.returncode}")

    ins = adb("install", "-r", str(apk))
    log(f"install rc={ins.returncode} out={(ins.stdout or '')[:160]} err={(ins.stderr or '')[:240]}")
    if ins.returncode != 0:
        return ["adb install failed"]

    adb("shell", "am", "force-stop", PKG)
    time.sleep(1)
    start = adb("shell", "am", "start", "-n", ACTIVITY)
    log(f"start rc={start.returncode} {(start.stdout or start.stderr or '')[:160]}")
    time.sleep(14)

    DIST.mkdir(parents=True, exist_ok=True)
    shot = DIST / "local-nutrition-emulator.png"
    cap = subprocess.run(
        [ADB if Path(ADB).is_file() else "adb", "exec-out", "screencap", "-p"],
        capture_output=True,
        check=False,
    )
    if cap.returncode == 0 and cap.stdout and len(cap.stdout) > 1000:
        shot.write_bytes(cap.stdout)
        log(f"screenshot {shot} ({len(cap.stdout)} bytes)")
    else:
        fails.append("screencap failed")

    # from emulator, hit host via reverse
    curl = adb("shell", "curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "http://127.0.0.1:5173/")
    code = (curl.stdout or "").strip()
    log(f"emu curl 5173 -> '{code}' rc={curl.returncode}")
    if code not in {"200", "304"}:
        # some images lack curl; try wget
        wget = adb("shell", "wget", "-q", "-O", "/dev/null", "http://127.0.0.1:5173/")
        log(f"emu wget 5173 rc={wget.returncode} {(wget.stderr or '')[:120]}")

    lg = adb("logcat", "-d", "-t", "600")
    text = lg.stdout or ""
    fatals = [ln for ln in text.splitlines() if "FATAL EXCEPTION" in ln]
    if fatals:
        for ln in fatals[-8:]:
            log("FATAL: " + ln[:220])
        fails.append("FATAL EXCEPTION in logcat")

    interesting = [
        ln
        for ln in text.splitlines()
        if any(
            k in ln
            for k in (
                "CamaNativeBridge",
                "FoodVision",
                "analyzeFood",
                "ReactNativeJS",
                "chromium",
                "WebView",
                "ERR_",
            )
        )
    ]
    log(f"interesting log lines={len(interesting)}")
    for ln in interesting[-25:]:
        log("  " + ln[:220])

    ui = adb("shell", "uiautomator", "dump", "/sdcard/cama_ui.xml")
    pull = adb("pull", "/sdcard/cama_ui.xml", str(DIST / "local-nutrition-emulator-ui.xml"))
    log(f"ui dump rc={ui.returncode} pull rc={pull.returncode}")
    ui_path = DIST / "local-nutrition-emulator-ui.xml"
    if ui_path.is_file():
        raw = ui_path.read_text(encoding="utf-8", errors="replace")
        for needle in ("로그인", "마이페이지", "식사", "WebView", "허용", "닫기"):
            if needle in raw:
                log(f"ui contains: {needle}")

    return fails


def main() -> int:
    DIST.mkdir(parents=True, exist_ok=True)
    log("=== local emulator test (NO server deploy) ===")
    fails: list[str] = []

    if not check_vite():
        fails.append("vite not running on 5173")
    check_prod_catalog_public()

    apk = ROOT / "cama-plus-app/android/app/build/outputs/apk/debug/app-debug.apk"
    for i in range(90):
        if apk.is_file():
            break
        if i % 6 == 0:
            log(f"waiting for debug apk... ({i * 5}s)")
        time.sleep(5)

    if not apk.is_file():
        # fallback release — note: points to prod webview
        cands = sorted(DIST.glob("cama-plus-cafe24-*.apk"), reverse=True)
        if not cands:
            fails.append("no apk")
            LOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
            return 1
        log(f"WARN debug apk missing; using release {cands[0].name}")
        apk = cands[0]

    fails.extend(emulator_smoke(apk))

    log("=== summary ===")
    if fails:
        for f in fails:
            log(f"FAIL: {f}")
    else:
        log("ALL CHECKS PASSED (local shell; server deploy skipped)")
    LOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"LOG={LOG}")
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
