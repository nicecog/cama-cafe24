# CAMA Plus · 음식 사진 칼로리 기록 — 앱·서버 상세 설계

> 작성일: 2026-08-08
> 상위 기획: [CAMAPLUS_FOOD_CALORIE_ONDEVICE_PLAN.md](./CAMAPLUS_FOOD_CALORIE_ONDEVICE_PLAN.md)
> 학습 런북: [CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md](./CAMAPLUS_FOOD_CALORIE_TRAINING_RUNBOOK.md)
> 범위: 온디바이스 추론 → 목록 정리 → 칼로리 계산 → 서버 저장까지의 구현 설계

---

## 1. 목표와 완료 기준

사용자가 폰 카메라로 음식을 촬영하면:

1. **기기 내부**에서 학습된 모델이 음식을 탐지한다. (이미지 외부 전송 없음)
2. 탐지 결과를 **음식 목록으로 정리**하고 즉시 **칼로리 미리보기**를 보여준다.
3. 사용자가 후보 교체·양(分量) 보정 후 확정한다.
4. 서버가 **정본 영양 DB로 재계산**하고 식사 기록을 저장한다.

| 완료 기준 | 목표 |
|-----------|------|
| 온디바이스 추론 | 중·저사양 1장 **≤ 1.5s** (416), 폴백 320 |
| 오프라인 | 네트워크 없이 촬영·목록·미리보기 kcal 동작, 이후 동기화 |
| 저장 정합성 | 동일 요청 재시도 시 **중복 저장 0건** |
| 데이터 최소화 | 서버로 **이미지 바이너리 미전송** |
| 이력 안정성 | 영양 DB 갱신 시 **과거 기록 값 불변** |

---

## 2. 신뢰 경계 (가장 중요한 설계 결정)

> **칼로리 숫자의 정본은 서버다. 클라이언트가 보낸 kcal은 저장하지 않는다.**

| 주체 | 책임 | 신뢰 |
|------|------|------|
| **온디바이스 모델** | 음식이 **무엇인지**(classKey), confidence, 개수, bbox | 신뢰 (분류만) |
| **온디바이스 경량 테이블** | 즉시 표시용 **kcal 미리보기** | 표시 전용, 저장 안 함 |
| **사용자** | 후보 교체, `portionFactor`, `quantity`, 식사 구분 | 신뢰 (의도) |
| **서버 영양 DB** | grams·kcal·탄단지 **정본 계산** | 유일한 정본 |

이유: 클라이언트 kcal을 그대로 저장하면 앱 버전별 테이블 차이·조작으로 의료성 데이터가 오염된다. 클라이언트 미리보기 값은 `client_kcal_preview` 컬럼에 **드리프트 모니터링용으로만** 남긴다.

---

## 3. 전체 흐름

```
[SPA]  촬영 버튼
  → requestNativeAnalyzeFoodImage()          (bridge)
     ↓
[RN]  CamaNativeBridge.analyzeFoodImage()
     ↓
[Native]  카메라 촬영 → EXIF 정규화 → letterbox 전처리
          → TFLite Int8 (Android) / CoreML Int8 (iOS)
          → 디코드 → 임계값 → 클래스 집계
          → 번들 catalog로 kcal 미리보기 부착
     ↓ (이미지 바이너리는 여기서 폐기)
[RN]  respond({ type: 'foodImageAnalysis', ok: true, items, modelVersion, ... })
     ↓
[SPA]  목록 UI (후보 교체 / 인분 슬라이더 / 식사 구분)
  → POST /api/nutrition/meal/estimate        (저장 없이 서버 정본 계산)
  → 사용자 확정
  → POST /api/nutrition/meal                 (clientLogId 멱등 저장)
     ↓
[Server]  classKey → foodCode → 영양 조회 → grams·kcal 계산
          → 항목별 영양 스냅샷과 함께 저장 → 가이드 문구 반환
```

**핵심:** 서버 왕복은 **추론 이후 텍스트만** 발생한다. 추론 자체는 네트워크와 무관하다.

---

## 4. 온디바이스 계층

### 4.1 모델 자산

학습 산출물(`\\192.168.150.2\휴딧workspace\food_학습\결과`)을 앱 자산으로 배치한다.

| 파일 | 플랫폼 | 배치 경로 | 용량 |
|------|--------|-----------|------|
| `yolo26n-kd-416-int8.tflite` | Android | `android/app/src/main/assets/foodvision/` | 2.89 MB |
| `yolo26n-kd-320-int8.tflite` | Android | 동일 | 2.88 MB |
| `yolo26n-kd-416-int8.mlpackage` | iOS | Xcode 번들 리소스 | ~2.7 MB |
| `food_catalog.v1.json` | 공통 | 각 플랫폼 assets | ~20 KB |

#### 클래스 수 — 카탈로그 100종 ≠ 모델 62종

`docs/food_mvp_100_classes.mapped.csv` 의 100종 중 학습 데이터가 확보된
**62종만 모델에 포함**되었고(`status` 가 `empty`·`very_low` 인 38종 제외),
모델 출력 인덱스는 그 62종에 **0..61 로 새로 부여**되었다.

따라서 모델 인덱스의 정본은 `food_mvp_val/data.yaml` 의 `names` 이며,
**CSV `id` 나 DB `cm_food_class.class_id`(0..99)와 일치하지 않는다.**
CSV 순서로 매핑하면 모든 탐지 결과가 다른 음식으로 오인된다.

