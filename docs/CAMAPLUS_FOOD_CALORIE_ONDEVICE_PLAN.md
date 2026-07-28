# CAMA Plus · 음식 사진 칼로리 추정 기능 기획서

> 작성일: 2026-07-27  
> 목적: 온디바이스 음식 탐지 + 서버 영양 DB/가이드 아키텍처의 데이터·모델·학습·양자화·로드맵 정리  
> 상태: 기획 초안 (구현 전)  
> 실행 런북: [CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md](./CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md)

---

## 1. 목표 기능

스마트폰 카메라로 음식 사진을 찍으면:

1. **기기 내부**에서 음식 종류(및 가능 시 대략적 양)를 탐지·분류한다.
2. **서버**에는 이미지 원본이 아닌 **텍스트 기반 결과**(클래스 ID, confidence, 선택적 양 추정 등)만 전송한다.
3. 서버는 **식약처 식품영양성분 DB** 등을 조회해 칼로리·탄단지 등을 계산하고, 환자 맥락에 맞는 **가이드**를 반환한다.

핵심 원칙:

- **이미지 분석 ≠ 칼로리 산출**. 탐지는 “무슨 음식인지(와 대략 양)”만 담당하고, 칼로리는 항상 DB 기준 계산이다.
- 동일 음식도 조리법·양에 따라 편차가 크므로 UX에 **신뢰구간·양 보정 UI**가 필요하다.
- 의료/헬스케어 앱 특성상 “정확한 측정”보다 **추정·참고용** 고지가 필요하다.

---

## 2. 목표 아키텍처

```
[스마트폰]
  카메라 촬영
    → 양자화 탐지 모델(YOLO26n Int8 등) 온디바이스 추론
    → 출력: 음식 클래스 목록, confidence, bbox, (선택) 양/1인분 추정
    → 서버로 전송: JSON/텍스트 페이로드만 (원본 사진 미전송)

[CAMA 서버]
  클래스 코드 ↔ 식품코드 매핑
    → 식약처 영양성분 DB 조회 (kcal, 탄수화물, 단백질, 지방 등)
    → 환자 맥락(당뇨·신장·목표 칼로리 등) 반영 가이드 생성
    → 기록/히스토리/코칭 문구 반환
```

### 왜 온디바이스 탐지 + 서버 DB인가

| 항목 | 이미지 서버 업로드 | 온디바이스 탐지 + 텍스트 전송 (채택) |
|------|-------------------|--------------------------------------|
| 개인정보·의료 민감도 | 식사 사진 유출 위험 | 이미지 미전송으로 위험 감소 |
| 대역폭·오프라인 | 네트워크 필수 | 탐지는 오프라인 가능, 가이드만 온라인 |
| 서버 비용 | GPU 추론 상시 필요 | 텍스트·DB 조회 위주 |
| 정확도 책임 분리 | 모델이 kcal까지 추정하기 쉬움(위험) | kcal은 DB 정본으로 고정 |

---

## 3. 데이터 전략

### 3.1 활용 예정 공개 데이터

| 소스 | 역할 | 강점 | 주의 |
|------|------|------|------|
| **AI Hub** 한국인 식습관/음식 이미지·바운딩박스 | 탐지 모델 학습 | 한국 음식, BBox, 대량 | 이용 승인·라이선스, YOLO 라벨 변환, 클래스 정리 |
| **AI Hub** 영양·중량 메타(실중량, 1인분 표준중량 등) | 양·영양 보조 | 양 추정 고도화에 유리 | 탐지 클래스 ↔ 식품코드 매핑 테이블 필수 |
| **공공데이터포털 · 식약처 식품영양성분 DB** | 서버 조회 정본 | 공공·공식 성분값 | 요리명≠원재료명 매핑, 갱신 주기 관리 |

참고 데이터셋·다운로드 링크는 **§12**에 정리했다.

### 3.2 MVP 클래스 범위

- **1차 MVP: 다빈도 한국 음식 80~150종**으로 축소.
- 전체 500종을 한 번에 학습하면 희소 클래스·시각 유사 음식(국/찌개/나물) 혼동으로 품질이 떨어지기 쉽다.
- 운영 루프: **선별 → 학습 → 배포 → 오분류 수집 → 재학습**.

### 3.3 매핑 테이블 (필수 산출물)

```
음식_클래스_ID  →  표준_음식명  →  식약처_식품코드  →  100g/1인분 영양
```

매핑률 목표: MVP 기준 **≥ 90%**.

### 3.4 1차 학습 초안 목록 (다빈도 100종)

> 목적: AI Hub 대용량 데이터에서 **추출·학습할 MVP 클래스** 초안.  
> 기준: 한국인 다빈도 식사·외식·분식 중심, 시각 구분 가능성, 식약처 DB 매핑 용이성.  
> 상태: **초안** — AI Hub 실제 클래스명과 1:1 매칭·확보 가능 장수는 다운로드 후 조정.  
> 추출 목표: 종당 **800~1,200장** (합계 약 **8~12만 장**), val 약 10%.

