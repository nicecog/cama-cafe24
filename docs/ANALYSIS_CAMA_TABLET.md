# CAMA Tablet — 전체 분석 문서

> 분석일: 2026-06-21
> 대상: `cama-tablet-web` (React SPA), `cama-tablet-android` (Native Android), `cama-tablet-server` (Spring Boot API)

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [cama-tablet-web (React SPA)](#2-cama-tablet-web-react-spa)
3. [cama-tablet-android (Native Android)](#3-cama-tablet-android-native-android)
4. [cama-tablet-server (Spring Boot API)](#4-cama-tablet-server-spring-boot-api)
5. [데이터 흐름](#5-데이터-흐름)
6. [WebView ↔ Native 브릿지](#6-webview--native-브릿지)
7. [API 명세](#7-api-명세)
8. [QR 인증 체계](#8-qr-인증-체계)
9. [의존성 및 인프라](#9-의존성-및-인프라)
10. [알려진 이슈 및 개선 포인트](#10-알려진-이슈-및-개선-포인트)

---

## 1. 시스템 개요

| 항목 | 설명 |
|------|------|
| **목적** | 의료기관 태블릿에서 환자 QR을 스캔하여 건강 데이터 대시보드를 표시 |
| **타겟** | 가로(landscape) 태블릿 전용 |
| **아키텍처** | Android Native WebView → React SPA → Spring Boot REST API |
| **사용자 흐름** | QR 스캔 → 인증 → 대시보드 조회 |

**3개 모듈 구성:**

```
┌─────────────────────────────────────────────────────────────────┐
│  cama-tablet-android (WebView + QR Camera Activity)             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  cama-tablet-web (React SPA)                             │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │  DashboardPage · ScanPage · StepChart · CoachingRadial│ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │  REST API (port 8090)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  cama-tablet-server (Spring Boot 3.5 + MyBatis)                 │
│  PostgreSQL DB                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. cama-tablet-web (React SPA)

### 2.1 기술 스택

| 항목 | 버전 |
|------|------|
| React | ^18.2.0 |
| TypeScript | ^5.2.2 |
| Vite | ^5.0.8 |
| React Router | ^6.21.3 |
| Recharts (차트) | ^2.12.0 |
| Axios (HTTP) | ^1.6.7 |

### 2.2 디렉토리 구조

```
cama-tablet-web/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                    # 진입점, BrowserRouter
    ├── App.tsx                     # 라우트 정의 (2개 페이지)
    ├── index.css                   # 글로벌 스타일
    ├── vite-env.d.ts
    ├── pages/
    │   ├── ScanPage.tsx            # QR 스캔 페이지
    │   └── DashboardPage.tsx       # 건강 대시보드 페이지
    ├── components/
    │   ├── CoachingRadial.tsx      # 코칭 진행률 radial 차트
    │   └── StepChart.tsx           # 발걸음 영역 차트
    ├── lib/
    │   ├── api.ts                  # Axios API 클라이언트
    │   └── nativeBridge.ts         # Android WebView 브릿지
    └── types/
        └── dashboard.ts            # TypeScript 타입 정의
```

### 2.3 라우트

| Path | 컴포넌트 | 설명 |
|------|---------|------|
| `/` | ScanPage | QR 스캔 (또는 개발용 텍스트 입력) |
| `/dashboard/:accountSeq` | DashboardPage | 환자 건강 데이터 대시보드 |
| `*` | Navigate → `/` | fallback |

### 2.4 페이지 상세

#### ScanPage (`/`)
- `isNativeApp()` → 네이티브 브릿지 여부 감지
- 네이티브: `requestQrScan()` 호출 → `AndroidBridge.startQrScan()` or `CamaTabletBridge.startQrScan()`
- 브라우저: `prompt()` 로 QR payload 직접 입력 (개발용)
- `onNativeEvent` 리스너로 스캔 결과 수신 → `scanQr()` API 호출 → 대시보드 이동
- UI: 다크 테마, 중앙 정렬, "QR 스캔 시작" 버튼

#### DashboardPage (`/dashboard/:accountSeq`)
- **3열 그리드 레이아웃** (태블릿 landscape 최적화):
  1. **발걸음 섹션**: 오늘/7일 평균 걸음 수 + `StepChart` (AreaChart, 14일 추이)
  2. **건강 코칭 섹션**: `CoachingRadial` (진행률 원형 차트) + 심박수 정보
  3. **의료진 안내 섹션**: 치료정보/문의 리스트
- 초기 데이터: ScanPage에서 `location.state.data` 로 전달받음
- fallback: URL 직접 접근 시 `fetchDashboard(accountSeq)` 로 재조회
- "다른 QR 스캔" 버튼 → `requestQrScan()`
- 심박수: 현재 `"심박 데이터는 추후 연동 예정입니다."` 하드코딩

### 2.5 컴포넌트

#### StepChart
- Recharts `ResponsiveContainer` + `AreaChart`
- 14일 발걸음 데이터를 역순(reverse) 후 `MM-DD` 형식으로 표시
- 초록색 그라디언트 영역

#### CoachingRadial
- 각 카테고리별 진행률을 `conic-gradient` CSS 원형 차트로 표시
- 5개 색상 순환 (`#38bdf8`, `#f472b6`, `#a3e635`, `#fbbf24`, `#c084fc`)

### 2.6 API 클라이언트 (`lib/api.ts`)

```typescript
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";  // 비어있으면 Vite proxy
api.post("/api/tablet/scan", { payload })          // QR 스캔 → DashboardData
api.get("/api/tablet/dashboard/:accountSeq")       // 대시보드 재조회
```

---

## 3. cama-tablet-android (Native Android)

### 3.1 기술 스택

| 항목 | 버전 |
|------|------|
| Kotlin | 1.9.22 |
| compileSdk / targetSdk | 34 |
| minSdk | 24 |
| CameraX | 1.3.1 |
| ML Kit Barcode Scanning | 17.2.0 |
| WebKit | 1.10.0 |

### 3.2 디렉토리 구조

```
cama-tablet-android/
├── build.gradle.kts
├── settings.gradle.kts
├── README.md
└── app/
    ├── build.gradle.kts
    └── src/main/
        ├── AndroidManifest.xml
        ├── res/
        │   ├── drawable/ic_launcher_foreground.xml
        │   ├── layout/
        │   │   ├── activity_main.xml         # WebView 전체화면
        │   │   └── activity_qr_scan.xml      # 카메라 프리뷰 + 취소 버튼
        │   └── values/themes.xml
        └── java/com/cama/tablet/
            ├── MainActivity.kt        # WebView + QR 브릿지
            ├── QrScanActivity.kt      # 카메라 QR 스캐너
            └── WebAppBridge.kt        # JavaScriptInterface
```

### 3.3 주요 클래스

#### MainActivity.kt
- **WebView 설정**: JavaScript enabled, DOM storage, mixed content 허용, media autoplay
- **두 개의 브릿지 이름 등록**: `AndroidBridge` + `CamaTabletBridge` (호환성)
- **QR 스캔**: `ActivityResultContracts.StartActivityForResult()` 로 `QrScanActivity` 실행
- **결과 전달**: `injectScanResult()` → `evaluateJavascript()` 로 CustomEvent dispatch
- **뒤로가기**: WebView 내 history navigation 지원
- **URL**: `BuildConfig.TABLET_WEB_URL` (debug: `http://10.0.2.2:5175`, release: production URL)

#### QrScanActivity.kt
- CameraX `Preview` + `ImageAnalysis`
- ML Kit `BarcodeScanning` 으로 QR 코드 인식
- `STRATEGY_KEEP_ONLY_LATEST` 로 최신 프레임만 분석
- 최초 QR 인식 시 `handled=true` 로 중복 방지
- 결과를 Intent extra (`qr_payload`) 로 MainActivity 에 반환
- 취소 버튼 지원
- CAMERA 권한 요청

#### WebAppBridge.kt
- `@JavascriptInterface` 어노테이션
- `startQrScan()` → MainActivity의 `qrScanLauncher` 실행

### 3.4 AndroidManifest.xml

```xml
<!-- 권한 -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />

<!-- 화면 방향: landscape 고정 -->
<activity android:name=".MainActivity" android:screenOrientation="landscape" ... />
<activity android:name=".QrScanActivity" android:screenOrientation="landscape" ... />

<!-- 평문 HTTP 허용 (로컬 개발) -->
<application android:usesCleartextTraffic="true" ... />
```

---

## 4. cama-tablet-server (Spring Boot API)

### 4.1 기술 스택

| 항목 | 버전 |
|------|------|
| Spring Boot | 3.5.0 |
| Java | 21 |
| MyBatis Spring Boot | 3.0.4 |
| PostgreSQL (runtime) | - |
| Auth0 java-jwt (JWT) | 4.4.0 |
| Lombok | optional |

### 4.2 디렉토리 구조

```
cama-tablet-server/
├── pom.xml
└── src/main/
    ├── java/com/cama/tablet/
    │   ├── RunApplication.java
    │   ├── config/
    │   │   ├── TabletQrConfig.java        # @ConfigurationPropertiesScan
    │   │   ├── TabletQrProperties.java     # QR 설정 바인딩
    │   │   └── WebConfig.java             # CORS 설정
    │   ├── controller/
    │   │   ├── TabletQrController.java        # QR 발급 (/api/tablet/qr/issue)
    │   │   └── TabletDashboardController.java  # 스캔/대시보드 (/api/tablet/scan, /dashboard/{seq})
    │   ├── domain/
    │   │   └── ApiResult.java             # 공통 응답 래퍼 { success, message, response }
    │   ├── dto/
    │   │   ├── QrIssueRequest.java        # QR 발급 요청
    │   │   ├── QrIssueResponse.java       # QR 발급 응답
    │   │   ├── QrScanRequest.java         # QR 스캔 요청
    │   │   ├── QrPayload.java             # QR 파싱 결과
    │   │   ├── DashboardResponse.java     # 대시보드 응답
    │   │   ├── PatientSummaryDto.java
    │   │   ├── StepDailyDto.java
    │   │   ├── CoachingCategoryDto.java
    │   │   ├── InquiryDto.java
    │   │   └── HeartRateDto.java
    │   ├── mapper/
    │   │   └── TabletDashboardMapper.java  # MyBatis Mapper 인터페이스
    │   └── service/
    │       ├── TabletDashboardService.java  # 대시보드 조회 비즈니스 로직
    │       ├── TabletQrTokenService.java    # JWT 발급/검증
    │       └── QrPayloadParser.java          # 다양한 QR 포맷 파싱
    └── resources/
        ├── application.yml
        ├── application-local.yml
        └── mapper/
            └── TabletDashboardMapper.xml

src/test/
└── java/com/cama/tablet/service/
    └── TabletQrTokenServiceTest.java  # JWT 단위 테스트
```

### 4.3 API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/tablet/health` | 헬스 체크 → "cama-tablet-server ok" |
| POST | `/api/tablet/scan` | QR payload 파싱 → 대시보드 데이터 반환 |
| GET | `/api/tablet/dashboard/{accountSeq}` | accountSeq로 대시보드 재조회 |
| POST | `/api/tablet/qr/issue` | QR JWT 발급 (개발용, 프로덕션은 cama-plus-server) |

### 4.4 공통 응답 형식

```json
{
  "success": true,
  "message": "선택적 메시지",
  "response": { ... }
}
```

### 4.5 대시보드 응답 (DashboardResponse)

```json
{
  "patient":       { "seq": 1, "loginId": "...", "name": "...", "diseaseName": "...", "userTypeNm": "..." },
  "steps":         [ { "executionDate": "2026-06-20", "stepNum": 5000 }, ... ],
  "stepsToday":    3200,
  "stepsAvg7d":    4500,
  "coaching":      [ { "categoryCd": "EXERCISE", "categoryNm": "운동", "progress": 75 }, ... ],
  "inquiries":     [ { "contentsSeq": 1, "title": "...", "preview": "...", "updatedAt": "..." }, ... ],
  "heartRate":     { "available": false, "message": "심박 데이터는 추후 연동 예정입니다." }
}
```

### 4.6 QR Payload 파서 (QrPayloadParser)

**지원 포맷 (3가지):**

1. **v2 JSON**: `{"v":2,"t":"<JWT 토큰>"}` — HMAC 서명 검증
2. **v1 레거시 JSON**: `{"v":1,"accountSeq":1,"loginId":"...",...}` — 평문 (설정으로 차단 가능)
3. **URL/URI 쿼리**: `cama-tablet:?t=<JWT>` 또는 `http://...?t=<JWT>` 또는 `?loginId=...&accountSeq=...`
4. **Raw JWT**: `eyJ...` (JWT 문자열 직접)

### 4.7 QR 인증 (TabletQrTokenService)

- 알고리즘: **HMAC256**
- 기본 TTL: **300초 (5분)**
- 클레임: `accountSeq`, `loginId`
- 설정 키: `cama.tablet.qr.secret` (환경변수 `CAMA_TABLET_QR_SECRET`)
- cama-plus-server와 동일한 secret 공유 필요

### 4.8 설정 (application.yml)

| 설정 | 기본값 | 설명 |
|------|--------|------|
| `server.port` | 8090 | API 서버 포트 |
| `cama.tablet.qr.secret` | `dev-tablet-qr-secret-change-me` | QR JWT 서명 키 |
| `cama.tablet.qr.ttl-seconds` | 300 | QR 유효 시간 |
| `cama.tablet.qr.require-signed` | false | true면 v1 평문 QR 거부 |
| `cama.tablet.qr.allow-dev-issue` | false | 개발용 QR 발급 허용 |

---

## 5. 데이터 흐름

### 5.1 정상 흐름

```
사용자                    Android                    React SPA                    Server
  │                         │                          │                          │
  │  [QR 스캔 버튼]          │                          │                          │
  │────────────────────────►│                          │                          │
  │                         │  requestQrScan()         │                          │
  │                         │─────────────────────────►│                          │
  │                         │  AndroidBridge.startQrScan()                       │
  │                         │◄─────────────────────────│                          │
  │                         │                          │                          │
  │  [카메라로 QR 스캔]       │                          │                          │
  │                         │  QrScanActivity 실행      │                          │
  │                         │  CameraX + ML Kit 분석     │                          │
  │                         │                          │                          │
  │                         │  스캔 결과 Intent 반환      │                          │
  │                         │  injectScanResult()       │                          │
  │                         │  CustomEvent dispatch     │                          │
  │                         │─────────────────────────►│                          │
  │                         │                          │  POST /api/tablet/scan    │
  │                         │                          │──────────────────────────►│
  │                         │                          │                          │
  │                         │                          │  QrPayloadParser.parse()  │
  │                         │                          │  TabletQrTokenService     │
  │                         │                          │    .verifyToPayload()     │
  │                         │                          │  TabletDashboardService   │
  │                         │                          │    .resolveScan()         │
  │                         │                          │◄──────────────────────────│
  │                         │                          │                          │
  │                         │  navigate(/dashboard/:seq)                         │
  │                         │  DashboardPage 렌더링      │                          │
  │  [대시보드 확인]         │                          │                          │
  │◄────────────────────────│                          │                          │
```

### 5.2 재조회 흐름 (URL 직접 접근)

```
브라우저 → /dashboard/:accountSeq
  → fetchDashboard(accountSeq) 호출
    → GET /api/tablet/dashboard/:accountSeq
      → TabletDashboardService.buildDashboard(accountSeq)
        → DB 조회 (환자, 걸음수, 코칭, 문의)
```

---

## 6. WebView ↔ Native 브릿지 (핵심 기능)

> **이 브릿지가 이 앱의 핵심입니다.** 태블릿(Android)의 카메라로 다른 폰의 QR코드를 읽어서 WebView(React)로 전달하는 전체 파이프라인입니다.

### 6.1 브릿지 전체 흐름 (단계별)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [1] React (ScanPage)                                                       │
│      requestQrScan() 호출                                                    │
│      → window.AndroidBridge.startQrScan()  (JavascriptInterface)            │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  Native 호출
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [2] Android (WebAppBridge.kt)                                              │
│      @JavascriptInterface fun startQrScan()                                 │
│      → onStartQrScan 콜백 → MainActivity.startQrScan()                      │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  Activity 실행
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [3] Android (QrScanActivity.kt)                                            │
│      CameraX Preview + ImageAnalysis                                        │
│      ML Kit BarcodeScanning → QR 코드 인식                                   │
│      → deliverResult(rawPayload)                                            │
│      → setResult(RESULT_OK, Intent(qr_payload))                             │
│      → finish()                                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  onActivityResult 콜백
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [4] Android (MainActivity.kt)                                              │
│      qrScanLauncher 콜백 수신                                                │
│      → injectScanResult(ok, payload, error)                                 │
│      → JSONObject 생성 { type, ok, payload, error }                         │
│      → evaluateJavascript() 로 CustomEvent dispatch                         │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  WebView 내 JavaScript 실행
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [5] React (nativeBridge.ts)                                                │
│      window.addEventListener("cama-tablet-native", listener)                │
│      → CustomEvent<ScanResultDetail> 수신                                   │
│      → detail.type === "scanResult" 확인                                    │
│      → handler(detail) 콜백 실행                                             │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │  API 호출
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [6] React (ScanPage → api.ts)                                              │
│      scanQr(detail.payload) → POST /api/tablet/scan                        │
│      → navigate(/dashboard/:accountSeq)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 브릿지 코드 매핑 (파일별 실제 코드)

#### Android → React 호출 (JS → Native)

| 계층 | 파일 | 코드 |
|------|------|------|
| **React** | `src/lib/nativeBridge.ts` | `window.AndroidBridge.startQrScan()` |
| **React** | `src/lib/nativeBridge.ts` | `window.CamaTabletBridge.startQrScan()` (fallback) |
| **Android** | `WebAppBridge.kt` | `@JavascriptInterface fun startQrScan()` |
| **Android** | `MainActivity.kt` | `webView.addJavascriptInterface(bridge, "AndroidBridge")` |
| **Android** | `MainActivity.kt` | `webView.addJavascriptInterface(bridge, "CamaTabletBridge")` |

#### React → Android 이벤트 (Native → JS, 스캔 결과 전달)

| 계층 | 파일 | 코드 |
|------|------|------|
| **Android** | `MainActivity.kt` | `injectScanResult()` → `JSONObject` 생성 |
| **Android** | `MainActivity.kt` | `evaluateJavascript(script)` 로 CustomEvent dispatch |
| **React** | `src/lib/nativeBridge.ts` | `window.addEventListener("cama-tablet-native", listener)` |
| **React** | `src/lib/nativeBridge.ts` | `onNativeEvent(handler)` 리스너 등록/해제 |

### 6.3 브릿지 인터페이스 (nativeBridge.ts)

```typescript
// 네이티브 앱 환경 감지
isNativeApp(): boolean
  → window.AndroidBridge 또는 window.CamaTabletBridge 존재 여부 반환

// QR 스캔 요청
requestQrScan(): void
  → 네이티브: bridge.startQrScan() 호출 → QrScanActivity 실행
  → 브라우저: prompt()로 QR payload 직접 입력 (개발용)

// 스캔 결과 리스너 등록
onNativeEvent(handler: (detail: ScanResultDetail) => void): () => void
  → "cama-tablet-native" CustomEvent 리스너 등록
  → 반환값: cleanup 함수 (useEffect에서 사용)
```

### 6.4 ScanResultDetail 타입

```typescript
type ScanResultDetail = {
  type: "scanResult";        // 이벤트 구분자
  payload: string;           // QR raw data (JWT 또는 JSON)
  ok: boolean;               // 성공 여부
  error?: string;            // 실패 시 에러 메시지
};
```

### 6.5 브릿지가 정상 동작하는지 확인하는 방법

1. **isNativeApp()** → `window.AndroidBridge` 존재 여부로 네이티브 환경 감지
2. **requestQrScan()** → 네이티브면 `bridge.startQrScan()` → 카메라 Activity 실행
3. **QrScanActivity** → CameraX + ML Kit으로 QR 인식 → Intent로 payload 반환
4. **injectScanResult()** → `evaluateJavascript()` 로 WebView에 CustomEvent 전달
5. **onNativeEvent()** → React에서 CustomEvent 수신 → API 호출 → 대시보드 이동

> ✅ **브릿지가 완전히 구현되어 있습니다.** Android WebView → React SPA 간 양방향 통신이 모두 연결되어 있습니다.

---

## 7. API 명세

### 7.1 POST /api/tablet/scan

**Request:**
```json
{ "payload": "QR raw data string" }
```

**Response (200):**
```json
{
  "success": true,
  "response": { /* DashboardResponse */ }
}
```

**Error (200 with success=false):**
```json
{
  "success": false,
  "message": "QR 코드가 만료되었습니다..."
}
```

### 7.2 GET /api/tablet/dashboard/{accountSeq}

**Response (200):** 동일한 DashboardResponse

### 7.3 POST /api/tablet/qr/issue (개발용)

**Request:**
```json
{ "accountSeq": 1, "loginId": "user001", "devKey": "..." }
```

**Response:**
```json
{
  "success": true,
  "response": {
    "token": "eyJ...",
    "qrPayload": "{\"v\":2,\"t\":\"eyJ...\"}",
    "expiresAtEpochMs": 1234567890000,
    "ttlSeconds": 300
  }
}
```

---

## 8. QR 인증 체계

### 8.1 JWT 기반 서명

```
┌─────────────────────┐
│   QR Payload (v2)   │
│  ┌───────────────┐  │
│  │ v: 2           │  │
│  │ t: <JWT 토큰>   │  │
│  └───────────────┘  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│   JWT Claims        │
│  ┌───────────────┐  │
│  │ iss: cama-    │  │
│  │     tablet-qr │  │
│  │ iat: now      │  │
│  │ exp: now+300s │  │
│  │ accountSeq: 1 │  │
│  │ loginId: ".." │  │
│  └───────────────┘  │
│  HMAC256(secret)    │
└─────────────────────┘
```

### 8.2 v1 레거시 (평문)

```json
{ "v": 1, "accountSeq": 1, "loginId": "user001" }
```

- `requireSigned=true` 시 거부 가능
- 프로덕션에서는 v2 강제 예정

---

## 9. 의존성 및 인프라

### 9.1 개발 환경 실행 방법

**백엔드:**
```bash
cd cama-tablet-server
mvn spring-boot:run               # 포트 8090
```

**프론트엔드 (개발):**
```bash
cd cama-tablet-web
npm install
npm run dev                       # 포트 5175, Vite proxy → 8090
```

**안드로이드 (디버그):**
```
Android Studio에서 cama-tablet-android 열기
→ Gradle Sync
→ 에뮬레이터 or 태블릿 실행
→ WebView가 http://10.0.2.2:5175 로 접속 (에뮬레이터 → PC localhost)
```

### 9.2 환경변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `VITE_API_BASE_URL` | (빈값) | API base URL, 비우면 Vite proxy |
| `CAMA_TABLET_QR_SECRET` | `dev-tablet-qr-secret-change-me` | JWT 서명 키 |
| `CAMA_TABLET_QR_DEV_KEY` | (빈값) | 개발용 QR 발급 키 |

### 9.3 배포 URL

- 안드로이드 Release: `https://camaplus.cafe24.com/tablet-app/`
- API 서버: 포트 8090

### 9.4 Vite Proxy

```typescript
// vite.config.ts
server: {
  proxy: {
    "/api": { target: "http://127.0.0.1:8090", changeOrigin: true }
  }
}
```

---

## 10. 알려진 이슈 및 개선 포인트

### 10.1 현재 상태 (Known Issues)

| # | 이슈 | 영향 | 우선순위 |
|---|------|------|---------|
| 1 | **심박수 미연동** — `heartRate.available = false`, 하드코딩 메시지 | 대시보드 심박 섹션이 비어 있음 | 중 |
| 2 | **QR requireSigned 기본 false** — v1 평문 QR 허용 상태 | 보안 취약 (프로덕션 전환 필요) | 상 |
| 3 | **QR 발급 서버 분리** — `/api/tablet/qr/issue` 는 개발용, 실제 발급은 cama-plus-server | 배포 시 설정 필요 | 중 |
| 4 | **WebView 보안** — `MIXED_CONTENT_ALWAYS_ALLOW`, `usesCleartextTraffic=true` | 개발 편의, 프로덕션 HTTPS 필요 | 하 |

### 10.2 개선 제안

| # | 제안 | 설명 |
|---|------|------|
| 1 | **심박수 연동** | `cama-plus-server` 또는 외부 헬스 API 연동 |
| 2 | **QR requireSigned=true 전환** | 프로덕션 배포 전 v1 평문 QR 차단 |
| 3 | **Error handling 강화** | ScanPage/DashboardPage 모두 에러 바운더리 및 재시도 로직 부재 |
| 4 | **DashboardPage 새로고침** | `location.state` 로 데이터 전달 시 새로고침 손실 → `fetchDashboard` 폴백 있음 |
| 5 | **로딩 상태 개선** | 단순 텍스트 "로딩 중…" 대신 Skeleton UI 적용 |
| 6 | **네트워크 타임아웃** | API 호출 시 timeout 설정 (axios) |
| 7 | **WebView 뒤로가기** | `onBackPressed()` 에서 `canGoBack()` 지원하나 WebView 내 navigation UX 개선 가능 |
| 8 | **화면 회전** | `configChanges` 에 orientation 포함, landscape 고정 |
| 9 | **QR 카메라 UI** | 현재 검은 배경 + 안내문 + 취소 버튼만 있음, 스캔 가이드 오버레이 개선 가능 |
| 10 | **QR 발급 공유 secret** | cama-tablet-server와 cama-plus-server 간 `cama.tablet.qr.secret` 동기화 필요 |

### 10.3 참고 문서

| 문서 | 위치 |
|------|------|
| CAFE24_TABLET_QR_DASHBOARD.md | `docs/CAFE24_TABLET_QR_DASHBOARD.md` |
| 배포 가이드 | `docs/CAFE24_DEPLOYMENT_GUIDE.md` |
| 세션 핸드오프 | `docs/CAFE24_SESSION_HANDOFF_2026-06-17-APK-ADMIN.md` |

---

> **파일 위치:** `docs/ANALYSIS_CAMA_TABLET.md`