| 값 | 범위 | 용도 |
|----|------|------|
| 모델 출력 인덱스 | 0..61 | 온디바이스 디코딩 전용 (`data.yaml`) |
| `cm_food_class.class_id` | 0..99 | DB 카탈로그 PK (CSV `id`) |
| `class_key` | 문자열 | **브릿지·서버 전송의 유일한 식별자** |
| `model_index` (mapped.csv) | 0..61 또는 빈칸 | 해당 클래스가 모델에 있는지 표시 |

브릿지와 서버 API 는 처음부터 `classKey` 만 주고받으므로 서버 측 영향은 없다.
카탈로그에 없는 38종은 수동 추가(음식 검색)로만 기록된다.

**38종을 모델에 넣는 “해결책”**: AI Hub 이름 목록으로 재매칭을 시도했으나
(`scripts/food-calorie/rematch_excluded_classes.py`) 유의미한 이미지 복구는 되지 않았다.
흰밥·나물·국 등은 AI Hub 파일명 목록에 단독 클래스로 거의 없다.
→ **추가 촬영·라벨링 후 재학습**이 유일한 확장 경로다. 당장 제품은 62종 인식 + 100종 수동 검색으로 동작한다.

`food_catalog.v1.json` — `scripts/food-calorie/build_food_catalog.py` 가
`data.yaml`(인덱스) + `deploy/sql/cafe24-nutrition-food-class-seed.sql`(영양 폴백)을
합쳐 생성한다. `classId` 는 모델 출력 인덱스다.

```json
{
  "catalogVersion": "1.0.0",
  "modelClassCount": 62,
  "classes": [
    {
      "classId": 0,
      "classKey": "gimbap",
      "nameKo": "김밥",
      "servingG": 230,
      "kcalPer100g": 145,
      "carbPer100g": 26.5,
      "proteinPer100g": 4.6,
      "fatPer100g": 2.8
    }
  ]
}
```

앱 시작 시 `classes.length` 와 모델 출력 채널 수(`4 + nc`)를 대조해
불일치면 `foodVision` capability 를 끈다.

### 4.2 프로필 선택 (성능 적응)

| 조건 | 선택 |
|------|------|
| 기본 | `416-int8` |
| RAM < 4GB 또는 최초 추론 > 1,800ms | `320-int8`로 강등 후 저장 |
| 사용자가 설정에서 강제 | 지정 프로필 고정 |

강등 결과는 로컬에 영구 저장하고, 앱 업데이트 시 재측정한다.

### 4.3 실측 텐서 규격 (확인 완료)

`scripts/food-calorie/inspect_tflite.py` · `probe_tflite_output.py` 로 실측한 값이다.
Int8 양자화 모델이지만 **입출력 경계는 float32 로 dequantize** 되어 있다.

| 항목 | 416 모델 | 320 모델 |
|------|----------|----------|
| 입력 | `[1, 3, 416, 416]` float32 | `[1, 3, 320, 320]` float32 |
| 레이아웃 | **NCHW** (NHWC 아님 → transpose 필요) | 동일 |
| 정규화 | RGB `/ 255.0` (0~1) | 동일 |
| 출력 | `[1, 66, 3549]` float32 | `[1, 66, 2100]` float32 |
| 앵커 수 | 52²+26²+13² = 3549 | 40²+20²+10² = 2100 |

출력 채널 66 = **bbox 4 + 클래스 62**.

| 채널 | 내용 |
|------|------|
| 0..3 | `cx, cy, w, h` — **입력 기준 0~1 정규화** (픽셀 아님) |
| 4..65 | 클래스별 sigmoid 점수 (0~1, 합이 1이 아닌 multi-label) |

**NMS 는 적용되어 있지 않다.** export 시 `nms=True` 를 주지 않았으므로 동일
객체가 10개 안팎의 인접 앵커로 중복 출력된다. 따라서 `FoodVisionDecoder` 에
class-wise NMS 를 반드시 둔다. (설계 초안의 "NMS-free" 가정은 실측으로 폐기)

Int8 양자화 때문에 **점수 상한이 약 0.944** 다. 1.0 에 도달하지 않으므로
임계값을 이 상한 기준으로 해석한다 (0.35 채택 / 0.5 UI 경고는 그대로 유효).

### 4.3.1 처리 파이프라인

| 단계 | 규격 |
|------|------|
| 촬영 | 장변 1280 축소, `quality 0.8`, EXIF 회전 정규화 |
| 전처리 | letterbox(패딩 114) → RGB float32 `/255` → HWC→CHW transpose |
| 가속 | Android: NNAPI → GPU delegate → CPU 4스레드 순서 폴백 / iOS: `MLComputeUnits.all` |
| 임계값 | 채택 `conf ≥ 0.35`, 후보(Top-3) `conf ≥ 0.20` |
| NMS | class-wise, IoU 0.45 |
| 좌표 복원 | 정규화 → 입력 픽셀 → letterbox 패딩·스케일 역산 → 원본 픽셀 |
| 최대 항목 | 기본 8개 (`maxItems`) |

### 4.4 목록 집계 규칙

동일 음식이 여러 박스로 잡히는 경우를 **1개 항목 + quantity**로 정리한다.