| ID | class_key | 표준 음식명 | 대분류 | 추출 우선 |
|----|-----------|-------------|--------|-----------|
| 0 | white_rice | 흰밥(공기밥) | 밥·면 | P0 |
| 1 | brown_rice | 현미밥 | 밥·면 | P1 |
| 2 | gimbap | 김밥 | 밥·면 | P0 |
| 3 | bibimbap | 비빔밥 | 밥·면 | P0 |
| 4 | bokkeumbap | 볶음밥 | 밥·면 | P0 |
| 5 | deopbap | 덮밥(제육/불고기 등) | 밥·면 | P0 |
| 6 | curry_rice | 카레라이스 | 밥·면 | P1 |
| 7 | omurice | 오므라이스 | 밥·면 | P1 |
| 8 | ramyeon | 라면(봉지/컵) | 밥·면 | P0 |
| 9 | jjajangmyeon | 짜장면 | 밥·면 | P0 |
| 10 | jjamppong | 짬뽕 | 밥·면 | P0 |
| 11 | udon | 우동 | 밥·면 | P1 |
| 12 | naengmyeon | 냉면 | 밥·면 | P0 |
| 13 | kalguksu | 칼국수 | 밥·면 | P0 |
| 14 | jjolmyeon | 쫄면 | 밥·면 | P1 |
| 15 | spaghetti | 스파게티/파스타 | 밥·면 | P1 |
| 16 | kimchi_jjigae | 김치찌개 | 국·찌개 | P0 |
| 17 | doenjang_jjigae | 된장찌개 | 국·찌개 | P0 |
| 18 | sundubu_jjigae | 순두부찌개 | 국·찌개 | P0 |
| 19 | unitguk | 미역국 | 국·찌개 | P0 |
| 20 | yukgaejang | 육개장 | 국·찌개 | P0 |
| 21 | seolleongtang | 설렁탕 | 국·찌개 | P0 |
| 22 | gomtang | 곰탕 | 국·찌개 | P1 |
| 23 | galbitang | 갈비탕 | 국·찌개 | P0 |
| 24 | samgyetang | 삼계탕 | 국·찌개 | P1 |
| 25 | doenjangguk | 된장국 | 국·찌개 | P1 |
| 26 | egg_soup | 계란국 | 국·찌개 | P1 |
| 27 | kongnamulguk | 콩나물국 | 국·찌개 | P1 |
| 28 | budae_jjigae | 부대찌개 | 국·찌개 | P0 |
| 29 | maeuntang | 매운탕 | 국·찌개 | P1 |
| 30 | samgyeopsal | 삼겹살구이 | 구이·볶음 | P0 |
| 31 | moksal | 목살/항정살구이 | 구이·볶음 | P1 |
| 32 | bulgogi | 불고기 | 구이·볶음 | P0 |
| 33 | jeyuk_bokkeum | 제육볶음 | 구이·볶음 | P0 |
| 34 | dakgalbi | 닭갈비 | 구이·볶음 | P0 |
| 35 | chicken_fried | 치킨(후라이드) | 구이·볶음 | P0 |
| 36 | chicken_seasoned | 치킨(양념) | 구이·볶음 | P0 |
| 37 | grilled_mackerel | 고등어구이 | 구이·볶음 | P0 |
| 38 | grilled_saury | 삼치/꽁치구이 | 구이·볶음 | P1 |
| 39 | grilled_hairtail | 갈치구이 | 구이·볶음 | P1 |
| 40 | pork_cutlet | 돈까스 | 구이·볶음 | P0 |
| 41 | fish_cutlet | 생선까스 | 구이·볶음 | P1 |
| 42 | tteokgalbi | 떡갈비 | 구이·볶음 | P1 |
| 43 | bossam | 보쌈 | 구이·볶음 | P1 |
| 44 | jokbal | 족발 | 구이·볶음 | P1 |
| 45 | egg_roll | 계란말이 | 구이·볶음 | P0 |
| 46 | fried_egg | 계란후라이 | 구이·볶음 | P0 |
| 47 | scrambled_egg | 스크램블에그 | 구이·볶음 | P2 |
| 48 | kimchi | 배추김치 | 반찬 | P0 |
| 49 | kkakdugi | 깍두기 | 반찬 | P1 |
| 50 | oi_sobagi | 오이소박이/오이무침 | 반찬 | P1 |
| 51 | spinach_namul | 시금치나물 | 반찬 | P1 |
| 52 | bean_sprout_namul | 콩나물무침 | 반찬 | P0 |
| 53 | fernbrake_namul | 고사리나물 | 반찬 | P2 |
| 54 | hob_bokkeum | 멸치볶음 | 반찬 | P0 |
| 55 | potato_jorim | 감자조림 | 반찬 | P0 |
| 56 | quail_egg_jorim | 메추리알장조림 | 반찬 | P1 |
| 57 | eomuk_bokkeum | 어묵볶음 | 반찬 | P0 |
| 58 | japchae | 잡채 | 반찬 | P0 |
| 59 | salad | 샐러드 | 반찬 | P1 |
| 60 | tteokbokki | 떡볶이 | 분식·간편 | P0 |
| 61 | sundae | 순대 | 분식·간편 | P0 |
| 62 | twigim | 모듬튀김 | 분식·간편 | P0 |
| 63 | hotdog | 핫도그 | 분식·간편 | P1 |
| 64 | pizza | 피자 | 분식·간편 | P0 |
| 65 | hamburger | 햄버거 | 분식·간편 | P0 |
| 66 | sandwich | 샌드위치 | 분식·간편 | P1 |
| 67 | toast | 토스트 | 분식·간편 | P1 |
| 68 | dumplings | 만두(찐/군) | 분식·간편 | P0 |
| 69 | jjinppang | 찐빵/호빵 | 분식·간편 | P2 |
| 70 | soondae_gukbap | 순대국밥 | 분식·간편 | P1 |
| 71 | pork_soup_rice | 돼지국밥 | 분식·간편 | P0 |
| 72 | kimbap_triangle | 삼각김밥 | 분식·간편 | P1 |
| 73 | convenience_lunchbox | 도시락(시판) | 분식·간편 | P1 |
| 74 | apple | 사과 | 과일·유제품 | P0 |
| 75 | banana | 바나나 | 과일·유제품 | P0 |
| 76 | orange | 귤/오렌지 | 과일·유제품 | P0 |
| 77 | grape | 포도 | 과일·유제품 | P1 |
| 78 | strawberry | 딸기 | 과일·유제품 | P1 |
| 79 | watermelon | 수박 | 과일·유제품 | P1 |
| 80 | pear | 배 | 과일·유제품 | P1 |
| 81 | persimmon | 감 | 과일·유제품 | P2 |
| 82 | yogurt | 요거트 | 과일·유제품 | P1 |
| 83 | milk | 우유 | 과일·유제품 | P0 |
| 84 | soy_milk | 두유 | 과일·유제품 | P1 |
| 85 | americano | 아메리카노 | 음료 | P0 |
| 86 | latte | 카페라떼 | 음료 | P0 |
| 87 | juice | 과일주스 | 음료 | P1 |
| 88 | soft | 탄산음료 | 음료 | P1 |
| 89 | ion_drink | 이온음료 | 음료 | P2 |
| 90 | tofu | 두부(부침/조림) | 기타 주식 | P0 |
| 91 | jeon_kimchi | 김치전 | 기타 주식 | P0 |
| 92 | jeon_pajeon | 파전/해물파전 | 기타 주식 | P0 |
| 93 | haemul_bokkeum | 주꾸미/낙지볶음 | 기타 주식 | P1 |
| 94 | raw_fish | 회(모듬) | 기타 주식 | P1 |
| 95 | gimbap_mayo | 참치마요/샐러드김밥 | 기타 주식 | P1 |
| 96 | chicken_gangjeong | 닭강정 | 기타 주식 | P1 |
| 97 | jjigae_cheonggukjang | 청국장찌개 | 기타 주식 | P1 |
| 98 | bibim_naengmyeon | 비빔냉면 | 기타 주식 | P1 |
| 99 | fruit_cup | 컵과일/컷팅과일 | 과일·유제품 | P2 |

