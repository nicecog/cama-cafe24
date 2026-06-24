#!/usr/bin/env bash
# 1) 시뮬레이터 날짜/시간 설정 → 2) 일정 등록 테스트 → 3) 건강코칭만 테스트
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
UDID="${MAESTRO_DEVICE_UDID:-799C45BA-3150-4234-A5D0-C76646C3F783}"
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home}"
export PATH="$JAVA_HOME/bin:${HOME}/.maestro/bin:$PATH"
export MAESTRO_CLI_NO_ANALYTICS=1
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=1
export MAESTRO_DEVICE_UDID="$UDID"

APP="${SIMULATOR_APP:-$HOME/Library/Developer/Xcode/DerivedData/CamaApp-aetsnabahujxlacpwumejfujnddn/Build/Products/Release-iphonesimulator/CamaApp.app}"
if [[ -d "$APP" ]]; then
  xcrun simctl install "$UDID" "$APP" 2>/dev/null || true
fi

"$ROOT/scripts/set-simulator-datetime.sh"

echo "=== [1/2] 일정 등록 (날짜·시간 변경) ==="
maestro test "$ROOT/.maestro/simulator-schedule-datetime.yaml" --device "$UDID"

echo "=== [2/2] 건강코칭 5영역 (세션 유지) ==="
maestro test "$ROOT/.maestro/simulator-coaching-only.yaml" --device "$UDID"

echo "=== 완료 ==="
