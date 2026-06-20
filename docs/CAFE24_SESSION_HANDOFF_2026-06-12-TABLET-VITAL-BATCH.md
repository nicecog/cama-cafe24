# Cafe24 세션 핸드오프 — 태블릿 QR · 생체신호 · 심박 통계 · VPS 배포

> **작성일:** 2026-06-12  
> **워크스페이스:** `F:\cama_pjt\cama-cafe24`  
> **VPS:** `210.114.18.156` · `https://camaplus.cafe24.com`  
> **이전 세션:** [CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md)

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| **태블릿 QR 대시보드** (3모듈 스켈레톤) | ✅ 로컬 구현 — VPS 미배포 |
| **QR v2 서명·만료 JWT** | ✅ `cama-plus-server` 코드 + VPS API 배포 |
| **생체신호 원시 테이블** `account_vital_history` | ✅ DDL + API + **VPS 적용** |
| **심박 일별 통계** `account_heart_rate_statistics` | ✅ DDL + 배치 + **VPS 적용** |
| **cama-plus-server** VPS 재배포 | ✅ 2026-06-12 |
| **cama-back-batch** VPS 재배포 | ✅ 2026-06-12 |
| 환자 앱 QR 화면 | ⏳ 미구현 |
| 태블릿 앱·웹·서버 VPS 배포 | ⏳ 미구현 |
| `CAMA_TABLET_QR_SECRET` 운영 설정 | ⏳ `.env` 미설정(기본값) |

---

## 2. 태블릿 QR 대시보드 (신규 3모듈)

### 2.1 디렉터리

| 경로 | 역할 | 포트(로컬) |
|------|------|------------|
| `cama-tablet-android/` | WebView + CameraX/ML Kit QR | — |
| `cama-tablet-web/` | React 가로 대시보드 (Recharts) | **5175** |
| `cama-tablet-server/` | Spring Boot 집계 API | **8090** |

상세: [CAFE24_TABLET_QR_DASHBOARD.md](CAFE24_TABLET_QR_DASHBOARD.md)

### 2.2 데이터 흐름

```text
환자앱 QR 발급 → 태블릿 Android 스캔 → React 대시보드
  → POST /api/tablet/scan (tablet-server 또는 plus-server 병합 예정)
  → account_step_history, coaching, cm_contents, account_heart_rate_statistics
```

### 2.3 Android (`cama-tablet-android`)

| 파일 | 역할 |
|------|------|
| `MainActivity.kt` | WebView, `AndroidBridge.startQrScan()` |
| `QrScanActivity.kt` | CameraX + ML Kit QR |
| `WebAppBridge.kt` | JS ↔ Native |
| `BuildConfig.TABLET_WEB_URL` | 에뮬: `http://10.0.2.2:5175` |

### 2.4 React (`cama-tablet-web`)

| 경로 | 화면 |
|------|------|
| `/` | QR 스캔 (네이티브 브릿지 / 브라우저 테스트 prompt) |
| `/dashboard/:accountSeq` | 가로 3열 — 발걸음·코칭·문의·심박(placeholder) |

브릿지: `src/lib/nativeBridge.ts` — 이벤트 `cama-tablet-native`