**우선순위 범례**
- **P0 (약 45종):** 1차 추출·학습 필수  
- **P1 (약 45종):** AI Hub 장수 충분하면 1차에 포함  
- **P2 (약 10종):** 장수 부족·혼동 심하면 2차로 미룸  

**추출·학습 운영 메모**
1. AI Hub 클래스명과 `class_key`/`표준 음식명` 매핑표를 별도 작성 (`aihub_name → class_key`).  
2. 종당 목표 **1,000장**을 기본으로 하고, 500장 미만이면 1차에서 제외 또는 유사 클래스와 병합.  
3. 국·찌개·나물류는 혼동이 크므로 val 혼동행렬을 보고 필요 시 대분류로 묶거나 Top-3 UX로 보완.  
4. `scripts/food-calorie/convert_aihub_to_yolo.py build-classes --top-k 100` 결과와 본 표를 교차 검증.  
5. 식약처/K-FIND 식품코드는 다운로드 후 `food_code` 컬럼을 매핑 테이블에 채운다.

머신 가독용 CSV 초안은 [`docs/food_mvp_100_classes.csv`](food_mvp_100_classes.csv) 에 동일 목록을 둔다.

---

## 4. 모델 추천: YOLOv8n vs YOLO26n

Gemini 등에서 자주 추천되는 **YOLOv8-nano**는 “검증된 시작점”이지만,  
**저사양 스마트폰 + Int8 양자화** 목표에는 **YOLO26n을 본선**으로 두는 것을 권장한다.

### 4.1 공식 벤치 비교 (COCO val, imgsz=640, Ultralytics)

| 항목 | YOLOv8n | YOLO26n | 차이 |
|------|---------|---------|------|
| mAP50-95 | 37.3 | **40.9** | +3.6p |
| 파라미터 | 3.2M | **2.4M** | −25% |
| FLOPs | 8.7B | **5.4B** | −38% |
| CPU ONNX (ms) | 80.4 | **38.9** | 약 **2.1×** 빠름 |
| T4 TensorRT (ms) | 1.47 | 1.7 | GPU는 비슷 |
| NMS 후처리 | 필요 | **기본 불필요** | 저사양·지연 안정에 유리 |
| DFL 헤드 | 있음 | **제거** | Int8·모바일 NPU에 유리 |

