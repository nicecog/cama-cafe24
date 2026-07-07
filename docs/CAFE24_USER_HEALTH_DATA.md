# Cafe24 사용자 건강 데이터 저장 정리

> **작성일:** 2026-06-20  
> **대상:** Cafe24 운영 DB(`cama`, PostgreSQL) + `cama-plus-server` API  
> **연관:** [CAFE24_VITAL_HEART_RATE.md](CAFE24_VITAL_HEART_RATE.md) · [CAFE24_NATIVE_BRIDGE.md](CAFE24_NATIVE_BRIDGE.md) · [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)

---

## 1. 전체 구조

```text
[앱/WebView] ──API──► cama-plus-server (:8080)
                          │
                          ├─ account_step_history           (걸음수, 일별)
                          ├─ account_vital_history          (심박·생체신호, 측정 시각별)
                          └─ account_heart_rate_statistics  (심박 일별 집계)

[cama-back-batch] ──매일 00:30 KST──► account_heart_rate_statistics upsert
```

| 구분 | 테이블 | 단위 | 비고 |
|------|--------|------|------|
| **걸음수** | `account_step_history` | **일별 1건** | 사용자·날짜당 upsert |
| **생체신호 원시** | `account_vital_history` | **측정 시각별** | 심박·혈압·SpO2 등 |
| **심박 일별 통계** | `account_heart_rate_statistics` | **일별 1건** | 배치가 원시에서 집계 |

**DDL**

- `deploy/sql/cafe24-account-vital-history.sql`
- `deploy/sql/cafe24-account-heart-rate-statistics.sql`
- `cama-plus-server/docs/cama_schema.sql` (`account_step_history` 등)

---

## 2. 걸음수 (`account_step_history`)

### 2.1 DB 컬럼

| 컬럼 | 설명 |
|------|------|
| `seq` | PK |
| `account_seq` | 사용자 ID |
| `execution_date` | 날짜 (`YYYY-MM-DD` 문자열) |
| `step_num` | 해당 일 **총 걸음수** |
| `created_at` / `updated_at` | 등록·수정 시각 |

**저장 규칙:** 같은 `account_seq` + `execution_date`면 **UPDATE**(덮어쓰기), 없으면 INSERT.

```sql
-- CareTrackMapper.xml saveCareTrackStepInfo
UPDATE account_step_history SET step_num = ?, updated_at = now()
 WHERE execution_date = ? AND account_seq = ?
-- 없으면 INSERT
```

### 2.2 API

| Method | 경로 | 용도 |
|--------|------|------|
| PUT | `/api/track/service/step` | 걸음수 저장 (앱 JWT) |
| PUT | `/api/webview/track/service/step` | 걸음수 저장 (WebView, body에 `accountSeq`) |
| PUT | `/api/coaching/service/step` | 건강코칭에서 걸음 저장 (`loginId` 기준) |
| POST | `/api/track/service/stepList` | 일별 걸음 목록 조회 |
| POST | `/api/webview/track/service/stepList` | WebView용 조회 |

**요청 DTO (`StepRequest`)**

```json
{
  "accountSeq": 121,
  "executionDate": "2026-06-20",
  "stepNum": 5432
}
```

### 2.3 클라이언트 → 서버 흐름

1. **Android 앱** `getStepCount` 브릿지 → 오늘 걸음수 (`ACTIVITY_RECOGNITION` / STEP_COUNTER)
2. **SPA** `requestNativeStepCount()` → `PUT /api/webview/track/service/step`
3. **관리자 모니터링** `MonitorMapper` → `avg_step`(일평균 걸음) 집계 표시
4. **태블릿 대시보드** `cama-tablet-server` → 최근 14일·오늘·7일 평균 조회

### 2.4 관련 코드

| 구분 | 경로 |
|------|------|
| API | `cama-plus-server/.../TrackRestController.java` |
| | `cama-plus-server/.../CoachingRestController.java` (`coaching/service/step`) |
| Mapper | `cama-plus-server/.../mapper/CareTrackMapper.xml` |
| SPA | `react-app-dawplus/src/apis/api/webview/track.ts` |
| RN 브릿지 | `cama-plus-app` `getStepCount` · `docs/CAFE24_NATIVE_BRIDGE.md` |
| 태블릿 | `cama-tablet-server/.../TabletDashboardMapper.xml` (`findRecentSteps` 등) |