1. `classKey`로 그룹핑
2. 그룹 내 박스 수 → `quantity` (단, 서로 IoU > 0.6이면 동일 객체로 보고 1로 축약)
3. 그룹 대표 `confidence` = 최댓값
4. 정렬 = `confidence × bboxArea` 내림차순
5. 각 항목에 차선 후보 상위 2개를 `candidates`로 부착 (한식 혼동 대응)

### 4.5 미리보기 kcal (표시 전용)

```
grams   = servingG × portionFactor × quantity
kcalPreview = round(kcalPer100g × grams / 100)
```

`portionFactor` 기본값 1.0. 서버 응답이 오면 화면 값은 서버 값으로 **덮어쓴다**.

---

## 5. 브릿지 프로토콜

기존 규약(요청 `camelCase` 동사 / 응답 `camelCase` 명사)을 그대로 따른다.

### 5.1 타입 추가

`cama-plus-app/src/constants/nativeBridge.types.ts` 와
`react-app-dawplus/src/lib/webview/nativeBridge.types.ts` **양쪽 동일하게** 추가한다.

```ts
export type FoodVisionProfile = '416-int8' | '320-int8';

export type FoodVisionSource = 'camera' | 'library';

export type FoodAnalysisOptions = {
  source?: FoodVisionSource;
  maxItems?: number;
  minConfidence?: number;
  includeCandidates?: boolean;
  profile?: FoodVisionProfile;
};

export type FoodCandidate = {
  classKey: string;
  nameKo?: string;
  confidence: number;
};

export type FoodDetectedItem = {
  classKey: string;
  nameKo?: string;
  confidence: number;
  quantity: number;
  servingG?: number;
  kcalPreview?: number;
  bbox?: [number, number, number, number];
  candidates?: FoodCandidate[];
};

export type FoodImageAnalysisResult = {
  items: FoodDetectedItem[];
  modelVersion: string;
  catalogVersion: string;
  profile: FoodVisionProfile;
  inferenceMs: number;
  capturedAt: string;
  imageWidth?: number;
  imageHeight?: number;
};

export type FoodVisionInfo = {
  modelVersion: string;
  catalogVersion: string;
  profile: FoodVisionProfile;
  classCount: number;
};
```

`DeviceCapabilities`에 항목을 추가한다.

```ts
export type DeviceCapabilities = {
  // ... 기존 필드
  foodVision?: CapabilityStatus;
};
```

### 5.2 요청·응답 매핑

```ts
export type WebToNativeRequest =
  // ... 기존 19개
  | { type: 'analyzeFoodImage'; requestId: string; options?: FoodAnalysisOptions }
  | { type: 'getFoodVisionInfo'; requestId: string };

export type NativeBridgeResponseType =
  // ... 기존
  | 'foodImageAnalysis'
  | 'foodVisionInfo';
```

| 요청 | 응답 | 페이로드 | 타임아웃 |
|------|------|----------|----------|
| `analyzeFoodImage` | `foodImageAnalysis` | `FoodImageAnalysisResult` | **45,000ms** (촬영 대기 포함) |
| `getFoodVisionInfo` | `foodVisionInfo` | `FoodVisionInfo` | 5,000ms |

`bridgeHandlers.ts`의 `responseTypeMap`에도 두 쌍을 반드시 추가한다. (누락 시 실패 응답이 SPA에 도달하지 않아 타임아웃으로만 처리됨)

### 5.3 웹 클라이언트

`react-app-dawplus/src/lib/webview/nativeBridgeClient.ts`:

```ts
export function requestNativeAnalyzeFoodImage(
  options: FoodAnalysisOptions = {},
  timeoutMs = 45000,
) {
  return requestBridge<
    NativeBridgeResponseBase & { type: 'foodImageAnalysis' } & FoodImageAnalysisResult
  >({ type: 'analyzeFoodImage', options }, 'foodImageAnalysis', timeoutMs);
}
```

`rnBridge.ts` 재노출 + `hooks/useNativeFoodVision.ts` 훅 추가.

### 5.4 선행 조건 — 카메라 구현

현재 `capturePhoto` / `pickPhotoFromLibrary`는 Android·iOS 모두 `NOT_IMPLEMENTED` 스텁이다.
`analyzeFoodImage`는 **네이티브 내부에서 촬영까지 수행**하므로, 카메라 권한 흐름과 촬영 로직을 이 작업에서 함께 구현한다.

| 플랫폼 | 촬영 | 권한 |
|--------|------|------|
| Android | `ActivityResultContracts.TakePicture` (FileProvider 임시 파일) | `PermissionsAndroid.CAMERA` (기존 패턴) |
| iOS | `UIImagePickerController` / `PHPicker` | `NSCameraUsageDescription` (Info.plist 존재) |

촬영 원본은 추론 직후 **임시 파일 삭제**한다. `includeBase64`는 이 플로우에서 사용하지 않는다.

---

## 6. SPA 화면 흐름

```
/webview/nutrition/meal/capture     촬영 진입 (권한·모델 준비 안내)
/webview/nutrition/meal/review      탐지 목록 확인·보정  ← 핵심 화면
/webview/nutrition/meal/result      저장 완료 + 가이드
/webview/nutrition/meal/history     식사 기록 목록
```

### 진입점과 화면 재사용

네 단계의 화면 본문은 `components/nutrition/steps/` 의 단계 컴포넌트로 두고,
헤더와 화면 전환만 호스트가 담당한다. 같은 컴포넌트를 두 진입점이 공유한다.

