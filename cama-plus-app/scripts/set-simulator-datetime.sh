#!/usr/bin/env bash
# iOS 시뮬레이터 상태바 날짜/시간 오버라이드 (일정 등록 E2E용)
set -euo pipefail

UDID="${MAESTRO_DEVICE_UDID:-799C45BA-3150-4234-A5D0-C76646C3F783}"
# 내일 14:30 (KST) — 폼에서 선택하는 날짜·시간과 맞춤
TEST_ISO="${SIM_TEST_DATETIME:-2026-06-24T14:30:00+09:00}"
TEST_TIME="${SIM_TEST_TIME:-14:30}"

if ! xcrun simctl list devices booted 2>/dev/null | grep -q "$UDID"; then
  echo "Booting simulator $UDID..."
  xcrun simctl boot "$UDID" 2>/dev/null || true
  open -a Simulator --args -CurrentDeviceUDID "$UDID" 2>/dev/null || true
  sleep 3
fi

echo "Setting status bar time on $UDID ..."
if xcrun simctl status_bar "$UDID" override --time "$TEST_ISO" 2>/dev/null; then
  echo "OK: $TEST_ISO"
elif xcrun simctl status_bar "$UDID" override --time "$TEST_TIME" 2>/dev/null; then
  echo "OK: $TEST_TIME"
else
  echo "WARN: status_bar override failed (continuing with host clock)"
fi
