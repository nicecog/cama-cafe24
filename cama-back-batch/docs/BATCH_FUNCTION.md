# cama-back-batch — 기능 정리

> Billive(CAMA+) 스케줄 FCM 푸시, 트랙 만료, 계정 통계.  
> **로컬 실행:** `scripts/run-local-gabia.ps1` (포트 **8082**, 프로필 `local-gabia`)

---

## 1. 역할

| 구분 | 설명 |
|------|------|
| **일정 FCM** | `account_batch_schedule` + `account_schedule` + `firebase_token` 조회 → FCM 발송 |
| **코칭 FCM** | 활성 `track_service` + 코칭 진행률 → 시간대별 FCM |
| **트랙 만료** | 기간 지난 ACTIVE `track_service` → `CANCEL` |
| **통계** | `account_cnt_statistics` 월별 집계 (연구참여/미참여/전체) |

API 서버(`cama-plus-server`)와 **동일 PostgreSQL** 사용. Gabia 배포 시 **베이직 컨테이너** 권장.

---

## 2. 스케줄 잡 목록 (`RunTask.java`)

| 잡 ID | Cron (KST) | 메서드 | SQL / 동작 |
|-------|--------------|--------|------------|
| check1 | `0 0/1 * * * ?` | `batchCheck` | `getScheduleBatchList` — 복약·내원·기타·멘탈 **정각** |
| check2 | `0 0/1 * * * ?` | `batchCheck2` | `getScheduleBatchList2` — 내원 **전날** 같은 시각 |
| check3 | `0 0/1 * * * ?` | `batchCheck3` | `getScheduleBatchList3` — 내원·복약 **1시간 전** |
| check4 | `0 0 10 * * ?` | `batchCheck4` | `getScheduleBatchList4` — 암정보 가이드 독려 |
| check5 | `0 0 15 * * ?` | `batchCheck5` | `getScheduleBatchList5` — 가이드 종료 **D-3** |
| check6 | `0 0 15 * * ?` | `batchCheck6` | `getScheduleBatchList6` — 가이드 종료 **D-1** |
| check11 | `0 0 17 * * ?` | `batchCheck11` | `getScheduleBatchList11('A')` — **수면** 코칭 |
| check12 | `0 0 9 * * ?` | `batchCheck12` | `getScheduleBatchList11('B')` — **식습관** 코칭 |
| check13 | `0 0 11 * * ?` | `batchCheck13` | `getScheduleBatchList11('D')` — **신체활동** 코칭 |
| check14 | `0 0 16 * * ?` | `batchCheck14` | `getScheduleBatchList11('E')` — **운동** 코칭 |
| track-expire | `0 0 1 * * ?` | `dayOneBatch` | `getTrackActiveServiceList` → status **CANCEL** |
| statistics | `0 0 23 * * ?` | `accountStatisticsBatch` | `account_cnt_statistics` insert/update |

---

## 3. FCM 메시지 타입 (`NotificationServiceImpl`)

| type | 용도 |
|------|------|
| SCH_002 | 복약 |
| SCH_003 | 일반 일정 / 내원 당일 |
| SCH_004 | 내원 전날 |
| SCH_005~008 | 가이드·멘탈 |
| SCH_011~014 | 수면·식습관·활동·운동 코칭 |

발송: `FcmMessageSender` (Firebase Admin SDK HTTP v1).  
로컬 `local-gabia`: **`cama.batch.fcm.dry-run=true`** — 로그만, 실제 FCM 미발송.

---

## 4. 로컬 실행

### 전제

- Docker PG: `cama-plus-server/docker-compose.local.yml` (`:55432`)
- JDK 17+

### 기동

```powershell
cd F:\cama_pjt\cama-back-batch
powershell -ExecutionPolicy Bypass -File .\scripts\run-local-gabia.ps1
```

- URL: `http://localhost:8082/`
- Dev API: `http://localhost:8082/api/batch/dev/jobs`

### Smoke

```powershell
# batch 기동 후 다른 터미널
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test-batch-local.ps1
```

### 수동 잡 실행 예

```powershell
Invoke-RestMethod http://localhost:8082/api/batch/dev/run/check1
Invoke-RestMethod http://localhost:8082/api/batch/dev/run/track-expire
Invoke-RestMethod http://localhost:8082/api/batch/dev/run/statistics
```

---

## 5. 프로필

| 프로필 | DB | 포트 | 비고 |
|--------|-----|------|------|
| `local-gabia` | Docker `127.0.0.1:55432/cama` | 8082 | Slack off, FCM dry-run, dev API |
| `local` | AWS dev RDS | 8080 | 레거시 |
| `prd` | AWS prd RDS | 8080 | 운영 |

---

## 6. Gabia 배포 (예정)

- **베이직** 컨테이너 1계약
- env: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `FIREBASE_CREDENTIALS_PATH`
- `cama.batch.slack.enabled=true`, `cama.batch.fcm.dry-run=false`
- `@Profile("local-gabia")` **BatchDevController**는 운영에 미포함

---

## 7. 이번 세션 코드 수정 요약

| 항목 | 내용 |
|------|------|
| **pom.xml** | Lombok 1.18.34 + compiler release 11 — JDK 17 빌드 오류 해결 |
| **application-local-gabia.yml** | 로컬 PG, 포트 8082, dry-run |
| **RunTask** | Slack → `BatchSlackNotifier`, public `run*` for dev test |
| **ScheduleMapper.xml** | `getDayEnableCnt` — 로그인 이력 없을 때 null → **COALESCE 0** (500 버그 수정) |
| **FcmMessageSender** | `@Component`, dry-run 지원 |
| **BatchDevController** | local-gabia 수동 잡 실행 |
| **scripts/** | `run-local-gabia.ps1`, `smoke-test-batch-local.ps1` |

### 로컬 smoke 결과 (2026-05-31)

```
PASS index / jobs / check1 / check4 / track-expire / statistics
```

---

## 8. 관련 문서

- `F:\cama_pjt\docs\BILLIVE_SESSION_RESUME.md`
- `F:\cama_pjt\docs\BILLIVE_LOCAL_DEV_HANDOFF.md` §13
