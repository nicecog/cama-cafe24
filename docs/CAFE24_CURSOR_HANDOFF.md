# Cafe24 이관 — Cursor AI 핸드오프 (최종)

> **최종 갱신:** 2026-06-03  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** Cursor AI를 새로 열었을 때 **즉시 이어서 작업**할 수 있도록, 완료 내역·검증 결과·APK 실접속 테스트 절차를 한 문서에 정리.

**GitHub:** https://github.com/nicecog/cama-cafe24

**문서 읽는 순서 (권장)**

1. **[CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md)** — **최신** AWS→Cafe24·Super Admin·서비스 API·Git
2. **[CAFE24_SESSION_HANDOFF_2026-06-04.md](CAFE24_SESSION_HANDOFF_2026-06-04.md)** — WebView 성능·탭바·헤더
3. **[CAFE24_SESSION_HANDOFF_2026-06-03.md](CAFE24_SESSION_HANDOFF_2026-06-03.md)** — WebView nginx·ID 변경·APK 1.2.7
4. **[CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md)** — 전체 롤업
5. **본 문서** (핸드오프·재시작 체크리스트)
6. [CAFE24_AWS_DECOMMISSION.md](CAFE24_AWS_DECOMMISSION.md) · [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md)

---

## A. Cursor AI 재시작 시 — 먼저 할 일 (5분)

```text
[ ] 1. 워크스페이스: F:\cama_pjt (cama-cafe24 하위 작업)
[ ] 2. VPS 살아 있는지: ssh camaplus-vps "docker ps --format '{{.Names}} {{.Status}}'"
[ ] 3. 4컨테이너 Up 확인: postgres, cama-plus-server, cama-back-batch, cama-doctor-web
[ ] 4. HTTPS: curl.exe -sk https://camaplus.cafe24.com/actuator/health  → 200
[ ] 5. 앱 설정 확인: cama-plus-app/src/config/stage.ts → currentStage = 'PROD'
[ ] 6. APK: dist/cama-plus-cafe24-1.2.7-release.apk (Git: github.com/nicecog/cama-cafe24)
[ ] 6c. AWS URL 감사: python deploy/scripts/aws-to-cafe24-migrate.py --audit --use-legacy-aws-config
[ ] 6d. 서비스 신청: https://camaplus.cafe24.com/service-management/service/list (의사 로그인)
[ ] 6b. recover API: ssh camaplus-vps "python3 /tmp/vps-reset-password-test.py" (스크립트 없으면 PROGRESS_HANDOFF §6)
[ ] 7. FCM DRY_RUN 유지 확인: ssh camaplus-vps "grep CAMA_BATCH /opt/cama/deploy/.env.cafe24"
      → CAMA_BATCH_FCM_DRY_RUN=true (실푸시 금지, 검증 전)
```

**이후 기본 작업 방향:** 서버 curl 스모크보다 **`dist/*.apk` 실기기/에뮬레이터 실접속 테스트**를 우선한다.

---

## B. 완료된 작업 요약 (2026-06-03 기준)

> **2026-06-03 추가:** AWS→Cafe24 이관·Super Admin·`/api/doctor/service`·GitHub — [MIGRATION-GIT](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md)

### B.1 인프라 · 서버

| 항목 | 상태 |
|------|------|
| Cafe24 VPS + Docker 4서비스 + Nginx HTTPS | ✅ `https://camaplus.cafe24.com` |
| `cama-plus-server` / `cama-back-batch` / `cama-doctor-web` JAR 배포 | ✅ `/opt/cama/jars/` |
| Firebase Admin JSON (batch) | ✅ `/opt/cama/secrets/firebase-adminsdk.json` |
| SSH | `ssh root@210.114.18.156` · 비밀번호 등 → [`deploy/CAFE24_VPS_ACCESS.local.md`](../deploy/CAFE24_VPS_ACCESS.local.md) (Git 제외) |

### B.2 DB

| DB | 상태 | 비고 |
|----|------|------|
| `cama` | ✅ 운영 RDS 기준 마이그레이션 | account 550, 42 tables, max seq 562 |
| `cama_doctor` | ⚠️ 스키마만 | 운영 RDS에 DB 없음, `app_user` 0건 |

덤프: `F:\cama_pjt\db-dump\cama_prod.sql` · VPS: `/opt/cama/db-import/`

### B.3 환자 앱 (cama-plus-app)

