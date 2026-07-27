# CAMA Plus · 음식 100종 학습 진행 런북 (Step-by-Step)

> 작성일: 2026-07-27  
> 관련 문서: [CAMAPLUS_FOOD_CALORIE_ONDEVICE_PLAN.md](./CAMAPLUS_FOOD_CALORIE_ONDEVICE_PLAN.md)  
> 클래스 목록: [food_mvp_100_classes.csv](./food_mvp_100_classes.csv)  
> 전처리 스크립트: [`scripts/food-calorie/convert_aihub_to_yolo.py`](../scripts/food-calorie/convert_aihub_to_yolo.py)  
> 목적: AI Hub → 추출 → YOLO 변환 → YOLO26n 학습 → 양자화 → 앱/서버 연동까지의 **실행 순서**와, 이후 Cursor로 **자동화할 수 있는 작업**을 단계별로 고정한다.

---

## 0. 전제 · 산출물 한눈에

| 항목 | 값 |
|------|-----|
| 모델 | **YOLO26n** (비교군 YOLOv8n 선택) |
| 클래스 | 다빈도 **100종** (`food_mvp_100_classes.csv`) |
| 종당 목표 | **약 1,000장** (합계 ~10만 장) |
| GPU | RTX 4060 Ti 16GB 등 |
| 1차 학습 시간 감 | 대략 **6~14시간** (설정에 따라 다름) |

**단계별 최종 산출물**

```text
data/aihub/raw/                     # AI Hub 원본
data/aihub/mapped/                  # 클래스 매핑·필터 결과
datasets/food_mvp/                  # YOLO images/labels + data.yaml
runs/food/yolo26n_mvp/weights/      # best.pt
exports/                            # tflite/coreml int8
docs/food_mvp_100_classes.mapped.csv# AI Hub명 ↔ class_key ↔ 식약처코드
```

**자동화 범례**

| 표시 | 의미 |
|------|------|
| `[수동]` | 로그인·승인·라이선스·육안 검수 등 사람 필요 |
| `[반자동]` | 스크립트 + 사람이 경로/파라미터 확인 |
| `[자동·Cursor]` | 이후 Cursor 에이전트/스크립트로 반복 실행 가능 |

---

## Step 1 — 환경·폴더 준비 `[반자동]`

### 할 일
1. Ubuntu(권장) + NVIDIA 드라이버 + CUDA 확인  
2. Python venv + `ultralytics` 설치  
3. 작업 디렉터리 생성

