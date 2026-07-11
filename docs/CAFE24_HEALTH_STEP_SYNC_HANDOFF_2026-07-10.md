# Cafe24 건강 데이터 · 걸음수 자동동기화 작업 인계 (2026-07-10)

> **범위:** 걸음수 포그라운드 자동 sync, 의사앱 자료전송 전 sync, 건강 데이터·배치 구조 정리, VPS SPA 배포  
> **프로덕션:** https://camaplus.cafe24.com  
> **선행 문서:** [CAFE24_WEBVIEW_MYPAGE_HANDOFF_2026-07-09.md](./CAFE24_WEBVIEW_MYPAGE_HANDOFF_2026-07-09.md) · [CAFE24_DOCTOR_TRANSFER_FEATURE.md](./CAFE24_DOCTOR_TRANSFER_FEATURE.md) · [CAFE24_STEP_COUNT_DESIGN.md](./CAFE24_STEP_COUNT_DESIGN.md) · [CAFE24_USER_HEALTH_DATA.md](./CAFE24_USER_HEALTH_DATA.md)

---

## 1. 작업 배경

의사앱 자료전송(BLE) 및 태블릿 대시보드에서 걸음·심박 데이터를 쓰려면 **폰 → 서버 자동 적재**가 선행되어야 한다.  
기존에는 걸음수가 **신체활동 코칭 팝업 확인 시에만** `PUT /api/coaching/service/step`으로 저장되었고, 로그인·포그라운드 시 자동 전송은 없었다.

이번 세션에서 **걸음수 Phase A(포그라운드 sync)** 를 구현·배포하고, 심박수·배치·저장 구조에 대한 설계 논의를 문서화했다.

---

## 2. 완료된 작업 요약

| # | 항목 | 상태 |
|---|------|------|
| 1 | 걸음수 자동 sync 설계 확인 (앱 로그인·활성 시 서버 전송 필요) | ✅ |
| 2 | `saveWebviewStep` API 클라이언트 (`PUT /api/webview/track/service/step`) | ✅ |
| 3 | `syncTodaySteps()` — 네이티브 읽기 → 서버 upsert | ✅ |
| 4 | `useForegroundStepSync` — 로그인 후 mount + 포그라운드(1분 throttle) | ✅ |
| 5 | `_auth.tsx` 레이아웃에 훅 연결 (전 인증 라우트 공통) | ✅ |
| 6 | 의사앱 자료전송 `handleSend` 직전 `syncTodaySteps()` + stepList 재조회 | ✅ |
| 7 | SPA VPS 배포 (441 files) | ✅ |
| 8 | 심박수 자동 sync 요건 정리 (네이티브 선행 필요) | ✅ 문서화 |
| 9 | `cama-back-batch` vs 건강 데이터 역할 정리 | ✅ 문서화 |

---

## 3. 걸음수 자동 동기화 (구현 완료 · 배포됨)

### 3.1 동작 조건

| 시점 | 동작 |
|------|------|
| 로그인 후 `/_auth` 진입 | `accountSeq` 로드 후 1회 sync |
| 앱/탭 포그라운드 복귀 | `visibilitychange` → 재 sync (최소 1분 간격) |
| 의사앱 자료전송 [태블릿으로 전송] | sync → stepList 재조회 → payload 재구성 → BLE |

**제한**

- **CAMA Plus RN WebView**에서만 동작 (`isReactNativeWebView()`)
- Android `ACTIVITY_RECOGNITION` 권한 필요
- 일반 브라우저 단독 접속 시 스킵
- **새 APK 불필요** (SPA 변경만)

### 3.2 데이터 흐름

```text
[CAMA Plus 앱 WebView]
  requestNativeStepCount()  (getStepCount 브릿지)
       ↓
  PUT /api/webview/track/service/step
    { accountSeq, executionDate: "YYYY-MM-DD", stepNum }
       ↓
  account_step_history  (일별 1건 upsert)
```

### 3.3 일별 저장 규칙 (서버)

| 테이블 | 단위 | 규칙 |
|--------|------|------|
| `account_step_history` | **일별 1행** | `account_seq` + `execution_date` 당 `step_num` (총 걸음) UPDATE 또는 INSERT |

같은 날 여러 번 sync해도 **그날 총합 1건**만 갱신된다. 시간대별 이력이 아니다.

### 3.4 추가·변경 파일

| 구분 | 경로 |
|------|------|
| API | `react-app-dawplus/src/apis/api/webview/track.ts` — `saveWebviewStep` |
| 타입 | `react-app-dawplus/src/apis/types/webview.types.ts` — `WebviewStepSaveParams` |
| 유틸 | `react-app-dawplus/src/lib/health/syncTodaySteps.ts` |
| 훅 | `react-app-dawplus/src/hooks/useForegroundStepSync.ts` |
| 연결 | `react-app-dawplus/src/routes/_auth.tsx` |
| 의사전송 | `react-app-dawplus/src/components/mypage/DoctorTransferPage.tsx` |