| 진입점 | 호스트 | 화면 전환 |
|--------|--------|-----------|
| 내정보 > 나의 메뉴 > **식사기록처리** (주 진입점) | `components/mypage/MealRecordPage.tsx` + `Popup` | 내부 `step` 상태 |
| `/webview/nutrition/meal/*` (딥링크·RN parity) | `routes/webview/nutrition/meal/*` + `WebViewBackHeader` | 라우터 |

단계 컴포넌트는 헤더를 포함하지 않고, 하단 CTA 는 `fixed` 가 아니라
`sticky bottom-0 mt-auto` 를 쓴다 (팝업의 내부 스크롤 컨테이너에서도 동작해야 함).

### review 화면 요구사항

| 요소 | 동작 |
|------|------|
| 항목 카드 | 음식명, confidence 배지, kcal |
| 후보 교체 | `candidates` 드롭다운 + 전체 검색 폴백 |
| 인분 슬라이더 | 0.5 / 1 / 1.5 / 2 (`portionFactor`) |
| 수량 스테퍼 | `quantity` 1~10 |
| 항목 삭제 / 수동 추가 | 오탐 제거, 미탐 보완 |
| 식사 구분 | 아침/점심/저녁/간식 (`mealTypeCd`) |
| 합계 | **서버 estimate 응답 값** 표시 |
| 고지 | "추정값이며 참고용입니다" 상시 노출 |

`confidence < 0.5` 항목은 시각적으로 **확인 필요** 강조 → 사용자 확인 없이 저장 시 `needsReview` 플래그.

### 오프라인 큐

```
1. estimate 실패(네트워크) → 온디바이스 미리보기 값으로 로컬 저장
   localStorage: cama.meal.queue = [{ clientLogId, payload, createdAt }]
2. 앱 포그라운드 복귀 / 온라인 전환 시 순차 전송 (지수 백오프, 최대 5회)
3. 서버 저장 성공 → 큐 제거 + 서버 정본 값으로 화면 갱신
4. clientLogId 유니크 제약이 중복을 흡수하므로 재전송 안전
```

---

## 7. 서버 API 설계

기존 규약: 클래스 레벨 `@RequestMapping("api")`, 경로에 선행 슬래시 없음, 응답은 `ApiResult<T>`, 인증은 `@AuthenticationPrincipal JwtAuthentication`.

패키지: `controller/nutrition`, `service/nutrition`, `dto/nutrition`, `mapper/NutritionMapper`

| Method | Path | 용도 |
|--------|------|------|
| `POST` | `api/nutrition/meal/estimate` | 저장 없이 정본 계산 (review 화면) |
| `POST` | `api/nutrition/meal` | 식사 기록 저장 (멱등) |
| `POST` | `api/nutrition/mealList` | 기간별 목록 |
| `POST` | `api/nutrition/mealDailySummary` | 일별 섭취 집계 |
| `GET` | `api/nutrition/meal/{seq}` | 단건 상세 |
| `PUT` | `api/nutrition/meal/{seq}` | 항목 수정 (재계산) |
| `POST` | `api/nutrition/meal/delete` | 소프트 삭제 (본문 `{ "seq": 1 }`) |
| `GET` | `api/nutrition/catalog` | 앱 번들 catalog 델타 갱신 |
| `POST` | `api/nutrition/food/search` | 수동 음식 검색 (폴백) |
| `POST` | `api/nutrition/meal/feedback` | 오분류 피드백 수집 |

`SecurityConfig`의 `"/api/**" → hasAnyRole("USER")` 규칙이 그대로 적용되므로 추가 설정은 필요 없다.

WebView 클라이언트가 비인증 접근이 필요하면 기존 패턴대로 `webview/nutrition/...` 미러를 추가한다. **단, 식사 기록은 개인 데이터이므로 미러는 만들지 않고 JWT 필수로 둔다.**

### 7.1 저장 요청

`POST /api/nutrition/meal`

```json
{
  "clientLogId": "9f1c2f6e-3b7a-4c2e-9a11-5d7a6f0b1e22",
  "mealTypeCd": "LUNCH",
  "eatenAt": "2026-08-08T12:30:00+09:00",
  "sourceCd": "ONDEVICE",
  "clientMeta": {
    "modelVersion": "yolo26n-kd-416-int8@1.0.0",
    "catalogVersion": "1.0.0",
    "profile": "416-int8",
    "inferenceMs": 820,
    "appVersion": "1.2.18"
  },
  "items": [
    {
      "classKey": "gimbap",
      "confidence": 0.91,
      "portionFactor": 1.0,
      "quantity": 1,
      "isUserCorrected": false,
      "clientKcalPreview": 334
    },
    {
      "classKey": "kimchi_jjigae",
      "confidence": 0.44,
      "portionFactor": 0.5,
      "quantity": 1,
      "isUserCorrected": true,
      "originalClassKey": "doenjang_jjigae",
      "clientKcalPreview": 121
    }
  ]
}
```

| 필드 | 필수 | 검증 |
|------|------|------|
| `clientLogId` | ✅ | UUID 형식, `(account_seq, client_log_id)` 유니크 |
| `mealTypeCd` | ✅ | `BREAKFAST` / `LUNCH` / `DINNER` / `SNACK` |
| `eatenAt` | ✅ | 미래 시각 거부, 과거 최대 30일 |
| `sourceCd` | ✅ | `ONDEVICE` / `MANUAL` |
| `items` | ✅ | 1~20개 |
| `items[].classKey` | ✅ | `cm_food_class`에 존재 |
| `items[].portionFactor` | ✅ | 0.25 ~ 5.0 |
| `items[].quantity` | ✅ | 1 ~ 20 |
| `items[].confidence` | ⭕ | 0 ~ 1 |