```bash
# 예: 프로젝트 루트 = cama-cafe24
mkdir -p data/aihub/{raw,downloads,mapped} datasets/food_mvp exports runs/food
python -m venv .venv && source .venv/bin/activate
pip install -U ultralytics pillow tqdm pyyaml
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

### 완료 조건
- [ ] `torch.cuda.is_available() == True`
- [ ] `docs/food_mvp_100_classes.csv` 존재

### Cursor 자동화 후보
- 폴더 생성, requirements 고정, CUDA 체크 스크립트 `scripts/food-calorie/check_env.sh`

---

## Step 2 — AI Hub에서 **무엇을** 다운로드할지 `[수동]`

### 2.1 우선 다운로드 대상

| 순위 | dataSetSn | 용도 | 신청/소개 URL |
|------|-----------|------|----------------|
| **1 (필수)** | **71564** | 음식 이미지+2D BBox+영양/중량 메타 → **본 학습 메인** | https://www.aihub.or.kr/aihubdata/data/view.do?aihubDataSe=data&currMenu=115&dataSetSn=71564&topMenu=100 |
| **2 (권장)** | **71392** | 당뇨앱 계열 BBox, 다빈도 보강 | https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=71392 |
| **3 (선택)** | **74** | 초기 대용량 음식·영양 — 장수 부족 클래스 보충 | https://www.aihub.or.kr/aihubdata/data/view.do?aihubDataSe=data&currMenu=11&dataSetSn=74&topMenu= |

### 2.2 같이 준비할 영양 DB (서버용, 학습과 병행 가능)

| 구분 | URL |
|------|-----|
| K-FIND | https://various.foodsafetykorea.go.kr/nutrient |
| DB 내려받기 | https://various.foodsafetykorea.go.kr/nutrient/general/down/list.do |
| 공공데이터포털 | https://www.data.go.kr/ (검색: `식품영양성분 통합`) |

### 2.3 다운로드 절차
1. AI Hub 로그인  
2. 위 데이터셋 페이지에서 **다운로드 신청**  
3. 승인 후 **API/파일 목록**에서 분할 zip 수신 → `data/aihub/downloads/`  
4. part 병합 후 `data/aihub/raw/<dataSetSn>/` 에 해제

```bash
DS=71564
DIR=data/aihub/downloads/$DS
# PART_PREFIX는 실제 파일명에 맞게 수정
find "$DIR" -name "*.zip.part*" -print0 | sort -zt'.' -k2V | xargs -0 cat > "$DIR/${DS}.zip"
mkdir -p data/aihub/raw/$DS
unzip "$DIR/${DS}.zip" -d data/aihub/raw/$DS
```

### 완료 조건
- [ ] `data/aihub/raw/71564/` 아래 jpg + json 확인  
- [ ] 샘플 JSON 1건을 열어 BBox 키 경로 확인 (`2d_annotation` 등)

### Cursor 자동화 후보
- part 병합·unzip·용량 검증 스크립트 (신청/로그인은 수동)

---

## Step 3 — AI Hub 클래스 ↔ 100종 매핑표 작성 `[수동]` → `[반자동]`

### 할 일
1. 원본 JSON에서 **등장하는 음식명/카테고리 문자열** 전체 빈도 추출  
2. `food_mvp_100_classes.csv`의 `name_ko` / `class_key`와 **수작업 매칭**  
3. 결과 파일 저장:

`docs/food_mvp_100_classes.mapped.csv` 컬럼 예:

```text
id,class_key,name_ko,aihub_dataset,aihub_class_name,priority,target_images,available_images,food_code,notes
```

### 규칙
- 동의어는 하나의 `class_key`로 병합 (예: 공기밥/흰쌀밥 → `white_rice`)  
- `available_images < 500` 이면 1차에서 제외 또는 P2로 강등  
- 식약처 `food_code`는 K-FIND/통합DB에서 채워 넣기 (없어도 학습은 가능, 서버 연동 전 필수)

### 완료 조건
- [ ] 100종 중 P0는 매핑 완료  
- [ ] 종별 `available_images` 대략 파악

### Cursor 자동화 후보
```bash
# 이미 있는 스크립트로 빈도 기반 후보 뽑기
python scripts/food-calorie/convert_aihub_to_yolo.py build-classes \
  --raw-dir data/aihub/raw/71564 \
  --schema 71564 \
  --top-k 300 \
  --out data/aihub/mapped/classes_freq_top300.json
```
이후 Cursor가 `food_mvp_100_classes.csv`와 fuzzy 매칭 초안 CSV를 만들고, **사람만 확정**하면 됨.

---

## Step 4 — 100종 · 종당 ~1,000장 추출(필터) `[반자동]` / `[자동·Cursor]`

### 할 일
1. 매핑된 클래스만 남기고 이미지·JSON 쌍 필터  
2. 종당 **최대 1,000장** (다양성 샘플링: 각도·파일명 해시 분산)  
3. 출력: `data/aihub/mapped/food_mvp_subset/`

### 권장 샘플링
- 목표 1,000 / 보유 N  
  - N ≤ 1000 → 전부  
  - N > 1000 → 무작위 seed=42로 1,000장 (가능하면 촬영각도 메타 균형)

### 완료 조건
- [ ] 클래스별 장수 리포트 CSV (`class_key,count`)  
- [ ] 총 장수 약 8~12만 (P0만이면 더 적을 수 있음)

### Cursor 자동화 후보
- `scripts/food-calorie/sample_subset.py` (신규): mapped.csv + raw → subset  
- 클래스별 카운트 리포트 자동 생성

---

## Step 5 — JSON → YOLO txt 변환 `[자동·Cursor]`

### 할 일
```bash
python scripts/food-calorie/convert_aihub_to_yolo.py convert \
  --raw-dir data/aihub/mapped/food_mvp_subset \
  --schema 71564 \
  --classes data/aihub/mapped/classes_food_mvp.json \
  --out datasets/food_mvp \
  --val-ratio 0.1 \
  --seed 42