### 3.5 배포

```powershell
cd F:\cama_pjt\cama-cafe24
node deploy/scripts/build-react-app-cafe24.mjs
python deploy/scripts/vps-deploy-react-app.py
```

| 항목 | 결과 |
|------|------|
| 대상 | `https://camaplus.cafe24.com` |
| 경로 | `/opt/cama/www/react-app` |
| 파일 수 | 441 |
| 스모크 | `/webview/help`, `/help` → HTTP 200 |

---

## 4. 의사앱 자료전송과의 관계

**올바른 구조**

```text
[상시] 폰 센서 → 서버 DB (account_step_history)
              ↓
[필요 시] 의사앱 자료전송 → 서버/네이티브 조회 → BLE → cama-tablet
```

BLE 전송만으로 서버에 올리면, 코칭·앱 미사용 일 데이터가 비게 된다.  
전송 직전 `syncTodaySteps()`로 **서버를 최신화**한 뒤 `stepList` + 네이티브 걸음으로 payload를 만든다.

---

## 5. 심박수 자동 동기화 (미구현 · 요건 정리)

걸음수와 **동일 패턴**으로 만들 수 있으나, **네이티브 읽기가 stub**이라 SPA만으로는 불가. **새 APK 필요.**

| 구분 | 걸음수 | 심박수 |
|------|--------|--------|
| 서버 API | ✅ `PUT …/step` | ✅ `PUT …/vital` |
| SPA 저장 | ✅ `saveWebviewStep` | ✅ `saveHeartRateRecord` |
| SPA 자동 sync | ✅ 구현·배포 | ❌ |
| 네이티브 읽기 | ✅ `getStepCount` | ❌ `readVital` = NOT_IMPLEMENTED |

### 5.1 걸음수와 설계 차이

- **걸음:** 일별 **총합 1개** (`execution_date` + `step_num`)
- **심박:** **측정 시각별** 여러 건 (`account_vital_history`, `measured_at` + `HEART_RATE`)

자동 sync 시 Health Connect(Android) / HealthKit(iOS)에서 **오늘 샘플 목록**을 읽어 `PUT vital` 또는 batch로 올리는 것이 적절하다.

### 5.2 구현 로드맵 (향후)

1. **Android** — Health Connect `HeartRateRecord` read + 권한
2. **iOS** — HealthKit `HKQuantityTypeIdentifierHeartRate` samples
3. **SPA** — `syncHeartRate()` + `useForegroundHealthSync`(걸음+심박 통합 또는 병렬)
4. **(선택)** `PUT /api/webview/track/service/vital/batch` 서버 추가
5. 의사앱 전송 payload에 `vitalList` 반영

---

## 6. cama-back-batch와 건강 데이터

VPS Docker `cama-back-batch`는 Spring `@Scheduled`로 상시 실행. **폰에서 걸음·심박을 수집하지 않는다.**

### 6.1 배치가 하는 일 (`RunTask.java`)

| 잡 | 시각 (KST) | 내용 |
|----|-----------|------|
| `batchCheck` ~ `3` | 매 1분 | 복약·내원·멘탈 **일정 FCM** |
| `batchCheck4` ~ `6` | 10:00, 15:00 | 암정보 가이드 FCM |
| `batchCheck11` ~ `14` | 09~17시 | 코칭(수면·식습관·**신체활동**·운동) FCM |
| `dayOneBatch` | 01:00 | 만료 `track_service` → CANCEL |
| `accountStatisticsBatch` | 23:00 | `account_cnt_statistics` |

> `batchCheck13`(11:00 신체활동)은 **발걸음 FCM**이지 걸음수 DB 적재가 아니다. SQL의 `step_day_cd`는 코칭 **일차** 의미.

### 6.2 건강 데이터별 배치 여부

| 데이터 | 배치 수집 | 배치 집계 |
|--------|----------|----------|
| **걸음수** | ❌ | ❌ |
| **심박 원시** | ❌ | ❌ |
| **심박 일별 통계** | — | ⚠️ `HeartRateStatisticsMapper` 있음, `RunTask`에 `heartRateStatisticsBatch` **미연결**(현재 소스). 수동: `deploy/scripts/vps-run-heart-rate-statistics-batch.py` |

**걸음·심박 원시 저장 경로:** 앱(WebView) → `cama-plus-server` API → PostgreSQL

---

## 7. 건강 데이터 저장 한눈에 보기

