# cama-back-batch — 스케줄 배치 (Cafe24 VPS)

> **작성일:** 2026-06-03  
> **소스:** `cama-cafe24/cama-back-batch/src/main/java/com/cama/batch/tasks/RunTask.java`  
> **관련:** [작업 현황](CAFE24_WORK_STATUS_AND_TODO.md) · [테스트 가이드](CAFE24_TEST_GUIDE.md) · [배포 가이드](CAFE24_DEPLOYMENT_GUIDE.md)

---

## 1. 요약

| 항목 | Cafe24 VPS 현황 |
|------|-----------------|
| 실행 방식 | **별도 OS cron 없음** — `cama-back-batch` Spring Boot 프로세스 내부 `@Scheduled` |
| 스케줄 활성화 | `@EnableScheduling` (`RunApplication.java`) |
| 타임존 | **`Asia/Seoul`** (KST) |
| DB | API와 동일 — Docker `postgres:5432/cama` |
| 프로필 | `--spring.profiles.active=cafe24` |
| 포트 | **8082** (호스트·Nginx **미노출**) |
| FCM | Firebase Admin JSON + `CAMA_BATCH_FCM_DRY_RUN` |
| 운영 수동 API | **없음** (`BatchDevController`는 `local-cafe24` 프로필만) |

환자 앱 푸시·일정 알림·케어트랙 만료·계정 통계는 **API(cama-plus-server)가 아니라 이 배치 서비스**에서 주기적으로 처리합니다.

---

## 2. 아키텍처

```text
[Docker: cama-back-batch :8082]
        │
        ├─ @Scheduled (RunTask) ──► MyBatis (ScheduleMapper / TrackServiceMapper)
        │                              └─ PostgreSQL DB "cama"
        │
        ├─ NotificationService ──► FcmMessageSender
        │                              └─ FCM (dry-run 시 로그만)
        │
        └─ BatchSlackNotifier (선택) ──► Slack Webhook
```

- **cama-plus-server**와 **동시에 같은 `cama` DB**를 사용합니다.
- 배치 JAR: `/opt/cama/jars/cama-batch-1.0-SNAPSHOT.jar`
- Firebase: `/opt/cama/secrets/firebase-adminsdk.json` (컨테이너 마운트)

---

## 3. 스케줄 잡 목록 (운영 반영 기준)

모든 cron은 **서울 시간**입니다.

### 3.1 분 단위 (매 1분, 정각 분마다)

| Job 메서드 | Cron | 설명 | 대상 조회 | 알림 유형 |
|------------|------|------|-----------|-----------|
| `batchCheck` | `0 0/1 * * * ?` | 복약·기타·내원·멘탈 **해당 시각** 알림 | `getScheduleBatchList()` | MEDICINE / HOSPITAL / MENTALITY / 기타 |
| `batchCheck2` | `0 0/1 * * * ?` | **내원 전날** 같은 시각 알림 | `getScheduleBatchList2()` | HOSPITAL |
| `batchCheck3` | `0 0/1 * * * ?` | **내원·복약 1시간 전** 알림 | `getScheduleBatchList3()` | HOSPITAL / MEDICINE |

> DB에 등록된 일정 시각과 매칭되는 대상만 매 분 조회·발송 시도합니다.

### 3.2 일 단위 (고정 시각)

| Job 메서드 | Cron | 시각 | 설명 |
|------------|------|------|------|
| `dayOneBatch` | `0 0 1 * * ?` | **01:00** | 만료 `track_service` → 상태 **CANCEL** + Slack 알림(활성 시) |
| `batchCheck12` | `0 0 9 * * ?` | **09:00** | 식습관 코칭 **B** |
| `batchCheck4` | `0 0 10 * * ?` | **10:00** | 암정보 가이드 |
| `batchCheck13` | `0 0 11 * * ?` | **11:00** | 신체활동 코칭 **D** |
| `batchCheck5` | `0 0 15 * * ?` | **15:00** | 암정보 가이드 종료 **D-3** |
| `batchCheck6` | `0 0 15 * * ?` | **15:00** | 암정보 가이드 종료 **D-1** |
| `batchCheck14` | `0 0 16 * * ?` | **16:00** | 운동 코칭 **E** |
| `batchCheck11` | `0 0 17 * * ?` | **17:00** | 수면 코칭 **A** |
| `accountStatisticsBatch` | `0 0 23 * * ?` | **23:00** | 계정 통계 집계 (`userType` 10 / 20 / 99) |