### 2.5 Tablet API (`cama-tablet-server`) — 로컬만

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/tablet/health` | 헬스 |
| POST | `/api/tablet/scan` | QR 파싱 + 대시보드 집계 |
| GET | `/api/tablet/dashboard/{accountSeq}` | 재조회 |
| POST | `/api/tablet/qr/issue` | 로컬 dev 발급 (`allow-dev-issue`) |

---

## 3. QR 서명·만료 토큰 (v2)

### 3.1 페이로드

```json
{ "v": 2, "t": "<JWT>" }
```

| 항목 | 값 |
|------|-----|
| 서명 | HMAC-SHA256 |
| Secret | `CAMA_TABLET_QR_SECRET` (plus-server · tablet-server 동일) |
| Issuer | `cama-tablet-qr` |
| TTL | 300초 (5분) |
| 클레임 | `accountSeq`, `loginId` |

### 3.2 발급 API (`cama-plus-server` — VPS 배포됨)

```http
POST /api/tablet/qr/issue
api_key: <환자 JWT>
```

응답 `qrPayload` 문자열을 QR 이미지로 인코딩.

### 3.3 주요 파일

| 모듈 | 파일 |
|------|------|
| plus-server | `TabletQrTokenService.java`, `TabletQrRestController.java`, `TabletQrProperties.java` |
| tablet-server | `TabletQrTokenService.java`, `QrPayloadParser.java` (v2 검증) |

### 3.4 운영 TODO

- VPS `.env.cafe24`에 `CAMA_TABLET_QR_SECRET` 설정
- `cama.tablet.qr.require-signed: true` (v1 평문 QR 차단)
- `docker-compose.cafe24.yml`에 env 전달 (선택)

---

## 4. 생체신호 · 심박 DB

### 4.1 기존 발걸음 (참고)

| 테이블 | 설명 |
|--------|------|
| `account_step_history` | 일별 `step_num` — 이미 운영 DB 존재 |

### 4.2 신규 — 원시 생체신호

**테이블:** `account_vital_history`

| 컬럼 | 설명 |
|------|------|
| `account_seq` | 환자 |
| `measured_at` | 측정 시각 (timestamptz) |
| `vital_type_cd` | `HEART_RATE`, `BP_SYSTOLIC`, `BP_DIASTOLIC`, `SPO2`, `BODY_TEMP`, `RESPIRATORY_RATE` |
| `value_num` | 측정값 |
| `unit` | bpm, mmHg, %, C 등 |
| `source_cd` | `MANUAL`, `PHONE`, `WEARABLE` |

**유니크:** `(account_seq, vital_type_cd, measured_at)` → 동일 시각·유형 upsert

**DDL:** `deploy/sql/cafe24-account-vital-history.sql`  
**로컬 DDL:** `cama-plus-server/docs/cama_vital_schema.sql`

### 4.3 신규 — 심박 일별 통계

**테이블:** `account_heart_rate_statistics`

| 컬럼 | 설명 |
|------|------|
| `account_seq`, `stat_date` | PK 유니크 |
| `sample_count` | 당일 측정 건수 |
| `min_bpm`, `max_bpm`, `avg_bpm` | 일 통계 |
| `first_measured_at`, `last_measured_at` | 당일 첫·마지막 측정 |

**DDL:** `deploy/sql/cafe24-account-heart-rate-statistics.sql`  
**로컬 DDL:** `cama-plus-server/docs/cama_heart_rate_statistics_schema.sql`

---

## 5. cama-plus-server API (생체신호)

**컨트롤러:** `VitalRestController.java`  
**서비스:** `VitalRecordService.java`  
**Mapper:** `VitalMapper.xml`

| Method | Path | 설명 |
|--------|------|------|
| PUT | `/api/track/service/vital` | 단건 저장 (환자 JWT) |
| PUT | `/api/webview/track/service/vital` | WebView 저장 |
| POST | `/api/track/service/vital/batch` | 일괄 저장 |
| POST | `/api/track/service/vitalList` | 이력 조회 |
| POST | `/api/webview/track/service/vitalList` | WebView 조회 |

**저장 예시 (심박):**

```json
PUT /api/track/service/vital
{
  "measuredAt": "2026-06-12 14:30:00",
  "vitalTypeCd": "HEART_RATE",
  "valueNum": 72,
  "sourceCd": "WEARABLE"
}
```

**범위 검증:** 심박 20~300 bpm 등 (`VitalRecordService`)

---

## 6. cama-back-batch — 심박 통계 배치

### 6.1 스케줄

| Cron (KST) | 메서드 | 설명 |
|------------|--------|------|
| `0 30 0 * * ?` | `heartRateStatisticsBatch` | **전일** HEART_RATE → `account_heart_rate_statistics` upsert |

### 6.2 구현

| 파일 | 역할 |
|------|------|
| `HeartRateStatisticsMapper.java` | MyBatis 인터페이스 |
| `HeartRateStatisticsMapper.xml` | `INSERT … SELECT … ON CONFLICT` |
| `RunTask.runHeartRateStatisticsBatch()` | 전일 `LocalDate` 집계 |

로컬 수동: `GET /api/batch/dev/run/heart-rate-statistics` (`local-cafe24` 프로필)

### 6.3 VPS 수동 집계 (HTTP API 없음)

```powershell
python deploy/scripts/vps-run-heart-rate-statistics-batch.py
```

---

## 7. VPS 배포 (2026-06-12 수행)

### 7.1 순서

```powershell
cd F:\cama_pjt\cama-cafe24
python deploy/scripts/vps-apply-vital-schema.py      # DDL 2종
python deploy/scripts/vps-deploy-server-src.py       # plus-server JAR
python deploy/scripts/vps-deploy-batch-src.py        # batch JAR
python deploy/scripts/vps-smoke-vital-batch.py       # 검증
```

### 7.2 신규 배포 스크립트

| 스크립트 | 용도 |
|----------|------|
| `vps-apply-vital-schema.py` | `account_vital_history` + `account_heart_rate_statistics` |
| `vps-deploy-batch-src.py` | batch 소스 zip → VPS Maven → JAR → restart |
| `make-batch-src-zip.py` | batch 소스 zip 생성 |
| `vps-smoke-vital-batch.py` | 테이블·컨테이너·API 스모크 |
| `vps-verify-vital-api.py` | localhost vital/QR HTTP 코드 확인 |
| `vps-run-heart-rate-statistics-batch.py` | 통계 SQL 수동 실행 |

기존 서버 배포: `vps-deploy-server-src.py` (변경 없음)

### 7.3 스모크 결과 (2026-06-12)

| 체크 | 결과 |
|------|------|
| `account_vital_history` | ✅ |
| `account_heart_rate_statistics` | ✅ |
| `cama-plus-server` / `cama-back-batch` Up | ✅ |
| API localhost recover | HTTP 200 |
| `PUT /api/track/service/vital` (무인증) | HTTP 401 (엔드포인트 존재) |
| 심박 통계 행 | 0건 (원시 HEART_RATE 데이터 없음) |

---

## 8. 로컬 개발

### 8.1 태블릿 스택

```powershell
# tablet API
cd cama-tablet-server
mvn spring-boot:run -Dspring-boot.run.profiles=local