python scripts/food-calorie/convert_aihub_to_yolo.py write-yaml \
  --out datasets/food_mvp \
  --classes data/aihub/mapped/classes_food_mvp.json
```

`classes_food_mvp.json`은 `food_mvp_100_classes.csv`에서 생성 (id↔class_key).

### 완료 조건
- [ ] `datasets/food_mvp/images/{train,val}`  
- [ ] `datasets/food_mvp/labels/{train,val}`  
- [ ] `datasets/food_mvp/data.yaml`  
- [ ] 라벨 좌표 0~1, 빈 라벨 비율 이상치 없음

### Cursor 자동화 후보
- CSV → `classes_food_mvp.json` 변환  
- convert + write-yaml 원커맨드  
- 샘플 20장 BBox 오버레이 PNG 생성(검수용)

---

## Step 6 — 라벨 육안 스팟 검수 `[수동]`

### 할 일
1. 클래스당 2~3장, 전체 최소 40~60장 시각 확인  
2. 박스 어긋남·클래스 오표기 목록화  
3. 치명적 오류 클래스만 재추출 또는 제외

### 완료 조건
- [ ] 스팟 검수 오류율 감각적으로 &lt; 5%  
- [ ] 제외/수정 클래스 노트 기록

### Cursor 자동화 후보
- 검수 갤러리 HTML 생성까지 자동, **합격/불합격 클릭은 사람**

---

## Step 7 — YOLO26n 1차 학습 `[자동·Cursor]`

### 할 일
```bash
yolo detect train \
  model=yolo26n.pt \
  data=datasets/food_mvp/data.yaml \
  epochs=100 \
  imgsz=640 \
  batch=32 \
  device=0 \
  project=runs/food \
  name=yolo26n_mvp_1000
```

(선택) 비교군:
```bash
yolo detect train model=yolov8n.pt data=datasets/food_mvp/data.yaml \
  epochs=100 imgsz=640 batch=32 device=0 project=runs/food name=yolov8n_mvp_1000
```

### 완료 조건
- [ ] `runs/food/yolo26n_mvp_1000/weights/best.pt`  
- [ ] val mAP·혼동행렬 저장  
- [ ] 약한 클래스 Top 20 목록 문서화

### Cursor 자동화 후보
- train 커맨드 실행 + 결과 요약 MD 자동 작성  
- 혼동행렬에서 “추가 학습 후보 클래스” CSV 자동 추출

---

## Step 8 — 양자화·해상도 프로필 Export `[자동·Cursor]`

```bash
BEST=runs/food/yolo26n_mvp_1000/weights/best.pt
mkdir -p exports

yolo export model=$BEST format=tflite imgsz=416 int8=True data=datasets/food_mvp/data.yaml
yolo export model=$BEST format=tflite imgsz=320 int8=True data=datasets/food_mvp/data.yaml
yolo export model=$BEST format=coreml imgsz=416 int8=True
# 산출물을 exports/ 로 이동·이름 규칙 통일
```

### 완료 조건
- [ ] Android용 `*-416-int8.tflite`, `*-320-int8.tflite`  
- [ ] iOS용 CoreML 패키지  
- [ ] FP32 대비 Int8 val 성능 메모

### Cursor 자동화 후보
- export 일괄 + 파일 네이밍 + 용량/지연 벤치 표 생성

---

## Step 9 — 약한 클래스 추가 학습 (선택) `[반자동]`

### 할 일
1. Step 7 혼동행렬·실사용 오류 기준 **20~30종**만 선정  
2. 해당 종만 **+200~500장** (총 1,200~1,500 근접) 추가 추출  
3. 데이터셋 병합 후 **이어 학습**

```bash
yolo detect train \
  model=runs/food/yolo26n_mvp_1000/weights/best.pt \
  data=datasets/food_mvp/data.yaml \
  epochs=40 \
  imgsz=640 \
  batch=32 \
  device=0 \
  project=runs/food \
  name=yolo26n_mvp_finetune