> 출처: [Ultralytics YOLOv8 vs YOLO26](https://docs.ultralytics.com/compare/yolov8-vs-yolo26)  
> 음식 도메인 파인튜닝 후 절대 수치는 달라질 수 있으나, **상대 격차 방향**은 참고 가치가 큼.

### 4.2 구조적 차이 (저사양 폰 관점)

| | YOLOv8n | YOLO26n |
|--|---------|---------|
| 포지션 | 2023 표준, 문서·예시 풍부 | 2026 Edge-first |
| 후처리 | NMS → 후보 많을수록 지연 변동 | End-to-End / NMS-free |
| 좌표 헤드 | DFL(분포) → Softmax류, Int8에 불리한 경우 | DFL 제거 → export·양자화 단순 |
| 권장 용도 | 베이스라인·A/B 비교 | **신규 CAMA 파이프라인 본선** |

### 4.3 결정

| 역할 | 모델 |
|------|------|
| **본선** | **YOLO26n** |
| 비교군(베이스라인) | YOLOv8n |
| 차선책 | YOLO11n (26n 이슈 시) |

학습 API(Ultralytics)가 동일하므로, 처음부터 26n으로 시작하고 v8n은 동일 데이터로 A/B만 돌리는 구성이 효율적이다.

---

## 5. 저사양 폰을 위한 경량화·양자화

목표가 “최신폰이 아닌 기기에서도 동작”이라면 아래를 **조합**한다.

| 수단 | 효과 | 권장 |
|------|------|------|
| 모델 선택 | 연산·메모리 감소 | YOLO26n |
| Int8 양자화 (PTQ) | 용량↓, NPU 활용↑ | Android TFLite Int8 / iOS CoreML Int8 |
| 입력 해상도 축소 | 지연 ∝ 대략 해상도² | 학습 640 → 배포 **416 또는 320** 추가 export |
| FP16 | 중간 타협 | Int8 품질 하락 시 중급기 폴백 |
| 클래스 수 축소 | 헤드·혼동 감소 | MVP 80~150종 |
| 단발 추론 | 발열·배터리 | **실시간 연속 추론 금지**, 촬영 후 1회 |

### 5.1 배포 순서

1. 음식 데이터로 YOLO26n 파인튜닝 → `best.pt` (FP32)
2. Export  
   - Android: `tflite` + `int8`  
   - iOS: `coreml` + `int8` (또는 `half`)
3. 동일 validation 세트로 FP32 vs Int8 **mAP·칼로리 오차** 비교
4. 중·저사양 실기기에서 목표: **1장당 약 1~2초 이내**
5. 부족하면 `imgsz=416/320` 모델을 앱에 함께 넣고, 기기 성능에 따라 선택

### 5.2 양자화 주의

- Int8은 희소 클래스·유사 한식(국/찌개)에서 오분류가 늘 수 있다.
- 캘리브레이션 세트에 **실제 촬영 조도·접시 사진**을 포함한다.
- UX에 **Top-3 후보 확인** UI를 둔다.

### 5.3 UX 권장 (양·오분류)

- MVP 칼로리: **표준 1인분 kcal** + 사용자 슬라이더(0.5 / 1 / 1.5인분)
- Phase 2: 세그멘테이션·깊이·참조물(카드/젓가락) 등으로 양 추정 고도화
- 실패 시 수동 음식 선택 폴백

---

## 6. 로컬 PC 학습 환경

### 6.1 권장 최소 스펙

| 항목 | 권장 |
|------|------|
| GPU | NVIDIA **12GB+ VRAM** (예: RTX 4070 Ti / 3080 이상) |
| RAM | 32GB+ |
| 디스크 | NVMe **2TB+** (원본 + 전처리 + 실험 로그) |
| OS | Ubuntu 22.04/24.04 + **CUDA 12.x** |
| 프레임워크 | Ultralytics + PyTorch |

> Mac(MPS)은 소규모 PoC만. **본학습은 NVIDIA Linux**를 권장.

### 6.2 실무 셋업 팁

- AI Hub JSON/XML → **YOLO txt** 라벨 변환 파이프라인
- `train / val / test` 고정 시드 스플릿
- 동의어·유사 음식 병합 사전 (혼동행렬 분석)
- 증강: 조명·각도·접시 배경을 실사용 사진에 맞춤
- 실험 관리: 동일 val로 **YOLO26n vs YOLOv8n** mAP·혼동행렬 비교
- 라이선스: AI Hub 이용 범위·상업 이용·가중치 배포와 **원본 이미지 재배포 분리**를 문서화

### 6.3 학습 규모 현실

- MVP: 종당 대략 **800~2,000장** 수준이면 nano 파인튜닝으로 시작 가능
- 수백만 장 전체를 한 번에 쓰면 전처리·스토리지·라벨 품질 관리 비용이 먼저 폭발한다

### 6.4 개발 PC 기준 (RTX 4060 Ti 16GB)

| 항목 | 값 |
|------|-----|
| GPU | **RTX 4060 Ti 16GB** (VRAM 여유로 batch 32 가능) |
| 1차 학습 (100종 × ~1,000장, epochs=100, imgsz=640) | 대략 **6~14시간** |
| 소규모 PoC (200장, 1~2종, epochs=50~100) | 대략 **10~40분** |
| Int8 export (416/320) | GPU당 **수 분~30분** (프로필 수에 따라) |
| 권장 batch | 4060 Ti 16GB → **batch=32** (OOM 시 16으로 하향) |

> 위 시간은 Ultralytics YOLO26n 기준 **감**이며, 디스크 I/O·증강·workers 설정에 따라 달라진다.

---

## 7. 서버·앱 연동 개요

### 7.1 폰 → 서버 페이로드 (예시)

```json
{
  "items": [
    {
      "classId": "kimchi_jjigae",
      "foodCode": "D000123",
      "confidence": 0.91,
      "portionFactor": 1.0,
      "bbox": [0.12, 0.20, 0.55, 0.70]
    }
  ],
  "clientModel": "yolo26n-int8-416",
  "capturedAt": "2026-07-27T11:00:00+09:00"
}
```

- `foodCode`는 온디바이스 매핑 테이블 또는 서버 매핑 중 하나로 통일
- **이미지 바이너리는 포함하지 않음**

### 7.2 서버 책임

- 식품코드 → 영양성분 조회
- `portionFactor` 반영 kcal/매크로 합산
- 환자 프로필·질환·일일 목표 대비 가이드 문구
- 식사 기록 저장 (기존 CAMA 식습관/건강 데이터와 연계 가능)

### 7.3 앱 연동 (cama-plus-app)

- Android: TFLite / NNAPI
- iOS: Core ML / ANE
- 기존 `CamaNativeBridge` 패턴으로 `analyzeFoodImage` 등 네이티브 메서드 추가 후 WebView에 결과 이벤트 전달

---

## 8. 단계별 로드맵 (권장)

| 단계 | 가안 기간 | 산출물 | 성공 기준 |
|------|-----------|--------|-----------|
| **0. 범위 확정** | 1~2주 | 다빈도 음식 100종 목록 + 식품코드 매핑 초안 | 매핑률 ≥ 90% |
| **1. 데이터** | 2~4주 | AI Hub 승인·다운로드·YOLO 변환·스플릿 | 라벨 검수 샘플 오류율 &lt; 5% |
| **2. 학습 PoC** | 2~3주 | YOLO26n 베이스라인(7A) + s→n KD(7B) + Int8 | val mAP·혼동 Top + 7A vs 7B 승자 |
| **3. 서버 API** | 2주 | 텍스트 → 영양조회 → 가이드 API | 이미지 없이 E2E 가이드 응답 |
| **4. 양자화·앱 연동** | 3~4주 | Android/iOS 온디바이스 추론 + 브릿지 | 중·저사양 1장 ≤ 1~2s, 발열 허용 |
| **5. UX·고도화** | 지속 | 양 보정·오분류 피드백·히스토리 | 사용자 수정률·가이드 만족 지표 |

---

## 9. 리스크와 완화

| 리스크 | 완화 |
|--------|------|
| **양(分量) 추정 오차** | MVP는 표준 1인분 + 슬라이더; 이후 세그/깊이/참조물 |
| **한식 시각 혼동** (국·찌개·나물) | 계층 분류, Top-3 후보 UI, 클래스 병합 |
| **AI Hub 라이선스** | 약관 문서화, 가중치와 원본 이미지 재배포 분리 |
| **의료 표현** | “추정·참고” 고지, 기존 CAMA 코칭 정책과 정렬 |
| **Int8 품질 하락** | 실사용 캘리브레이션, FP16/해상도 폴백 프로필 |

---

## 10. 바로 실행할 결정 요약

1. **본선 배포 모델: YOLO26n** (학습 비교군: YOLOv8n 선택)
2. **정밀도 보강: YOLO26s → YOLO26n Knowledge Distillation (KD)** — 폰 추론 속도 변화 없음
3. **배포: Int8 양자화** + 저사양용 **imgsz 320/416** 프로필
4. **데이터: AI Hub 이미지·BBox + 식약처 영양 DB**
5. **MVP 클래스: 다빈도 80~150종**
6. **폰 → 서버: 텍스트만** (이미지 미전송)
7. **학습 PC: NVIDIA 12GB+ / Ubuntu + CUDA** (실사용: RTX 4060 Ti 16GB)
8. **칼로리: DB 조회 정본** + 사용자 양 보정

### 다음 액션 (실행 순서)

1. **수동** — AI Hub **71564** 신청·승인·다운로드 (런북 Step 2)  
2. **수동+반자동** — 100종 매핑표 확정 (런북 Step 3)  
3. **Cursor** — 종당 1,000장 추출 + YOLO 변환 (런북 Step 4~5)  
4. **수동** — 라벨 스팟 검수 (런북 Step 6)  
5. **Cursor** — YOLO26n 베이스라인 학습 (런북 Step **7A**)  
6. **Cursor** — YOLO26s Teacher + YOLO26n KD (런북 Step **7B**, 권장)  
7. **Cursor** — 승자 1개만 Int8 416/320 export (런북 Step 8)  
8. 이후 Step 9~12 (약한 종 보강 → 서버 → 앱 → 실기기)

> Cursor에게는 런북을 **먼저 읽게** 한 뒤 지정 Step만 실행시킨다. 프롬프트는 런북 §0.2 · 본 문서 §16.4 참고.

---

## 11. 참고 링크

- [Ultralytics YOLO26](https://docs.ultralytics.com/models/yolo26)
- [YOLOv8 vs YOLO26 비교](https://docs.ultralytics.com/compare/yolov8-vs-yolo26)
- [AI Hub](https://www.aihub.or.kr/)
- [K-FIND 식품영양성분 DB](https://various.foodsafetykorea.go.kr/nutrient)
- [공공데이터포털](https://www.data.go.kr/) (검색: `식품영양성분 통합`)
- 전처리 스크립트: [`scripts/food-calorie/convert_aihub_to_yolo.py`](../scripts/food-calorie/convert_aihub_to_yolo.py)
- **학습 실행 런북 (Step-by-Step):** [`CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md`](./CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md)
- [Ultralytics Knowledge Distillation](https://docs.ultralytics.com/guides/knowledge-distillation)
- **작업 주체·자동화 구분:** 본 문서 §16
- **학습 데이터·추가학습 전략:** 본 문서 §15
- **정밀도·속도 최적화 (KD 포함):** 본 문서 §17

---

## 12. AI Hub 음식 이미지 다운로드 안내

> AI Hub는 **로그인 → 데이터셋별 다운로드 신청 → 승인 후** API/파일 목록 다운로드가 가능하다.  
> 공개 직링크(무인증 CDN)는 제공되지 않으며, 아래는 **데이터셋 소개·신청 페이지 URL**이다.  
> ※ 내국인 신청 중심. 보건의료 성격 데이터는 안심존 절차가 필요할 수 있다.

### 12.1 추천 데이터셋 (학습용)

| 우선순위 | dataSetSn | 명칭(요약) | 규모(소개 기준) | 라벨 | 소개/신청 페이지 |
|----------|-----------|------------|-----------------|------|------------------|
| **1 (MVP 권장)** | **71564** | 비전영역 음식이미지 및 정보(고도화) | 약 **800종 / 23만 장**, jpg+json | 2D BBox + 영양·중량 메타 | [열기](https://www.aihub.or.kr/aihubdata/data/view.do?aihubDataSe=data&currMenu=115&dataSetSn=71564&topMenu=100) |
| **2** | **71392** | 당뇨관리 앱 음식 이미지·BBox | 약 **204종 / 50만+ 장** 규모 | BBox(JSON), 일부 좌표 정규화 | [열기](https://www.aihub.or.kr/aihubdata/data/view.do?dataSetSn=71392) |
| **3** | **74** | 음식 이미지 및 영양정보 텍스트(초기 구축) | 400종+ / 약 84만 장 규모(소개) | json/xml + 영양 메타 | [열기](https://www.aihub.or.kr/aihubdata/data/view.do?aihubDataSe=data&currMenu=11&dataSetSn=74&topMenu=) |

검색 팁: AI Hub 상단 **데이터 찾기**에서 `음식 이미지`, `바운딩박스`, `영양정보`로 검색.

### 12.2 다운로드 절차

1. [AI Hub](https://www.aihub.or.kr/) 회원 로그인  
2. 위 데이터셋 페이지 진입 → **다운로드 / 관심 데이터 / 활용 신청**  
3. 승인 완료 후 **파일 목록 (API 다운로드)** 에서 분할 zip 수신  
4. 리눅스에서 part 파일 병합 후 압축 해제:

```bash
# 예: 다운로드 폴더에서 part 병합
DATASET_DIR="/data/aihub/71564"
PART_PREFIX="음식이미지"   # 실제 part 파일명에 맞게 수정

find "$DATASET_DIR" -name "${PART_PREFIX}*.zip.part*" -print0 \
  | sort -zt'.' -k2V \
  | xargs -0 cat > "${DATASET_DIR}/${PART_PREFIX}.zip"

unzip "${DATASET_DIR}/${PART_PREFIX}.zip" -d "${DATASET_DIR}/raw"
```

> Windows는 WSL 권장. 병합 결과가 0바이트면 경로/파일명 glob을 다시 확인.

### 12.3 71564 JSON 스키마(요약)

탐지 학습에 쓰는 핵심 필드:

| 경로 | 의미 | YOLO 변환 시 |
|------|------|--------------|
| `data.image_info.file_name` | 이미지 파일명 | 이미지 경로 매칭 |
| `data.image_info.width` / `height` | 픽셀 크기 | 정규화 분모 |
| `data.image_info.weight` / `s_weight` | 실중량·1인분 표준중량(g) | 서버/양추정 메타(탐지 라벨에는 미포함) |
| `data.2d_annotation.x,y,width,height` | **픽셀** BBox (좌상단 x,y + w,h) | YOLO `cx cy w h` (0~1) |
| `data.nutrition.*` | 에너지·탄단지 등 | 서버 DB 보조 / 매핑 검증 |
| `data.food_type.fc` 등 | 음식 분류 문자열 | `class_id` 매핑 키 |

> 실제 JSON 키 nesting은 배포본마다 `data` 래핑 여부·리스트형 annotation 차이가 있을 수 있다.  
> 샘플 1건을 `jq`/`python`으로 확인한 뒤 변환 스크립트의 키 경로를 맞춘다.

### 12.4 71392 라벨 특징(요약)

소개 문서 기준 속성 예:

| 속성 | 의미 |
|------|------|
| `Code Name` | 원천 파일명 |
| `Name` | 음식 클래스명 (약 204종) |
| `W`, `H` | BBox 폭·높이 (**이미 0~1 정규화**일 수 있음) |
| `Point(x,y)` | BBox 중점 (**0~1**) |

이미 정규화된 중점+크기를 쓰면 YOLO 변환은 `cx,cy,w,h`를 거의 그대로 쓰면 된다.  
픽셀 좌표인지 정규화인지 **반드시 샘플로 확인**할 것.

### 12.5 식약처 영양 DB (서버용)

| 구분 | URL |
|------|-----|
| K-FIND 식품영양성분 DB | https://various.foodsafetykorea.go.kr/nutrient |
| 영양성분 DB 내려받기 | https://various.foodsafetykorea.go.kr/nutrient/general/down/list.do |
| Open API 안내 | https://various.foodsafetykorea.go.kr/nutrient/industry/openApi/info.do |
| 공공데이터포털 검색 | https://www.data.go.kr/ (검색: `식품영양성분 통합`) |

서버에는 식품코드·식품명·100g당 에너지/탄단지 등을 적재하고, 온디바이스 `classId`와 매핑 테이블로 연결한다.

---

## 13. JSON → YOLO 텍스트 전처리

### 13.1 YOLO 라벨 포맷

이미지 `foo.jpg`에 대응하는 `foo.txt` (한 줄 = 객체 1개):

```text
class_id cx cy w h
```

- `class_id`: 0 이상 정수 (names 리스트 인덱스)  
- `cx, cy, w, h`: 이미지 너비·높이로 나눈 **0~1 정규화** 값  
- 여러 음식이면 여러 줄

Ultralytics 데이터셋 레이아웃 예:

```text
datasets/food_mvp/
  images/train/  *.jpg
  images/val/    *.jpg
  labels/train/  *.txt
  labels/val/    *.txt
  data.yaml
  classes.json      # class_name -> id
```

`data.yaml` 예:

```yaml
path: /data/datasets/food_mvp
train: images/train
val: images/val
names:
  0: kimchi_jjigae
  1: doenjang_jjigae
  # ...
```

### 13.2 좌표 변환 공식

픽셀 BBox `(x, y, bw, bh)` → YOLO:

```text
cx = (x + bw / 2) / img_w
cy = (y + bh / 2) / img_h
w  = bw / img_w
h  = bh / img_h
```

클리핑: 모든 값을 `[0, 1]`로 clamp.

### 13.3 변환 스크립트 (기본 코드)

저장 위치: [`scripts/food-calorie/convert_aihub_to_yolo.py`](../scripts/food-calorie/convert_aihub_to_yolo.py)

핵심 로직(요약):

```python
def xywh_pixel_to_yolo(x, y, w, h, img_w, img_h):
    cx = (x + w / 2.0) / img_w
    cy = (y + h / 2.0) / img_h
    nw = w / img_w
    nh = h / img_h
    def clip(v):
        return max(0.0, min(1.0, v))
    return clip(cx), clip(cy), clip(nw), clip(nh)
```

71564형(픽셀 BBox) / 71392형(정규화 중점) 모두 처리하도록 스크립트에 `--schema auto|71564|71392` 옵션을 둔다.

실행 예:

```bash
cd /path/to/cama-cafe24

# 1) 클래스 목록 생성(음식명 빈도 상위 N종만 MVP로)
python scripts/food-calorie/convert_aihub_to_yolo.py build-classes \
  --raw-dir /data/aihub/71564/raw \
  --schema 71564 \
  --top-k 120 \
  --out datasets/food_mvp/classes.json

# 2) YOLO 라벨·이미지 심볼릭/복사 + train/val 분할
python scripts/food-calorie/convert_aihub_to_yolo.py convert \
  --raw-dir /data/aihub/71564/raw \
  --schema 71564 \
  --classes datasets/food_mvp/classes.json \
  --out datasets/food_mvp \
  --val-ratio 0.1 \
  --seed 42

# 3) data.yaml 생성
python scripts/food-calorie/convert_aihub_to_yolo.py write-yaml \
  --out datasets/food_mvp \
  --classes datasets/food_mvp/classes.json
```

> 실제 AI Hub 압축 해제 폴더 구조는 데이터셋마다 다르다.  
> 스크립트는 `**/*.json`을 재귀 탐색하고, 같은 stem의 `.jpg/.png`를 찾는다.  
> 경로가 어긋나면 `--image-root`로 이미지 루트를 지정한다.

### 13.4 변환 후 검수 체크리스트

- [ ] `labels/*.txt` 줄 수 ≈ 이미지 내 객체 수  
- [ ] `cx,cy,w,h` 모두 0~1  
- [ ] 빈 라벨(객체 0) 비율이 비정상적으로 높지 않은지  
- [ ] `classes.json` 음식명 ↔ 식약처 코드 매핑 초안 작성  
- [ ] 샘플 20장을 그려서 BBox 시각 검수 (스크립트 `preview` 옵션)

---

## 14. YOLO26n 학습·Export 기본 커맨드

### 14.1 환경

```bash
# Ubuntu + CUDA 12.x 권장
python -m venv .venv && source .venv/bin/activate
pip install -U ultralytics
# GPU 확인
python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

### 14.2 학습 (Step 7A · 베이스라인)

```bash
# 4060 Ti 16GB → batch=32 권장 (OOM 시 16)
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

비교군(선택):

```bash
yolo detect train model=yolov8n.pt data=datasets/food_mvp/data.yaml \
  epochs=100 imgsz=640 batch=32 device=0 project=runs/food name=yolov8n_mvp_1000
```

### 14.3 Knowledge Distillation (Step 7B · 권장)

정밀도↑ · **폰 추론 속도 변화 없음**. Teacher는 학습용만, 배포는 Student(n)만.

```bash
# 1) Teacher (같은 음식 data.yaml)
yolo detect train \
  model=yolo26s.pt \
  data=datasets/food_mvp/data.yaml \
  epochs=100 imgsz=640 batch=16 device=0 \
  project=runs/food name=yolo26s_teacher
```

```python
# 2) Student + KD
from ultralytics import YOLO

teacher = "runs/food/yolo26s_teacher/weights/best.pt"
student = YOLO("yolo26n.pt")
student.train(
    data="datasets/food_mvp/data.yaml",
    epochs=100,
    imgsz=640,
    batch=24,
    device=0,
    project="runs/food",
    name="yolo26n_kd",
    distill_model=teacher,
    dis=6.0,
)
```

- Teacher·Student는 **같은 YOLO26 family** (교차 세대 미지원)
- Teacher는 COCO pretrained가 아니라 **음식 MVP로 학습한 `best.pt`**
- 공식 권장 페어: **n ← s** (n ← l/x는 비권장)
- 학습 시간 약 **1.2~1.5×**, 추론 비용 **0 추가**

### 14.4 검증·Export (모바일 · Step 8)

7A vs 7B 비교 후 **승자 1개**만 export:

```bash
# 예: KD 승자
BEST=runs/food/yolo26n_kd/weights/best.pt
# 또는 베이스라인: BEST=runs/food/yolo26n_mvp_1000/weights/best.pt

yolo detect val model=$BEST data=datasets/food_mvp/data.yaml

yolo export model=$BEST format=tflite imgsz=416 int8=True data=datasets/food_mvp/data.yaml
yolo export model=$BEST format=tflite imgsz=320 int8=True data=datasets/food_mvp/data.yaml
yolo export model=$BEST format=coreml imgsz=416 int8=True
```

---

## 15. 학습 데이터·학습 방식 설계 원칙

### 15.1 “이미지가 많으면 정확도가 떨어진다”는 말에 대해

**절반만 맞다.** 문제는 “장수” 자체가 아니라 아래 조합이다.

| 원인 | 설명 |
|------|------|
| **클래스 불균형** | 김치찌개 5만 장 vs 희소 음식 50장 → 희소 클래스 무시 |
| **중복·저품질** | 거의 같은 각도·조명만 반복 → 과적합, 일반화 저하 |
| **라벨 노이즈** | BBox 어긋남·오표기가 많으면 많을수록 학습 방해 |
| **도메인 불일치** | AI Hub 스튜디오 촬영 vs 실제 식탁 사진 → 장수만 늘려도 실사용 개선 없음 |
| **전처리 비용** | 수백만 장 한 번에 넣으면 검수·스토리지·학습 시간이 먼저 폭발 |

**실무 권장:** 다빈도 클래스부터 **종당 800~1,200장의 양질·다양성** 확보 → 배포 후 오분류 수집 → **선별 추가**.

### 15.2 1차 학습 vs 추가 학습 vs 재학습

| 방식 | 언제 | 데이터 | 시간 감 | 비고 |
|------|------|--------|---------|------|
| **1차 전체 학습** | MVP 100종 첫 구축 | 전체 ~10만 장 | 6~14h (4060 Ti) | `yolo26n.pt`에서 시작 |
| **추가 학습 (fine-tune)** | 약한 20~30종만 보강 | 해당 종 +200~500장 | 1~4h (epochs 30~50) | `best.pt`에서 이어서 — **처음부터 아님** |
| **재학습 (full retrain)** | 클래스 대폭 변경·매핑 전면 수정 | 전체 데이터셋 재구성 | 1차와 비슷 | 새 `data.yaml`·클래스 목록일 때 |

**핵심:** 추가 학습은 **이미 학습된 가중치(`best.pt`)에서 이어서** 하므로, 1차 100 epoch 전체를 다시 돌리는 것보다 **훨씬 짧다**.  
다만 **새 클래스를 대량 추가**하거나 **기존 클래스 정의를 바꾸면** 사실상 재학습에 가깝다.

### 15.3 실무 권장 운영 루프

```
1차: P0 다빈도 × 종당 ~1,000장 → YOLO26n 베이스라인 (Step 7A)
  ↓
(권장) YOLO26s Teacher → YOLO26n KD (Step 7B) → 승자 Int8 배포
  ↓
실기기 오분류·혼동행렬 분석
  ↓
약한 20~30종만 +200~500장 추출 → fine-tune (epochs 30~50)
  ↓
(필요 시) P1/P2 클래스 확장 → 데이터 병합 후 재학습 또는 단계적 fine-tune
```

- **한 번에 전 종을 최대 장수로 학습하지 않는다.** 다빈도·품질 우선.
- 국·찌개·나물 등 시각 유사 클래스는 **혼동행렬 기반**으로 보강 대상을 고른다.
- KD는 **정밀도만** 보강하고 폰 속도는 nano 그대로다. 상세는 §17.

---

## 16. 작업 주체 구분 (수동 / 반자동 / 자동)

학습·배포 파이프라인에서 **누가 무엇을 해야 하는지**를 미리 고정한다.  
상세 실행 순서는 [`CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md`](./CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md)를 따른다.

### 16.1 범례

| 표시 | 의미 | 사람이 하는 일 |
|------|------|----------------|
| **수동** | 처음부터 끝까지 사람 필수 | AI Hub 로그인·신청, 매핑 확정, 육안 검수, 실기기 테스트 |
| **반자동** | 스크립트 실행 + 사람 확인 | 경로·옵션 확인, 결과 리포트 검토, 일부 판단(제외/보강) |
| **자동·Cursor** | 명령 한 번으로 반복 가능 | 변환·학습·export·코드 스캐폴딩 (Cursor에 위임 가능) |

> **반자동 ≠ 전부 손작업.** 스크립트/Cursor가 대부분 실행하고, **확인·결정만** 사람이 한다.

### 16.2 단계별 주체 요약

| Step | 내용 | 주체 | 사람이 할 일 (요약) |
|------|------|------|---------------------|
| 1 | 환경·폴더 준비 | 반자동 | CUDA 동작 확인, venv·경로 확인 (10~30분) |
| 2 | AI Hub 신청·다운로드·해제 | **수동** | 로그인, 승인 대기, zip 수신·해제 |
| 3 | 100종 ↔ AI Hub 매핑표 | 수동 → 반자동 | 스크립트 초안 검토 후 **매핑 확정** |
| 4 | 종당 ~1,000장 추출 | 반자동 / 자동 | 클래스별 count 리포트 확인, 부족 종 처리 결정 |
| 5 | JSON → YOLO 변환 | 자동·Cursor | (거의 없음) 완료 후 폴더 구조만 확인 |
| 6 | 라벨 스팟 검수 | **수동** | 클래스당 2~3장, 전체 40~60장 육안 확인 |
| **7A** | YOLO26n 베이스라인 학습 | 자동·Cursor | 결과 mAP·혼동행렬 확인 |
| **7B** | YOLO26s→n KD 학습 (권장) | 자동·Cursor | 7A 대비 개선폭 확인, 승자 선택 |
| 8 | 승자 Int8 export (416/320) | 자동·Cursor | 산출물·용량 확인 |
| 9 | 약한 종 추가 학습 | 반자동 | **어떤 20~30종을 더 학습할지** 선택 |
| 10 | 서버 영양·가이드 API | 설계 수동 → 구현 자동 | API 스펙 확정 후 Cursor 구현 |
| 11 | 앱 온디바이스 연동 | 자동·Cursor | 실기기 빌드·설치는 사람 |
| 12 | 실기기 피드백 루프 | 수동 + 자동 | 촬영·오분류 기록; 재학습 큐는 스크립트 |

### 16.3 권장 진행 순서 (처음 시작 시)

1. **수동** — AI Hub 데이터셋 **71564** (필수) 신청·다운로드 (Step 2)  
2. **수동 + 반자동** — 100종 매핑표 확정 (Step 3)  
3. **Cursor 위임** — Step 4~5 (추출·YOLO 변환)  
4. **수동** — 라벨 스팟 검수 (Step 6)  
5. **Cursor 위임** — Step **7A** (n 베이스라인) → **7B** (s→n KD) → **8** (승자 Int8)  
6. 이후 서버/앱 연동·실기기 검증

### 16.4 Cursor에 맡길 때 프롬프트 예시

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 를 먼저 읽고,
지정한 Step만 순서대로 실행해줘.
실행 전 필요한 입력값(경로/파일명)만 물어보고,
실행 후에는 산출물 경로와 검증 결과를 체크리스트로 보고해줘.
대용량 데이터(data/aihub, datasets, runs, exports)는 git 커밋하지 마.
```

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 를 읽고 Step 4~6을 실행해줘.
- 입력: AI Hub raw 경로, food_mvp_100_classes.csv
- 출력: subset, class별 count CSV/MD, 스팟검수용 이미지
```

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 를 읽고 Step 7A를 실행해줘.
- YOLO26n 베이스라인 학습 + mAP/혼동행렬 요약
```

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 를 읽고 Step 7B를 실행해줘.
- YOLO26s teacher → YOLO26n KD (distill_model, dis=6.0)
- Step 7A 대비 비교표 + 승자 경로를 Step 8에 전달
```

```text
docs/CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md 를 읽고 Step 8을 실행해줘.
- 승자 모델 Int8 416/320 + CoreML export, 파일명 규칙 통일
```

```text
Step 10: class_key→food_code 매핑 CSV 로더와
영양 조회·가이드 응답 API 스켈레톤을 cama-plus-server에 추가해줘.
```

### 16.5 단계별 산출물 경로

```text
data/aihub/raw/                      # AI Hub 원본
data/aihub/mapped/                   # 클래스 매핑·필터 결과
datasets/food_mvp/                   # YOLO images/labels + data.yaml
runs/food/yolo26n_mvp_1000/weights/  # 7A baseline best.pt
runs/food/yolo26s_teacher/weights/   # 7B teacher best.pt
runs/food/yolo26n_kd/weights/        # 7B student best.pt (배포 후보)
exports/                             # tflite/coreml int8
docs/food_mvp_100_classes.mapped.csv # AI Hub명 ↔ class_key ↔ 식약처코드
```

> `data/aihub/`, `datasets/`, `runs/food/`, `exports/` 는 `.gitignore` 대상 — GitHub에 원본·대용량 산출물을 올리지 않는다.

---

## 17. 정밀도↑ + 저사양 속도 유지 전략

### 17.1 한 줄 조합

```text
YOLO26n + 양질 데이터 + (권장) YOLO26s→n KD + Int8 + imgsz 416
```

| 목표 | 담당 수단 | 폰 속도 |
|------|-----------|---------|
| 정밀도↑ | 데이터 품질, KD, 약한 종 fine-tune | **변화 없음** |
| 속도 유지 | YOLO26n 배포 고정, Int8, imgsz 416/320 | **본선** |

### 17.2 우선순위

| 우선 | 방법 | 비고 |
|------|------|------|
| **P0** | 종당 800~1,200장 양질·라벨 검수 | 보통 KD보다 효과 큼 |
| **P0** | 배포 YOLO26n + Int8 416 (320 폴백) | 저사양 속도 본선 |
| **P1** | KD n←s (같은 음식 Teacher) | Ultralytics `distill_model` |
| **P1** | 약한 20~30종 fine-tune | 혼동행렬 기준 |
| **P2** | Progressive m→s→n / QAT | 일정·VRAM↑ 또는 Int8 이슈 시 |
| **비권장** | 폰에 Large 배포, n←l/x 강제 | 속도↓ 또는 효율 낮음 |

### 17.3 사용자·Cursor 실행 흐름

```text
Step 1~3  환경·AI Hub·매핑          [수동/반자동]
Step 4~6  추출·변환·스팟 검수        [Cursor + 수동 검수]
Step 7A   YOLO26n 베이스라인         [Cursor]
Step 7B   YOLO26s Teacher + n KD    [Cursor · 권장]
Step 8    승자 1개 Int8 export       [Cursor]
Step 9    약한 종 fine-tune          [반자동]
Step 10~12 서버·앱·실기기            [Cursor + 수동]
```

상세 커맨드·완료 조건·복붙 프롬프트: [`CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md`](./CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md) §0.1 · §0.2 · Step 7A/7B/8.

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-07-27 | 초안 작성: 아키텍처, 데이터, YOLO26n 추천, 양자화·로드맵 |
| 2026-07-27 | AI Hub 다운로드 링크·JSON→YOLO 전처리·YOLO26n 학습 커맨드 추가 |
| 2026-07-27 | 1차 학습 다빈도 100종 초안 목록·CSV 추가 |
| 2026-07-27 | 학습 Step 런북 문서 링크 추가 (`CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md`) |
| 2026-07-27 | §15 학습 데이터·방식 원칙, §16 작업 주체(수동/반자동/자동), §6.4 4060 Ti 학습 시간 감 추가 |
| 2026-07-27 | §14 KD·7A/7B, §16 Step 동기화, §17 정밀도·속도 전략, 다음 액션·Cursor 프롬프트 동기화 |