---

## 3. 심박·생체신호 (`account_vital_history`)

2026-06에 추가된 **통합 생체신호 이력** 테이블.

### 3.1 DB 컬럼

| 컬럼 | 설명 |
|------|------|
| `seq` | PK |
| `account_seq` | 사용자 ID |
| `measured_at` | 측정 시각 (timestamptz) |
| `vital_type_cd` | 신호 종류 코드 |
| `value_num` | 측정값 |
| `unit` | 단위 (bpm, mmHg, %, ℃ 등) |
| `source_cd` | 측정 출처 (`MANUAL`, `PHONE`, `WEARABLE`) |
| `memo` | 메모 (선택) |
| `created_at` / `updated_at` | 등록·수정 시각 |

**중복 방지:** `(account_seq, vital_type_cd, measured_at)` 유니크 → 같은 시각·종류면 **값 갱신**.

### 3.2 지원 `vital_type_cd`

| 코드 | 의미 | 단위 | 허용 범위 |
|------|------|------|-----------|
| `HEART_RATE` | 심박수 | bpm | 20~300 |
| `BP_SYSTOLIC` | 수축기 혈압 | mmHg | 50~300 |
| `BP_DIASTOLIC` | 이완기 혈압 | mmHg | 30~200 |
| `SPO2` | 산소포화도 | % | 50~100 |
| `BODY_TEMP` | 체온 | C | 30~45 |
| `RESPIRATORY_RATE` | 호흡수 | /min | 5~60 |

검증: `VitalRecordService.java` (`validateRange`)

### 3.3 `source_cd`

| 코드 | 의미 |
|------|------|
| `MANUAL` | 사용자 직접 입력 (기본값) |
| `PHONE` | 스마트폰 센서/앱 |
| `WEARABLE` | 웨어러블 기기 |

### 3.4 API

| Method | 경로 | 용도 |
|--------|------|------|
| PUT | `/api/track/service/vital` | 단건 저장 |
| PUT | `/api/webview/track/service/vital` | WebView 단건 저장 |
| POST | `/api/track/service/vital/batch` | 여러 건 일괄 저장 |
| POST | `/api/track/service/vitalList` | 이력 조회 |
| POST | `/api/webview/track/service/vitalList` | WebView 이력 조회 |

**요청 예 (심박)**

```json
{
  "accountSeq": 121,
  "measuredAt": "2026-06-20 15:30:00",
  "vitalTypeCd": "HEART_RATE",
  "valueNum": 72,
  "unit": "bpm",
  "sourceCd": "PHONE"
}
```

**SPA 헬퍼:** `saveHeartRateRecord()` → `vitalTypeCd: "HEART_RATE"`, `sourceCd: "PHONE"` 기본.

### 3.5 현재 연동 상태

| 경로 | 상태 |
|------|------|
| API·DB·서버 검증 | ✅ 구현됨 |
| SPA `saveHeartRateRecord()` | ✅ 구현됨 |
| RN `requestNativeVitalReading()` | ⏳ stub (센서 자동 측정 미구현) |
| 태블릿 대시보드 심박 | ⏳ `available: false` ("추후 연동 예정") |

### 3.6 관련 코드

| 구분 | 경로 |
|------|------|
| Controller | `cama-plus-server/.../VitalRestController.java` |
| Service | `cama-plus-server/.../VitalRecordService.java` |
| Mapper | `cama-plus-server/.../mapper/VitalMapper.xml` |
| SPA | `react-app-dawplus/src/apis/api/webview/vital.ts` |
| RN | `useNativeDevice` · `requestNativeVitalReading()` |

---

## 4. 심박 일별 통계 (`account_heart_rate_statistics`)

`account_vital_history` 중 `HEART_RATE`만 **일별 집계**.