| 항목 | 테이블 | 저장 단위 | 적재 주체 |
|------|--------|----------|----------|
| 걸음수 | `account_step_history` | 일별 1건 | **앱 API** (자동 sync 포함) |
| 심박 원시 | `account_vital_history` | 측정 시각별 | 앱 API (미연동) |
| 심박 일별 통계 | `account_heart_rate_statistics` | 일별 1건 | 배치(또는 수동 SQL) |
| 코칭 걸음 | `coaching` 경로 API | 코칭 일차 | 코칭 UI 확인 시 |

---

## 8. 미완료 · 후속 작업

| 우선순위 | 항목 |
|----------|------|
| P1 | **새 APK 배포** (1.2.11) — Health Connect 심박 read |
| P1 | 실기기 E2E: Health Connect 권한 → 자동 sync → 헬스케어 연동 버튼 |
| P1 | **서버 JAR 배포** — `POST /api/webview/track/service/vital/batch` |
| P1 | SPA VPS 재배포 (심박 sync + 걸음수 헬스케어 버튼) |
| P2 | iOS HealthKit 심박 read |
| P2 | `RunTask.heartRateStatisticsBatch` 재연결 |
| P3 | 의사전송 payload에 vitalList 반영 |

---

## 9. 심박수 연동 (2026-07-11 추가)

### Android Health Connect

- `HealthConnectHeartRateReader.kt` — 최근 N일 심박 샘플 read
- `HealthConnectPermissionLauncher.kt` — READ_HEART_RATE 권한
- `CamaNativeBridgeModule.readVital` / `readVitalSamples`
- minSdk **26**, APK **1.2.11** (versionCode 29)

### SPA

- `syncHeartRate()` → `POST /api/webview/track/service/vital/batch`
- `useForegroundHealthSync` — 걸음 + 심박(오늘) 포그라운드 sync
- 마이페이지 걸음수 하단 **헬스케어 연동** 버튼 (최근 7일 수동 sync)

### 서버

- `VitalRestController.saveWebviewVitalBatch` — `account_vital_history` 일괄 upsert

---

## 10. 검증 체크리스트

### 걸음 자동 sync (SPA 배포 후)

- [ ] CAMA Plus 앱 로그인 → 당일 `account_step_history` 행 생성/갱신
- [ ] 앱 백그라운드 → 포그라운드 후 `step_num` 증가 반영
- [ ] 마이페이지 걸음수 (`stepList`) 차트 갱신
- [ ] 권한 거부 시 sync 실패해도 앱 크래시 없음

### 심박 자동·수동 sync (APK + SPA + 서버 배포 후)

- [ ] Health Connect 설치·심박 권한 허용
- [ ] 로그인 후 `account_vital_history`에 당일 HEART_RATE 행 생성
- [ ] 마이페이지 → 걸음수 → **헬스케어 연동** → N건 저장 토스트
- [ ] 권한 거부·데이터 없음 시 적절한 토스트

### 의사앱 자료전송

- [ ] 전송 직전 sync 후 JSON `steps` / `stepsHistory` 최신
- [ ] BLE 전송 성공 (태블릿 QR 화면 + Android APK)

---

## 10. 관련 파일 인덱스

```
react-app-dawplus/
  src/apis/api/webview/track.ts          # saveWebviewStep, fetchCareTrackStepList
  src/apis/api/webview/vital.ts          # saveHeartRateRecord (심박, 미연동)
  src/lib/health/syncTodaySteps.ts
  src/hooks/useForegroundStepSync.ts
  src/routes/_auth.tsx
  src/components/mypage/DoctorTransferPage.tsx

cama-plus-app/
  src/utils/bridgeHandlers.ts            # getStepCount ✅, readVital stub
  android/.../CamaStepCounterModule.java
  android/.../CamaNativeBridgeModule.java  # readVital NOT_IMPLEMENTED

cama-plus-server/
  .../TrackRestController.java           # PUT webview/track/service/step
  .../CareTrackMapper.xml                # saveCareTrackStepInfo (일별 upsert)
  .../VitalRestController.java           # PUT webview/track/service/vital

cama-back-batch/
  src/.../tasks/RunTask.java             # FCM·트랙·계정통계 (걸음 수집 없음)
  src/.../mapper/HeartRateStatisticsMapper.xml

deploy/scripts/
  build-react-app-cafe24.mjs
  vps-deploy-react-app.py
  vps-run-heart-rate-statistics-batch.py
```

---

*갱신 시 [CAFE24_STEP_COUNT_DESIGN.md](./CAFE24_STEP_COUNT_DESIGN.md) · [CAFE24_USER_HEALTH_DATA.md](./CAFE24_USER_HEALTH_DATA.md) · [BILLIVE_CAFE24_GAP_TODO.md](./BILLIVE_CAFE24_GAP_TODO.md) 와 함께 유지.*