코칭 B/D/E/A는 `getScheduleBatchList11("A"|"B"|"D"|"E")` 로 구분합니다.

### 3.3 일정 유형 enum (`ScheduleType`)

`MEDICINE`, `HOSPITAL`, `ETC`, `SLEEP`, `EATING`, `ACTIVITY`, `MENTALITY`, `EXERCISE`

---

## 4. Cafe24 환경 변수

`deploy/env.cafe24.example` / VPS `.env.cafe24`:

| 변수 | 배치 역할 | 현재 권장 |
|------|-----------|-----------|
| `DB_URL` | `jdbc:postgresql://postgres:5432/cama` | compose 기본 |
| `FIREBASE_CREDENTIALS_PATH` | FCM 인증 JSON | `/secrets/firebase-adminsdk.json` |
| `CAMA_BATCH_FCM_DRY_RUN` | `true`면 FCM **미발송**, 로그만 | **`true`** (검증 전) |
| `CAMA_BATCH_SLACK_ENABLED` | Slack 알림 | `false` |
| `CAMA_BATCH_SLACK_WEBHOOK` | webhook URL | 비우기 |

`application-cafe24.yml` 매핑:

```yaml
cama:
  batch:
    fcm:
      dry-run: ${CAMA_BATCH_FCM_DRY_RUN:false}
```

---

## 5. FCM · DRY_RUN 동작

- `CAMA_BATCH_FCM_DRY_RUN=true` 일 때: `FcmMessageSender`가 실제 전송 없이 로그만 남김.

```text
FCM dry-run type=... token=... title=...
```

- `false` 로 변경 후 컨테이너 재시작 시 실제 `fcm.googleapis.com` 호출.

**주의:** 스케줄은 DRY_RUN 여부와 관계없이 **매 분/매일 실행**됩니다. DRY_RUN은 **푸시 발송만** 막습니다.

---

## 6. 로컬 vs VPS — 수동 실행

| 환경 | 프로필 | 수동 실행 |
|------|--------|-----------|
| 로컬 PC | `local-cafe24` | `GET http://localhost:8082/api/batch/dev/jobs` · `GET .../run/{job}` |
| **Cafe24 VPS** | `cafe24` | **HTTP 수동 API 없음** — 스케줄 대기 또는 로컬에서 동일 DB로 검증 |

`BatchDevController` job 이름: `check1` ~ `check6`, `check11` ~ `check14`, `track-expire`, `statistics`

로컬 스크립트:

```powershell
cd F:\cama_pjt\cama-cafe24\cama-back-batch
.\scripts\run-local-cafe24.ps1
.\scripts\smoke-test-batch-local.ps1
```

---

## 7. 운영 확인 방법 (VPS)

### 7.1 컨테이너·스케줄러 기동

```bash
ssh camaplus-vps "docker ps | grep cama-back-batch"
ssh camaplus-vps "docker logs cama-back-batch 2>&1 | tail -30"
```

기대 로그:

- `Started RunApplication`
- `Firebase application has been initialized`

### 7.2 분 배치 (check1~3)

해당 시각에 일정이 있는 테스트 계정이 있을 때:

```bash
ssh camaplus-vps "docker logs cama-back-batch 2>&1 | grep -E 'batchCheck|FCM dry-run' | tail -20"
```

### 7.3 일 배치 (예: 10:00 암정보)

```bash
ssh camaplus-vps "docker logs cama-back-batch 2>&1 | grep batchCheck4 | tail -5"
```