# tablet web
cd cama-tablet-web
npm run dev

# Android Studio → cama-tablet-android
```

### 8.2 plus-server / batch

```powershell
cd cama-plus-server
mvn test -Dtest=VitalRecordServiceTest
mvn compile

cd cama-back-batch
mvn compile
```

---

## 9. 다음 작업 (우선순위)

| # | 작업 |
|---|------|
| 1 | 환자 앱 `cama-plus-app` — QR 표시 (`POST /api/tablet/qr/issue`) |
| 2 | 환자 앱 — 심박 저장 (`PUT /api/track/service/vital`) 연동 |
| 3 | `CAMA_TABLET_QR_SECRET` VPS `.env` 설정 |
| 4 | `cama-tablet-server` VPS 배포 또는 `cama-plus-server`에 tablet API 병합 |
| 5 | 태블릿 대시보드 심박 차트 — `account_heart_rate_statistics` 조회 연동 |
| 6 | Android 태블릿 앱 실기기 E2E |
| 7 | Git commit / push (본 세션 변경분) |

---

## 10. 변경 파일 목록 (요약)

### cama-plus-server

- `VitalRestController.java`, `VitalRecordService.java`, `VitalMapper.*`
- `TabletQrRestController.java`, `TabletQrTokenService.java`, `TabletQrProperties.java`
- `dto/track/VitalRecord*.java`, `dto/tablet/TabletQrIssueRsp.java`
- `application.yml` — `cama.tablet.qr.*`

### cama-back-batch

- `HeartRateStatisticsMapper.java`, `HeartRateStatisticsMapper.xml`
- `RunTask.java` — `heartRateStatisticsBatch`
- `BatchDevController.java` — `heart-rate-statistics` job
- `mybatis-config.xml`

### deploy

- `sql/cafe24-account-vital-history.sql`
- `sql/cafe24-account-heart-rate-statistics.sql`
- `scripts/vps-apply-vital-schema.py`, `vps-deploy-batch-src.py`, …

### 태블릿 (로컬만)

- `cama-tablet-android/`, `cama-tablet-web/`, `cama-tablet-server/` 전체 스켈레톤

---

## 11. 관련 문서

- [CAFE24_TABLET_QR_DASHBOARD.md](CAFE24_TABLET_QR_DASHBOARD.md)
- [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)
- [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md)
- [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md)
