#!/usr/bin/env bash
# Food calorie training environment check (Linux/WSL)
# Usage: bash scripts/food-calorie/check_env.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "=== CAMA food-calorie env check ==="
echo "Project root: $ROOT"

fail=0
check() {
  local name="$1"
  local ok="$2"
  local detail="${3:-}"
  if [[ "$ok" == "1" ]]; then
    echo "[OK] $name"
  else
    echo "[FAIL] $name"
    fail=1
  fi
  [[ -n "$detail" ]] && echo "     $detail"
}

[[ -x "$ROOT/.venv/bin/python" ]] && check "Python venv" 1 "$ROOT/.venv/bin/python" || check "Python venv" 0 "$ROOT/.venv/bin/python"
[[ -f "$ROOT/docs/food_mvp_100_classes.csv" ]] && check "food_mvp_100_classes.csv" 1 || check "food_mvp_100_classes.csv" 0
for d in data/aihub/raw data/aihub/downloads data/aihub/mapped datasets/food_mvp exports runs/food; do
  [[ -d "$ROOT/$d" ]] && check "dir $d" 1 || check "dir $d" 0
done

if [[ -x "$ROOT/.venv/bin/python" ]]; then
  "$ROOT/.venv/bin/python" - <<'PY'
import sys
print("python", sys.version.split()[0])
import torch
print("torch", torch.__version__)
print("cuda_available", torch.cuda.is_available())
if torch.cuda.is_available():
    print("cuda_device", torch.cuda.get_device_name(0))
import ultralytics
print("ultralytics", ultralytics.__version__)
PY
  if "$ROOT/.venv/bin/python" -c "import torch; raise SystemExit(0 if torch.cuda.is_available() else 1)"; then
    check "CUDA (torch)" 1 "torch.cuda.is_available() == True"
  else
    check "CUDA (torch)" 0 "torch.cuda.is_available() == False"
  fi
  check "ultralytics" 1
fi

echo
if [[ "$fail" -eq 0 ]]; then
  echo "All checks passed."
else
  echo "Some checks failed."
  exit 1
fi