**서버는 `clientKcalPreview`를 계산에 사용하지 않는다.**

### 7.2 저장 응답

```json
{
  "success": true,
  "error": null,
  "response": {
    "seq": 10482,
    "clientLogId": "9f1c2f6e-3b7a-4c2e-9a11-5d7a6f0b1e22",
    "mealTypeCd": "LUNCH",
    "eatenAt": "2026-08-08 12:30:00",
    "totalKcal": 452,
    "totalCarbG": 74.3,
    "totalProteinG": 14.1,
    "totalFatG": 9.8,
    "needsReview": true,
    "nutritionVersion": "MFDS-2026.1",
    "items": [
      {
        "seq": 30911,
        "classKey": "gimbap",
        "nameKo": "김밥",
        "foodCode": "D000123",
        "gramsG": 230,
        "kcal": 334,
        "carbG": 61.0,
        "proteinG": 10.6,
        "fatG": 6.4,
        "nutritionSourceCd": "MFDS",
        "estimated": false
      }
    ],
    "guide": {
      "headline": "점심 452kcal, 오늘 목표의 26%입니다.",
      "messages": [
        "나트륨이 높은 국물류는 절반만 섭취하는 것을 권장합니다.",
        "단백질이 부족합니다. 저녁에 계란·두부를 더해 보세요."
      ],
      "disclaimer": "촬영 기반 추정값이며 의료적 판단의 근거로 사용하지 마세요."
    }
  }
}
```

`estimate` 응답은 위와 동일한 형태에서 `seq`가 `null`이다. → 프론트가 **동일 렌더러를 재사용**할 수 있다.

### 7.3 카탈로그 델타

`GET /api/nutrition/catalog?since=1.0.1786000000`

앱 스토어 재배포 없이 영양값·매핑을 갱신하기 위한 경로다.

`catalogVersion`은 `1.0.{max(cm_food_class.updated_at) epochSecond}` 형태의 **단조 증가 토큰**이다. 별도 버전 컬럼 없이 마스터 변경만으로 델타를 계산할 수 있고, 마스터를 수정하면 자동으로 값이 올라간다. `since`를 생략하면 `full: true`로 전체 목록을 반환한다.

```json
{
  "success": true,
  "response": {
    "catalogVersion": "1.0.1786012345",
    "full": false,
    "changed": [
      { "classId": 2, "classKey": "gimbap", "servingG": 240, "kcalPer100g": 148 }
    ],
    "removed": []
  }
}
```

앱은 번들 catalog에 델타를 적용해 로컬 캐시로 보관한다. `classId`는 응답에 포함하지만 **모델 클래스 인덱스는 바뀌지 않으므로 앱은 이를 검증용으로만 사용한다.**

---

## 8. 데이터 모델

마이그레이션 도구(Flyway/Liquibase)가 없고 `ddl-auto`도 설정되지 않은 프로젝트이므로, 기존 `deploy/sql/` 스크립트 패턴을 따른다.

**적용 스크립트 (구현 완료)**

| 파일 | 내용 |
|------|------|
| `deploy/sql/cafe24-nutrition-meal-log.sql` | 테이블 5종 + 인덱스 (재실행 가능) |
| `deploy/sql/cafe24-nutrition-food-class-seed.sql` | 100종 시딩 + 건수 검증 (`class_id` upsert) |
| `deploy/sql/cafe24-nutrition-mfds-load.sql` | 식약처 영양 DB 적재 (생성물, 아래 8.5 참조) |
| `deploy/scripts/vps-apply-nutrition-schema.py` | 위 3개를 VPS에 순서대로 적용·검증 |

### 8.1 테이블 구성

| 테이블 | 역할 | 핵심 제약 |
|--------|------|-----------|
| `cm_food_class` | 탐지 클래스 100종 마스터 (`class_id` = 모델 출력 인덱스) | `class_id` unique, `class_key` unique |
| `cm_food_nutrition` | 식약처 영양성분 100g 기준. 버전별 누적 | `(food_code, nutrition_version)` unique |
| `account_meal_log` | 식사 기록 헤더. 합계는 서버 계산값만 | `(account_seq, client_log_id)` unique |
| `account_meal_log_item` | 항목별 영양 **스냅샷** | `meal_log_seq` FK, `on delete cascade` |
| `account_meal_feedback` | 오분류 피드백 | — |

### 8.2 설계와 달라진 점 (구현 시 결정)

| 항목 | 설계 초안 | 구현 | 이유 |
|------|-----------|------|------|
| `client_log_id` 타입 | `uuid` | `varchar(36)` | JPA `String` 매핑을 단순하게 유지. UUID 형식은 서비스에서 검증 |
| `nutrition_source_cd` | MFDS / CLASS_FALLBACK | **NONE 추가** | 폴백 영양값조차 없는 클래스를 명시적으로 구분 |
| `cm_food_class` | — | `category_nm` 추가 | SPA 검색·그룹핑에 사용 |
| `account_meal_log` | — | `memo` 추가 | 사용자 메모 |
| 시간 타입 | `LocalDateTime` | `OffsetDateTime` | `timestamptz` 컬럼과 오프셋 손실 없이 매핑 |

