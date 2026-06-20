# CAMA 생체신호 · 심박수 API · DB · 배치

> **갱신:** 2026-06-12 · VPS DDL 적용 완료

---

## DB 테이블

### `account_vital_history` (원시)

| vital_type_cd | 기본 unit | 허용 범위 |
|---------------|-----------|-----------|
| `HEART_RATE` | bpm | 20~300 |
| `BP_SYSTOLIC` | mmHg | 50~300 |
| `BP_DIASTOLIC` | mmHg | 30~200 |
| `SPO2` | % | 50~100 |
| `BODY_TEMP` | C | 30~45 |
| `RESPIRATORY_RATE` | /min | 5~60 |

DDL: `deploy/sql/cafe24-account-vital-history.sql`

### `account_heart_rate_statistics` (일별 집계)

배치가 `HEART_RATE`만 집계 → `min_bpm`, `max_bpm`, `avg_bpm`, `sample_count`

DDL: `deploy/sql/cafe24-account-heart-rate-statistics.sql`

---

## API (`cama-plus-server`)

| Method | Path |
|--------|------|
| PUT | `/api/track/service/vital` |
| POST | `/api/track/service/vital/batch` |
| POST | `/api/track/service/vitalList` |
| PUT | `/api/webview/track/service/vital` |
| POST | `/api/webview/track/service/vitalList` |

인증: 환자 JWT (`api_key` 헤더). WebView 경로는 `accountSeq` body 허용.

---

## 배치 (`cama-back-batch`)

| Cron | Job | 설명 |
|------|-----|------|
| `0 30 0 * * ?` KST | `heartRateStatisticsBatch` | 전일 심박 → 통계 테이블 upsert |

VPS 수동: `python deploy/scripts/vps-run-heart-rate-statistics-batch.py`

---

## 발걸음 (기존)

| 테이블 | API |
|--------|-----|
| `account_step_history` | `PUT /api/track/service/step`, `POST …/stepList` |

---

## 세션 상세

[CAFE24_SESSION_HANDOFF_2026-06-12-TABLET-VITAL-BATCH.md](CAFE24_SESSION_HANDOFF_2026-06-12-TABLET-VITAL-BATCH.md)
