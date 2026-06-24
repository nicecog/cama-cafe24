#!/usr/bin/env bash
# 건강코칭 → 수면 1~3일차 Maestro E2E
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UDID="${MAESTRO_DEVICE_UDID:-799C45BA-3150-4234-A5D0-C76646C3F783}"
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export PATH="/Applications/Cursor.app/Contents/Resources/app/resources/helpers:$JAVA_HOME/bin:${HOME}/.maestro/bin:$PATH"
export MAESTRO_CLI_NO_ANALYTICS=1
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=1
export MAESTRO_DEVICE_UDID="$UDID"

APP="${SIMULATOR_APP:-$HOME/Library/Developer/Xcode/DerivedData/CamaApp-aetsnabahujxlacpwumejfujnddn/Build/Products/Debug-iphonesimulator/CamaApp.app}"
if [[ -d "$APP" ]]; then
  xcrun simctl install "$UDID" "$APP" 2>/dev/null || true
fi

# launchApp 직후 XCTest viewHierarchy 500 회피: simctl로 먼저 기동 후 대기
xcrun simctl terminate "$UDID" com.camaplus.app 2>/dev/null || true
xcrun simctl launch "$UDID" com.camaplus.app
sleep 10

echo "=== 수면 1~3일차 완료 ==="
maestro test "$ROOT/.maestro/simulator-sleep-days-1-3.yaml" --device "$UDID"

echo "=== 완료 ==="