```

### 완료 조건
- [ ] 약한 클래스 recall/precision 개선 확인  
- [ ] 기존 잘되던 클래스가 크게 안 깨졌는지 확인

---

## Step 10 — 서버: 텍스트→영양·가이드 API `[수동 설계]` → `[자동·Cursor 구현]`

### 할 일
1. `class_key` → `food_code` → K-FIND/식약처 영양 조회  
2. 요청 예: `{ items: [{ classId, confidence, portionFactor }] }` (이미지 없음)  
3. 응답: kcal, 탄단지, 가이드 문구  
4. `cama-plus-server` API 추가

### Cursor 자동화 후보
- API DTO·서비스·매핑 CSV 로더 스캐폴딩  
- 매핑 누락 클래스 리포트

---

## Step 11 — 앱 온디바이스 연동 `[자동·Cursor 구현]`

### 할 일
1. Android: TFLite Int8 번들 + 추론  
2. iOS: CoreML 번들 + 추론  
3. `CamaNativeBridge`에 `analyzeFoodImage` 등 추가  
4. WebView로 탐지 결과 이벤트 → 서버 가이드 요청

### Cursor 자동화 후보
- 브릿지 메서드·타입·UI(촬영 버튼) 골격 생성  
- 모델 파일을 `cama-plus-app` 리소스 경로에 복사하는 스크립트

---

## Step 12 — 실기기 검증·피드백 루프 `[수동]` + `[자동·Cursor]`

### 할 일
1. 중·저사양 폰에서 촬영 → 추론 지연·발열·오분류 기록  
2. 오분류 이미지(로컬만 보관) + 정답 라벨 수집  
3. Step 9로 재투입

### Cursor 자동화 후보
- 오분류 로그 JSON → 재학습 큐 CSV 변환

---

## 전체 순서 요약 (체크리스트)

| Step | 내용 | 주체 |
|------|------|------|
| 1 | 환경·폴더 | 반자동 |
| 2 | AI Hub **71564(+71392)** 신청·다운로드·해제 | 수동 |
| 3 | 100종 매핑표 | 수동+스크립트 |
| 4 | 종당 ~1000장 추출 | Cursor 자동 가능 |
| 5 | YOLO 변환·data.yaml | Cursor 자동 |
| 6 | 스팟 검수 | 수동 |
| 7 | YOLO26n 학습 | Cursor 자동 |
| 8 | Int8 export (416/320) | Cursor 자동 |
| 9 | 약한 종 추가 학습 | 반자동 |
| 10 | 서버 영양·가이드 API | Cursor 구현 |
| 11 | 앱 온디바이스 연동 | Cursor 구현 |
| 12 | 실기기 피드백 루프 | 수동+자동 |

---

## Cursor에게 다음에 시킬 작업 프롬프트 예시

복붙용:

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 의 Step 4~5를 구현해줘.
- food_mvp_100_classes.csv 와 AI Hub raw 경로를 입력으로
- 종당 최대 1000장 샘플링
- convert_aihub_to_yolo.py 로 datasets/food_mvp 생성
- class별 count 리포트 MD/CSV 출력
단, AI Hub 원본 이미지는 git에 커밋하지 말 것.
```

```text
runs/food/.../best.pt 를 사용해 Step 8 export 스크립트를 만들고
exports/ 아래에 android/ios 파일명 규칙을 통일해줘.
```

```text
Step 10: class_key→food_code 매핑 CSV 로더와
영양 조회·가이드 응답 API 스켈레톤을 cama-plus-server에 추가해줘.
```

---

## 주의사항

1. **AI Hub 원본·대용량 이미지는 GitHub에 올리지 않는다** (`data/aihub/`, `datasets/`는 `.gitignore`).  
2. 라이선스·이용약관 준수, 상업 이용 범위 확인.  
3. 학습 산출물(`best.pt`, tflite)은 LFS 또는 별도 스토리지 권장.  
4. 칼로리는 모델이 직접 내지 않고 **서버 DB 조회**가 정본.

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-07-27 | 100종 학습 Step 런북 초안 (다운로드→변환→학습→양자화→앱/서버·Cursor 자동화) |