| 항목 | 상태 |
|------|------|
| API/Admin URL | ✅ 전부 `https://camaplus.cafe24.com` (localhost·AWS·billive 미사용) |
| `currentStage` | ✅ `PROD` |
| Android 빌드 | ✅ **JDK 17** (`assembleRelease` 성공) |
| APK 배포본 | ✅ `dist/cama-plus-cafe24-1.2.7-release.apk` (Git 추적) |
| GitHub | ✅ https://github.com/nicecog/cama-cafe24 |
| 계정 복구 API·앱 | ✅ public `/api/public/patient/recover/*` VPS 배포·스모크 OK — [상세](CAFE24_PROGRESS_HANDOFF.md) §3 |
| Brevo SMTP | ⏳ yml/compose만, VPS·camaplus.me DNS 미완 — [상세](CAFE24_PROGRESS_HANDOFF.md) §5 |
| JDK 21 앱 빌드 | ❌ 비호환 — **유지하지 말 것** |

### B.4 cama-back-batch (스케줄)

| 항목 | 상태 |
|------|------|
| `@Scheduled` 기동 | ✅ 프로필 `cafe24`, 타임존 `Asia/Seoul` |
| DB 마이그레이션 후 ERROR | ✅ 0건 (이전 `account_batch_schedule` 없음 이슈 해소) |
| 01:00 KST `dayOneBatch` | ✅ 로그 확인 |
| 23:00 KST `accountStatisticsBatch` | ✅ 로그 확인 (재기동 전 컨테이너) |
| **FCM dry-run E2E** | ✅ 테스트 일정 1건 → `FCM dry-run type=SCH_002` 로그 확인 후 테스트 row 삭제 |

### B.5 미완 · 알려진 이슈

| 항목 | 상태 |
|------|------|
| **APK 실접속 E2E** (로그인·홈·WebView·업로드) | ⏳ **다음 주력 작업** |
| **APK ID/PW 찾기·초기화 E2E** | ⏳ 1.2.4 실기기 — [PROGRESS §3](CAFE24_PROGRESS_HANDOFF.md) |
| `/api/enums` 등 permitAll → 401 | ⚠️ curl·내부 8080 동일 — Security 조사 필요 |
| doctor-web → API 프록시 401 | ⚠️ 로그 존재 |
| FCM 실발송 | ⏸ `CAMA_BATCH_FCM_DRY_RUN=true` |
| Play 스토어 서명 | ⏳ `camaplusappkey.keystore` 미보유 시 debug 서명 APK만 |
| 이미지 파일 스토리지 | ⏳ DB만 이관, S3→VPS 파일 동기화 미확인 |

---

## C. APK 실접속 테스트 (앞으로의 기본 방식)

### C.1 사용 APK

| 항목 | 값 |
|------|-----|
| 경로 | `F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-1.2.4-release.apk` |
| 패키지 | `com.camaplus.app` |
| 연결 서버 | `https://camaplus.cafe24.com/` only |

> **Metro / `run-android`로 localhost 붙이지 않음.** JS 번들이 APK에 포함된 release 빌드로 테스트.

### C.2 환경 준비 (Windows)

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"
adb devices
```

### C.3 APK 설치

```powershell
adb install -r "F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-1.2.4-release.apk"
```

### C.4 실접속 확인 (Logcat)

```powershell
adb logcat -c
adb logcat | Select-String -Pattern "cama-api|camaplus|Network Error|axios"
```

**필수 확인**

| # | 확인 | 기대 |
|---|------|------|
| 1 | `[cama-api] baseURL=` | `https://camaplus.cafe24.com/` |
| 2 | `localhost` / `10.0.2.2` / `amazonaws` | **없음** |
| 3 | 로그인 | 운영 이관 계정으로 홈 진입 |
| 4 | 홈 API | 에러 토스트 없음 (401 이슈 시 실패 가능) |
| 5 | WebView | `camaplus.cafe24.com` 로드 |
| 6 | 마이페이지 사진 업로드 | Cafe24 `/api/common/images/base64/upload` |

테스트 계정은 **문서에 기록하지 말고** 팀 비밀관리 도구 사용.

### C.5 APK 재빌드 (앱 소스 변경 후)

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
.\gradlew.bat clean assembleRelease
Copy-Item "app\build\outputs\apk\release\app-release.apk" `
  "..\..\dist\cama-plus-cafe24-1.2.4-release.apk" -Force
```