### 4.1 DB 컬럼

| 컬럼 | 설명 |
|------|------|
| `account_seq` | 사용자 |
| `stat_date` | 집계일 (KST) |
| `sample_count` | 그날 측정 건수 |
| `min_bpm` / `max_bpm` / `avg_bpm` | 최저·최고·평균 심박 |
| `first_measured_at` / `last_measured_at` | 당일 첫·마지막 측정 시각 |

유니크: `(account_seq, stat_date)`

### 4.2 배치

| 항목 | 값 |
|------|-----|
| 서비스 | `cama-back-batch` |
| Cron | `0 30 0 * * ?` (매일 **00:30 KST**) |
| Job | `heartRateStatisticsBatch` |
| Mapper | `HeartRateStatisticsMapper.xml` |
| 동작 | 전일 `HEART_RATE` 원시 → upsert |

VPS 수동 실행: `python deploy/scripts/vps-run-heart-rate-statistics-batch.py`

---

## 5. 기타 건강 관련 데이터 (참고)

센서 수치는 아니지만 **건강·코칭** 맥락에서 함께 저장되는 정보.

| 테이블 | 내용 |
|--------|------|
| `coaching_user_answer_info` | 건강코칭(수면·식습관·운동·멘탈 등) 일차별 답변 |
| `coaching_user_add_answer_info` | 코칭 추가 답변 |
| `coaching_account_exercise_class` | 운동 평가·프로그램 등급 |
| `coaching_exercise_progress_result_hst` | 운동 설문 결과 |
| `account_schedule` | 일정(복약·내원·기타) |
| `account_batch_schedule` | 일정 FCM 알림용 배치 행 (`cama-back-batch`가 매분 조회) |

관리자 모니터링(`MonitorMapper`)에서는 코칭 진행률·`avg_step` 등을 조회용으로 합산.

---

## 6. 데이터 흐름

```mermaid
flowchart LR
  subgraph Client
    A[Android 걸음 센서]
    B[WebView SPA]
    C[수동 입력]
  end

  subgraph API[cama-plus-server]
    S[PUT step]
    V[PUT vital]
  end

  subgraph DB[(PostgreSQL cama)]
    SH[account_step_history]
    VH[account_vital_history]
    HS[account_heart_rate_statistics]
  end

  subgraph Batch[cama-back-batch]
    BJ[heartRateStatisticsBatch]
  end

  A --> B --> S --> SH
  C --> V --> VH
  VH --> BJ --> HS
```

---

## 7. 한눈에 보기

| 항목 | 저장 테이블 | 자동 수집 | 서버 API | 비고 |
|------|-------------|-----------|----------|------|
| **걸음수** | `account_step_history` | Android ✅ | ✅ | 일별 1건 upsert |
| **심박수(원시)** | `account_vital_history` | stub ⏳ | ✅ | `HEART_RATE` |
| **혈압·SpO2·체온·호흡** | `account_vital_history` | stub ⏳ | ✅ | 동일 API |
| **심박 일별 통계** | `account_heart_rate_statistics` | 배치 ✅ | 전용 조회 API 없음* | 리포트·집계용 |
| **코칭 답변** | `coaching_user_answer_info` 등 | 앱 입력 | ✅ | 설문·자가기록 |
| **일정·복약 알림** | `account_schedule` 등 | 사용자 등록 | ✅ | FCM은 batch |

\* 심박 통계는 배치가 채움. 원시 조회는 `vitalList` API 사용.

---

## 8. 후속 작업 (미구현)

| 항목 | 설명 |
|------|------|
| RN 심박/웨어러블 브릿지 | `requestNativeVitalReading()` 실구현 (Health Connect / HealthKit) |
| 태블릿 심박 표시 | `TabletDashboardService` → `account_vital_history` / `account_heart_rate_statistics` 연동 |
| 심박 통계 조회 API | 관리자·앱용 일별 통계 GET (현재 배치만 존재) |

---

*갱신 시 [CAFE24_VITAL_HEART_RATE.md](CAFE24_VITAL_HEART_RATE.md)와 함께 유지.*
