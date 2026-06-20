#!/usr/bin/env python3
"""cama-plus-app 네이티브 브릿지 · WebView 에뮬레이터 스모크 테스트."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
PKG = "com.camaplus.app"
ACTIVITY = "com.camaplus.app/.MainActivity"


def run(cmd: list[str], **kwargs) -> subprocess.CompletedProcess:
    print("+", " ".join(cmd))
    if "text" not in kwargs:
        kwargs["text"] = True
        kwargs["encoding"] = kwargs.pop("encoding", "utf-8")
        kwargs["errors"] = kwargs.pop("errors", "replace")
    return subprocess.run(cmd, check=False, capture_output=True, **kwargs)


def adb(*args: str) -> subprocess.CompletedProcess:
    return run(["adb", *args])


def wait_for_device(timeout_sec: int = 120) -> bool:
    deadline = time.time() + timeout_sec
    while time.time() < deadline:
        r = adb("get-state")
        if r.returncode == 0 and "device" in (r.stdout or "").strip():
            boot = adb("shell", "getprop", "sys.boot_completed")
            if boot.returncode == 0 and boot.stdout.strip() == "1":
                return True
        time.sleep(2)
    return False


def main() -> int:
    parser = argparse.ArgumentParser(description="CAMA Plus emulator bridge smoke test")
    parser.add_argument(
        "--apk",
        type=Path,
        help="APK path (default: latest dist/cama-plus-cafe24-*.apk or debug build)",
    )
    parser.add_argument("--reverse", action="store_true", help="adb reverse tcp:5173 for debug SPA")
    parser.add_argument("--skip-install", action="store_true")
    args = parser.parse_args()

    if shutil.which("adb") is None:
        print("ERROR: adb not found in PATH", file=sys.stderr)
        return 1

    if not wait_for_device():
        print("ERROR: no ready emulator/device", file=sys.stderr)
        return 2

    apk = args.apk
    if apk is None:
        candidates = sorted(DIST.glob("cama-plus-cafe24-*.apk"), reverse=True)
        debug_apk = ROOT / "cama-plus-app/android/app/build/outputs/apk/debug/app-debug.apk"
        apk = candidates[0] if candidates else debug_apk

    if not apk.is_file():
        print(f"ERROR: APK not found: {apk}", file=sys.stderr)
        return 3

    print(f"Using APK: {apk}")

    if args.reverse:
        adb("reverse", "tcp:5173", "tcp:5173")

    if not args.skip_install:
        ins = adb("install", "-r", str(apk))
        print(ins.stdout or ins.stderr)
        if ins.returncode != 0:
            print("ERROR: adb install failed", file=sys.stderr)
            return 4

    adb("shell", "am", "force-stop", PKG)
    time.sleep(1)
    adb("shell", "am", "start", "-n", ACTIVITY)
    print("Waiting for WebView load...")
    time.sleep(10)

    DIST.mkdir(parents=True, exist_ok=True)
    shot = DIST / "emulator-bridge-test.png"
    cap2 = subprocess.run(
        ["adb", "exec-out", "screencap", "-p"],
        check=False,
        capture_output=True,
    )
    if cap2.returncode == 0 and cap2.stdout:
        shot.write_bytes(cap2.stdout)
        print(f"Screenshot: {shot} ({len(cap2.stdout)} bytes)")
    else:
        adb("shell", "screencap", "-p", "/sdcard/cama_bridge_test.png")
        pull = adb("pull", "/sdcard/cama_bridge_test.png", str(shot))
        if pull.returncode == 0:
            print(f"Screenshot (pull): {shot}")

    log = subprocess.run(
        ["adb", "logcat", "-d", "-t", "400"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        check=False,
    )
    keywords = ("ReactNativeJS", "WebView", "CamaApp", "FCM", "bridge", "ERROR", "FATAL")
    hits = [ln for ln in (log.stdout or "").splitlines() if any(k in ln for k in keywords)]
    report = DIST / "emulator-bridge-test.log"
    report.write_text("\n".join(hits[-80:]), encoding="utf-8")
    print(f"Log excerpt: {report} ({len(hits)} matching lines)")

    errors = [ln for ln in hits if "FATAL" in ln or "AndroidRuntime" in ln]
    if errors:
        print("WARN: fatal/crash lines detected — check log")
        return 5

    print("OK: app launched on emulator")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