### 8.3 스냅샷 원칙

항목별 `kcal` / `carb_g` / `protein_g` / `fat_g`는 **저장 시점 계산값을 그대로 보관**한다.

영양 DB가 갱신되어도 과거 기록은 바뀌지 않는다. 이는 의료성 이력에서 필수 요건이며, 재계산이 필요하면 `nutrition_version`으로 대상 행을 특정해 **명시적 배치**로만 처리한다.

### 8.4 영속화 방식

| 대상 | 방식 | 근거 |
|------|------|------|
| `account_meal_log` + item | **JPA 엔티티** (`@OneToMany` cascade) | 부모-자식 CRUD·수정이 필요, `AccountSchedule` 패턴 |
| 기간별 목록·집계(일별 kcal) | **MyBatis** (`NutritionMapper.xml`) | `VitalMapper` / `CareTrackMapper` 패턴, 복합 집계 SQL |
| 마스터 조회 | JPA Repository + 애플리케이션 캐시 | 변경 빈도 낮음 |

엔티티 규약은 기존과 동일하게 맞춘다: PK `seq`, FK `accountSeq`(Long), `@Enumerated(EnumType.STRING)`, `is_enabled` → `enabled` + `@JsonIgnore`, `@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")`.

### 8.5 식약처 영양 DB 적재

현재 `cm_food_nutrition`은 **비어 있고**, 모든 계산이 `cm_food_class.fb_*` 폴백으로 동작한다. 폴백만 쓰는 기록은 `nutrition_version = 'CLASS_FALLBACK'`, 항목은 `is_estimated = true`, 헤더는 `needs_review = true`가 된다. 기능은 완전히 동작하지만 값의 출처가 대표 근사치임이 데이터에 남는다.

정본 DB를 확보하면 다음 순서로 전환한다.

1. 공공데이터포털에서 **식품의약품안전처 식품영양성분DB**(음식/가공식품) CSV 또는 XLSX를 받는다.
2. 매핑 후보를 생성한다. 컬럼명은 배포 회차마다 달라지므로 스크립트가 패턴으로 자동 탐지한다.

```bash
python scripts/food-calorie/build_mfds_nutrition_sql.py \
    --input "D:/data/식품영양성분DB_음식.csv" \
    --version MFDS-2026.1 --mapping-only
```

3. `docs/food_mfds_mapping_candidates.csv`를 검토해 `docs/food_mvp_100_classes.mapped.csv`의 `food_code` 컬럼을 채운다. **자동 매핑은 적용하지 않는다** — 한식은 동명이물이 많아 사람 확인이 필요하다.
4. 적재 SQL을 생성한다. `--apply-mapping`은 `cm_food_class.food_code` UPDATE와, 매핑된 클래스의 `fb_*`를 정본값으로 동기화하는 문장까지 포함한다. 동기화는 앱 미리보기 kcal과 서버 계산값의 차이를 줄인다.

```bash
python scripts/food-calorie/build_mfds_nutrition_sql.py \
    --input "D:/data/식품영양성분DB_음식.csv" \
    --version MFDS-2026.1 --apply-mapping
python deploy/scripts/vps-apply-nutrition-schema.py
```

`food_code`가 채워지면 해당 항목은 자동으로 `nutrition_source_cd = 'MFDS'`, `is_estimated = false`로 계산된다. **서버 코드 변경은 필요 없다.** 이미 저장된 과거 기록은 스냅샷 원칙에 따라 그대로 유지된다.

---

## 9. 서버 계산 규칙

```
grams = serving_g × portion_factor × quantity

영양 소스 결정:
  1) cm_food_class.food_code 존재 && cm_food_nutrition 조회 성공
     → nutrition_source_cd = 'MFDS',           is_estimated = false
  2) 실패 시 cm_food_class.fb_* 사용
     → nutrition_source_cd = 'CLASS_FALLBACK', is_estimated = true
  3) 폴백도 없음
     → nutrition_source_cd = 'NONE',           is_estimated = true, 영양값 0

조회 대상 버전 = max(cm_food_nutrition.nutrition_version)  (활성 버전)

kcal      = kcal_per_100g × grams / 100
carb_g    = carb_per_100g × grams / 100
(단백질·지방 동일)

반올림: kcal 정수, 매크로 소수 1자리
합계   = 항목 합산 후 동일 반올림
```

### 검증·플래그

| 조건 | 처리 |
|------|------|
| `classKey` 미존재 | `400` — `INVALID_FOOD_CLASS` |
| 폴백 영양도 없음 | 해당 항목 `kcal = 0`, `is_estimated = true`, `needs_review = true` |
| 항목 중 `confidence < 0.35` && `isUserCorrected = false` | `needs_review = true` |
| `is_estimated` 항목 존재 | `needs_review = true` |
| 동일 `clientLogId` 재요청 | **기존 행 조회해 200 반환** (신규 생성 금지) |

멱등 처리는 유니크 제약 위반(`DataIntegrityViolationException`)을 잡아 기존 행을 반환하는 방식으로 구현한다. 조회 후 삽입 방식은 동시 요청에서 경쟁 조건이 생긴다.

---

## 10. 오류 처리 매트릭스