### 7.4 새벽 track 만료 (01:00)

```bash
ssh camaplus-vps "docker logs cama-back-batch 2>&1 | grep dayOneBatch | tail -5"
```

### 7.5 외부 포트 차단

```powershell
# 실패(타임아웃/거부)가 정상
curl.exe -m 5 http://210.114.18.156:8082/
```

---

## 8. 테스트 케이스 (TC-BATCH)

| ID | 항목 | 방법 | 기대 |
|----|------|------|------|
| TC-BATCH-01 | 컨테이너 Up | `docker ps` | `cama-back-batch` running |
| TC-BATCH-02 | Firebase | 로그 grep | initialized |
| TC-BATCH-03 | DRY_RUN | `.env` + 로그 | `FCM dry-run` (발송 없음) |
| TC-BATCH-04 | DB 연결 | 기동 실패 없음 | Started |
| TC-BATCH-05 | 8082 미노출 | 외부 curl | 연결 실패 |
| TC-BATCH-06 | 분 스케줄 | 일정 데이터 + 해당 분 대기 | `batchCheck` debug 로그 |
| TC-BATCH-07 | 10:00 가이드 | 10:00 KST 전후 로그 | `batchCheck4 cancer guide targets=` |
| TC-BATCH-08 | 01:00 만료 | 01:00 KST 전후 | `dayOneBatch` 로그 |
| TC-BATCH-09 | 23:00 통계 | 23:00 KST 전후 | `accountStatisticsBatch completed` |
| TC-BATCH-10 | 로컬 수동 | `local-cafe24` + `/api/batch/dev/run/check1` | targets JSON |

상세 E2E 순서는 [CAFE24_TEST_GUIDE.md](CAFE24_TEST_GUIDE.md) §8 FCM·배치 참고.

---

## 9. 장애 시 체크

| 증상 | 확인 |
|------|------|
| 푸시 안 옴 | `CAMA_BATCH_FCM_DRY_RUN`, Firebase JSON, 앱 FCM 토큰(`firebase_token` 테이블) |
| 스케줄 자체 안 돔 | 컨테이너 재시작 루프, OOM, DB 연결 오류 로그 |
| 대상 0건 | `cama` DB 일정·track 데이터 존재 여부 (운영 mig 반영 확인) |
| Slack만 안 옴 | `CAMA_BATCH_SLACK_ENABLED`, webhook URL |

배치 재시작:

```bash
cd /opt/cama/deploy
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 restart cama-back-batch
```

---

## 10. FCM dry-run E2E 검증 (2026-06-03) ✅

| 단계 | 결과 |
|------|------|
| 테스트 일정 삽입 | `account_seq=562`, KST 다음 1분, `MEDICINE` |
| `getScheduleBatchList` 매칭 | 1 row |
| 배치 실행 | `16:14:00 UTC` (= 01:14 KST) |
| 로그 | `FCM dry-run type=SCH_002 ... 복약 알림이 있습니다.` |
| 정리 | `CAFE24_BATCH_TEST` row DELETE |

재현: [CAFE24_CURSOR_HANDOFF.md §E](CAFE24_CURSOR_HANDOFF.md#e-배치-fcm-재검증-필요-시)

---

## 11. 이전 문서 대비 반영 여부

| 문서 | 배치 스케줄 상세 |
|------|------------------|
| CAFE24_WORK_STATUS_AND_TODO.md | FCM·컨테이너만 → **본 문서 링크 추가** |
| CAFE24_TEST_GUIDE.md | TC-FCM-* 만 → **TC-BATCH-* 링크** |
| CAFE24_DEPLOYMENT_GUIDE.md | 배포·FCM 절차 → 스케줄 표는 **본 문서** |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-03 | RunTask 기준 스케줄·Cafe24 반영·테스트 케이스 최초 작성 |
| 2026-06-03 | VPS 로그 검증·FCM dry-run E2E·테스트 SQL 스크립트 |
