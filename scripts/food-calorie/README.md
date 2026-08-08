# 음식 칼로리 온디바이스용 데이터 전처리·학습 보조 스크립트
# 상세: docs/CAMAPLUS_FOOD_CALORIE_ONDEVICE_PLAN.md §12~§14
# 런북: docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md

## Step 1 — 환경 확인

```powershell
cd F:\cama_pjt\cama-cafe24
powershell -ExecutionPolicy Bypass -File scripts\food-calorie\check_env.ps1
```

## Step 2 — AI Hub 다운로드 후 병합·해제

1. AI Hub 로그인 → dataSetSn **71564** 신청·다운로드
2. part 파일을 `data\aihub\downloads\71564\` 에 저장
3. 병합·해제:

```powershell
.\.venv\Scripts\python.exe scripts\food-calorie\prepare_aihub_download.py `
  --dataset 71564 `
  --downloads-dir data\aihub\downloads\71564 `
  --raw-dir data\aihub\raw\71564
```