| 계층 | 코드 | 원인 | 사용자 처리 |
|------|------|------|-------------|
| Bridge | `UNAVAILABLE` | WebView 밖(브라우저) 실행 | 수동 입력 화면으로 전환 |
| Bridge | `NOT_IMPLEMENTED` | 구버전 앱 | "앱 업데이트 필요" + 수동 입력 |
| Bridge | `PERMISSION_DENIED` | 카메라 권한 거부 | 설정 이동 안내 |
| Bridge | `CANCELLED` | 사용자 촬영 취소 | 조용히 복귀 |
| Bridge | `TIMEOUT` | 45s 초과 | 재시도 버튼 |
| Native | `MODEL_LOAD_FAILED` | 자산 손상·메모리 부족 | 320 프로필 재시도 → 수동 입력 |
| Native | 탐지 0건 | 음식 아님·저조도 | "음식을 인식하지 못했습니다" + 재촬영/수동 |
| Server | `INVALID_FOOD_CLASS` | 앱 catalog 불일치 | catalog 갱신 후 재시도 |
| Server | 네트워크 실패 | 오프라인 | 로컬 큐 적재, 배너 표시 |

`MODEL_LOAD_FAILED`는 신규 코드이므로 `NATIVE_BRIDGE_ERRORS`에 추가한다.

---

## 11. 보안·프라이버시

| 항목 | 설계 |
|------|------|
| 이미지 | **서버 전송 없음.** 추론 후 임시 파일 즉시 삭제 |
| 전송 데이터 | classKey·confidence·인분·시각 등 텍스트만 |
| 인증 | `api_key` 헤더 JWT 필수, `webview/` 미러 생성 금지 |
| 권한 분리 | 타 사용자 기록 접근 차단 — 모든 조회에 `account_seq` 조건 강제 |
| 로깅 | bbox·confidence는 남기되 개인 식별 정보 로그 금지 |
| 고지 | 화면·API 응답 양쪽에 `disclaimer` 포함 (의료기기 오인 방지) |
| 모델 자산 | AI Hub 원본 이미지와 가중치 배포 경로 분리 (라이선스) |

---

## 12. 성능 예산

| 구간 | 목표 | 비고 |
|------|------|------|
| 촬영 → 전처리 | ≤ 250ms | 1280px 리사이즈 |
| 추론 (416 Int8, 중급기) | ≤ 900ms | NNAPI 사용 시 |
| 추론 (320 Int8, 저사양) | ≤ 700ms | 폴백 프로필 |
| 후처리·집계 | ≤ 100ms | |
| **브릿지 왕복 총합** | **≤ 1.5s** | 사용자 체감 기준 |
| `estimate` API | ≤ 300ms (p95) | 마스터 캐시 적용 |
| `meal` 저장 API | ≤ 400ms (p95) | |

발열·배터리 보호를 위해 **연속 추론은 금지**하고 촬영 1회당 1추론으로 고정한다.

---

## 13. 구현 순서와 파일 체크리스트

### Phase A — 서버 (구현 완료, DB 적용 대기)

- [x] `deploy/sql/cafe24-nutrition-meal-log.sql` — 테이블 5종 + 인덱스
- [x] `deploy/sql/cafe24-nutrition-food-class-seed.sql` — 100종 시딩 + 건수 검증
- [x] `scripts/food-calorie/build_mfds_nutrition_sql.py` — 식약처 DB → 적재 SQL + 매핑 후보
- [x] `deploy/scripts/vps-apply-nutrition-schema.py` — VPS 적용·검증
- [x] `domain/nutrition/` — `CmFoodClass`, `CmFoodNutrition`, `AccountMealLog`, `AccountMealLogItem`, `AccountMealFeedback`, `MealType`, `MealSource`, `NutritionSource`
- [x] `repo/nutrition/` — `FoodClassRepository`, `FoodNutritionRepository`, `MealLogRepository`, `MealFeedbackRepository`
- [x] `service/nutrition/` — `NutritionCalculator`, `MealLogService`, `MealLogWriter`, `MealGuideService`, `FoodCatalogService`
- [x] `dto/nutrition/` — 요청 4종, 응답 7종
- [x] `controller/nutrition/NutritionRestController.java` — 엔드포인트 9종
- [x] `mapper/NutritionMapper.java` + `resources/mapper/NutritionMapper.xml` (기간 목록·일별 집계)
- [x] `exception/nutrition/` + `GeneralExceptionHandler` 등록
- [x] 단위 테스트 23건 — 계산 규칙, 폴백, 멱등성, 시각·범위 검증
- [x] **운영 DB에 DDL·시딩 적용** (`vps-apply-nutrition-schema.py`)
- [x] 식약처 DB 전체 적재 (`MFDS-2025.12`)
  - 음식DB 19,495 + 가공식품DB 306,307 + 건강기능식품DB 5,556 = **331,358건**
  - 클래스 `food_code` 자동 매핑 58/100
- [ ] 나머지 42종 `food_code` 수동 검토 (`docs/food_mfds_mapping_candidates.csv`)

### Phase B — 온디바이스 (Android 우선, 브릿지 연결 완료)