**빌드 주의:** `android/app/src/main/res`에 `node_modules_*` drawable 중복 시 삭제 후 빌드 (과거 이슈).

### C.6 서버 변경 후 앱만 재테스트할 때

- JAR/DB를 바꿨다면 VPS 컨테이너 재시작 후 **APK 재설치 불필요** (URL 동일 시)
- `stage.ts` / 네이티브 설정 변경 시 **APK 재빌드·재설치 필수**

---

## D. 서버만 빠르게 점검 (APK 전)

```powershell
curl.exe -sk https://camaplus.cafe24.com/actuator/health
ssh camaplus-vps "docker ps"
ssh camaplus-vps "docker exec cama-cafe24-postgres psql -U cama -d cama -t -c 'select count(*) from account;'"
ssh camaplus-vps "docker logs --since 30m cama-back-batch 2>&1 | grep -iE 'ERROR|FCM dry-run|dayOneBatch' | tail -15"
```

---

## E. 배치 FCM 재검증 (필요 시)

스크립트: `deploy/scripts/insert-batch-test-schedule.sql` · 정리: `cleanup-batch-test-schedule.sql`

```powershell
scp F:\cama_pjt\cama-cafe24\deploy\scripts\insert-batch-test-schedule.sql camaplus-vps:/tmp/
ssh camaplus-vps "cat /tmp/insert-batch-test-schedule.sql | docker exec -i cama-cafe24-postgres psql -U cama -d cama -v ON_ERROR_STOP=1"
# 70초 대기 후
ssh camaplus-vps "docker logs --since 3m cama-back-batch 2>&1 | grep 'FCM dry-run'"
# 정리
scp F:\cama_pjt\cama-cafe24\deploy\scripts\cleanup-batch-test-schedule.sql camaplus-vps:/tmp/
ssh camaplus-vps "cat /tmp/cleanup-batch-test-schedule.sql | docker exec -i cama-cafe24-postgres psql -U cama -d cama"
```

**2026-06-03 검증 로그 예시:**

```text
FCM dry-run type=SCH_002 token=dmVEoVK2... title=복약 알림이 있습니다. 약 드셔야 할 시간 입니다.
```

---

## F. Cursor AI에게 시킬 때 — 우선순위 TO-BE

| 우선 | 작업 | 비고 |
|------|------|------|
| **P0** | APK 실접속 E2E | 로그인·홈·스케줄·WebView·사진업로드 — [TEST_GUIDE §9](CAFE24_TEST_GUIDE.md) |
| **P0** | 실패 시 Logcat + API 401 원인 | `SecurityConfig` / JWT 필터 |
| P1 | doctor-web 프록시 401 | `/proxy` → plus-server |
| P1 | 이미지 404 | `cama-files` vs DB 경로 |
| P2 | FCM DRY_RUN 해제 | APK·배치 검증 **완료 후에만** |
| P2 | release keystore | Play 배포용 |
| P3 | `cama_doctor` 실데이터 | 별도 덤프 필요 |
| P3 | RN 0.71 → 상위 버전 | 중장기 |

**하지 말 것 (현 단계)**

- 앱 빌드 JDK 21 전환
- `CAMA_BATCH_FCM_DRY_RUN=false` (사용자 승인 전)
- VPS batch `:8082` 외부 노출

---

## G. 핵심 경로 · 링크

| 구분 | 값 |
|------|-----|
| 공개 URL | https://camaplus.cafe24.com |
| SSH | `ssh camaplus-vps` |
| APK | `cama-cafe24/dist/cama-plus-cafe24-1.2.4-release.apk` |
| 진행 상황 | [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) |
| 앱 설정 | `cama-cafe24/cama-plus-app/src/config/stage.ts` |
| Compose | `cama-cafe24/deploy/docker-compose.cafe24.yml` |
| Env | `/opt/cama/deploy/.env.cafe24` |

---

## H. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-02 | VPS 배포, 운영 `cama` DB mig, 앱 Cafe24 URL |
| 2026-06-03 | doctor-web, APK 빌드, 테스트·배치 문서 |
| 2026-06-03 | 배치 스케줄 로그 검증, FCM dry-run E2E, **본 핸드오프 최종·APK 테스트方針** |
| 2026-06-03 | 계정 복구·APK 1.2.4·Brevo — [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) |

---

*Cursor 세션 시작 시 이 파일을 먼저 열고 §A 체크리스트부터 진행할 것.*