- [x] 모델·catalog 자산 배치 (`assets/foodvision/` 416·320 Int8 + `food_catalog.v1.json`, 62클래스)
- [x] `foodvision/FoodVisionEngine.java` — TFLite 로드·NNAPI→GPU→CPU 폴백
- [x] `foodvision/FoodVisionDecoder.java` — 출력 디코드 + class-wise NMS
- [x] `foodvision/FoodCatalog.java` — catalog 파싱·미리보기 kcal
- [x] `foodvision/FoodPhotoCapture.java` — 카메라/앨범 인텐트 + 임시 파일
- [x] `CamaNativeBridgeModule.java` — `analyzeFoodImage` · `getFoodVisionInfo` · `capturePhoto` · `pickPhotoFromLibrary`
- [x] `getCapabilities`에 `foodVision` 추가 (`implemented: true`)
- [x] `tensorflow-lite-gpu-api` 의존성 보강 (GpuDelegateFactory 컴파일 오류)
- [ ] 실기기에서 촬영 → 인식 → SPA review 화면 E2E 확인
- [ ] 빌드 시 카탈로그/모델 클래스 수 자동 검증 스크립트 (런타임 `IllegalStateException`으로 이미 방어)

### Phase C — iOS

- [ ] `.mlpackage` 번들 + `CamaFoodVision.swift`
- [ ] `CamaNativeBridge.m` — `analyzeFoodImage` export
- [ ] `UIImagePickerController` 촬영 구현

### Phase D — RN·SPA (구현 완료, 네이티브 추론 대기)

- [x] `nativeBridge.types.ts` 양쪽 동기화 + `DeviceCapabilities.foodVision`
- [x] `NativeBridgeModule.ts` — `analyzeFoodImage` · `getFoodVisionInfo` 래퍼
- [x] `bridgeHandlers.ts` — switch case + **`responseTypeMap` 등록** + 카메라 권한 요청
- [x] `nativeBridgeClient.ts` + `rnBridge.ts` + `useNativeFoodVision.ts`
- [x] `apis/api/webview/nutrition.ts` + `apis/types/nutrition.types.ts` (엔드포인트 9종)
- [x] `hooks/queries|mutations/webview/useNutrition*.ts` + `queryKeys.webview.nutrition`
- [x] 라우트 4종 (capture / review / result / history) + `components/nutrition/` 5종
- [x] `lib/nutrition/mealQueue.ts` · `syncMealQueue.ts` + `useMealQueueSync` 훅
- [x] `lib/nutrition/mockFoodVision.ts` — 네이티브 미구현 시 화면 검증용 대체 결과
- [x] `atoms/nutritionAtoms.ts` — capture→review→result 초안 공유 (sessionStorage)
- [x] `deploy/scripts/verify-webview-routes.mjs` 에 신규 라우트 4종 등록
- [ ] i18n `ko` / `en` 문구 — 기존 webview 화면이 한국어 하드코딩이라 보류

**목 모드 사용법**: 브라우저 개발(`npm run dev`)에서는 자동으로 켜지고,
배포 빌드에서는 `localStorage.setItem("cama.foodVision.mock", "1")` 로만 켜진다.
네이티브가 `NOT_IMPLEMENTED` / `UNAVAILABLE` 을 반환할 때만 대체 결과로 넘어가므로,
Phase B 가 붙으면 코드 수정 없이 실제 추론으로 전환된다.

**목 데이터의 `classKey` 는 시딩된 실제 값**(`white_rice`, `kimchi_jjigae`, `kimchi`)이라
서버 `estimate` · `meal` 호출까지 그대로 통과한다.

### Phase E — 검증

- [ ] 골든 이미지 20장 → 기대 클래스 회귀 테스트
- [ ] FP32 vs Int8 mAP·kcal 오차 비교표
- [ ] 실기기 3종(고·중·저사양) 지연·발열 측정
- [ ] 오프라인 → 온라인 동기화 E2E
- [ ] 중복 저장 방지 검증 (동일 `clientLogId` 10회 병렬 전송)

---

## 14. 테스트 전략

| 레벨 | 대상 | 방법 |
|------|------|------|
| 단위 (네이티브) | 디코드·집계·프로필 선택 | 고정 텐서 픽스처 |
| 단위 (서버) | `NutritionCalculator` 계산·폴백·반올림 | JUnit, 경계값 |
| 통합 (서버) | 멱등성, 권한 분리 | H2 + `application-test.yml` |
| 회귀 (모델) | 골든 이미지 셋 | Top-1 정확도 임계 게이트 |
| E2E | 촬영 → 저장 → 이력 | 실기기 + 에뮬레이터 |
| 성능 | 지연 p50/p95 | 실기기 3종 반복 측정 |

---

## 15. 결정 요약

1. **kcal 정본은 서버.** 클라이언트 미리보기 값은 저장하지 않고 모니터링용으로만 보관한다.
2. **브릿지는 `analyzeFoodImage` → `foodImageAnalysis`** 단일 왕복. 네이티브가 촬영·추론·집계를 모두 수행한다.
3. **이미지는 기기를 벗어나지 않는다.** 추론 직후 임시 파일 삭제.
4. **2단계 API** (`estimate` → `meal`)로 사용자 보정 UX와 정본 계산을 분리한다.
5. **`clientLogId` 유니크 제약**으로 네트워크 재시도를 안전하게 만든다.
6. **영양값 스냅샷 저장**으로 DB 갱신 시 과거 기록이 변하지 않는다.
7. **catalog 델타 API**로 앱 재배포 없이 영양·매핑을 갱신한다.
8. **프로필 적응**(416 → 320)으로 저사양 기기 지연을 흡수한다.
9. **Android 네이티브 카메라·추론은 Phase B에서 연결 완료.** iOS는 Phase C.
10. 서버는 앱과 **독립적으로 Phase A 먼저 완료** 가능하다.
