# Cafe24 이관 작업 현황 · 주의사항 · TO-BE

> **작성일:** 2026-06-03 · **최종 갱신:** 2026-06-06  
> **대상 경로:** `F:\cama_pjt\cama-cafe24`  
> **Cursor AI 재시작 시:** 👉 **[CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md)** (Super Admin·모니터링·Git `3fa1c59`) → [MIGRATION-GIT](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md) → [PROGRESS](CAFE24_PROGRESS_HANDOFF.md)  
> **GitHub:** https://github.com/nicecog/cama-cafe24  
> **관련 문서:** [AWS 만료](CAFE24_AWS_DECOMMISSION.md) · [Super Admin](CAFE24_SUPER_ADMIN_MIG.md) · [핸드오프](CAFE24_CURSOR_HANDOFF.md) · [배포](CAFE24_DEPLOYMENT_GUIDE.md) · [테스트](CAFE24_TEST_GUIDE.md)

---

## 0. 테스트 방침 (2026-06-03 확정)

| 구분 | 방침 |
|------|------|
| **앱 검증** | **`dist/cama-plus-cafe24-1.2.7-release.apk` 실기기·에뮬레이터 실접속** (Metro/localhost 아님) |
| **서버 검증** | SSH·docker·curl 보조, DB row count |
| **배치 검증** | 로그 + (필요 시) `deploy/scripts/insert-batch-test-schedule.sql` |
| **FCM** | DRY_RUN 유지, APK·배치 검증 완료 후에만 실발송 전환 |

---

## 1. 한 줄 요약

| 영역 | 상태 | 비고 |
|------|------|------|
| VPS 인프라 (Docker + Nginx + HTTPS) | ✅ 완료 | `camaplus.cafe24.com` |
| `cama` DB (운영 RDS 기준) | ✅ 완료 | 운영과 row/스키마 일치 검증 |
| `cama_doctor` DB | ⚠️ 스키마만 | 운영 RDS에 해당 DB 없음 |
| cama-plus-server / batch JAR 배포 | ✅ 완료 | Spring Boot 3.5, JDK 21 (컨테이너) |
| cama-doctor-web | ✅ 배포·소스 동기화 | Cafe24 프로필, JDK 21 |
| 환자 앱 (`cama-plus-app`) Cafe24 URL | ✅ 완료 | `currentStage = PROD` |
| Android APK 빌드 (JDK 17) | ✅ 완료 | `dist/cama-plus-cafe24-1.2.7-release.apk` (Git 추적) |
| **AWS S3 → VPS 로컬 파일** | ✅ 완료 | `cama-images` + `cama-files` — [MIGRATION-GIT §2](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md) |
| **DB AWS URL 치환** | ✅ 완료 | 전 컬럼 감사 0건 |
| **Super Admin** `/admin/` | ✅ 완료 | **Vite** 배포·doctor 로그인·모니터링 버그 수정 — [HANDOFF 2026-06-06](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md) |
| **의사 웹·Admin 403** | ✅ 완료 | JWT·nginx·`/api/doctor/service` — `42a2225` |
| **월평가지표** (`account_cnt_statistics`) | ✅ 완료 | DB·배치 정상, UI `YYYYMM` 수정 |
| **코칭 radial 차트** (환자 상세) | ✅ 완료 | `acSeq` SQL 필터 + 프론트 |
| **GitHub** | ✅ 완료 | `5790939` (docs) · `3fa1c59` (코드) |
| **Super Admin 로그인** `happycog` | ✅ VPS DB | `/admin/login` — `cm_doctor` + `cm_admin` — [HANDOFF §10](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md) |
| 환자 ID/PW 찾기·초기화 (API+앱) | ✅ VPS 배포 | [PROGRESS §3](CAFE24_PROGRESS_HANDOFF.md) |
| Brevo SMTP | ⏳ 설정만 | VPS `.env` + `camaplus.me` DNS |
| cama-back-batch 스케줄 + FCM dry-run | ✅ 검증 | dry-run 로그 확인 |
| FCM 실발송 | ⏸ 보류 | `CAMA_BATCH_FCM_DRY_RUN=true` |
| **AWS 리소스 만료** | ⏳ 검증 후 | [CAFE24_AWS_DECOMMISSION.md](CAFE24_AWS_DECOMMISSION.md) |
| **APK 실접속 E2E** | ⏳ 다음 | 로그인·WebView·이미지·서비스 승인 UI |
| API permitAll 401 | ⚠️ 미해결 | `/api/enums` 등 |

---

## 2. 인프라 · 서버 (Cafe24 VPS)

### 2.1 접속·경로

| 항목 | 값 |
|------|-----|
| 공개 도메인 | `https://camaplus.cafe24.com` |
| VPS IP | `210.114.18.156` |
| SSH 별칭 | `camaplus-vps` (키 인증) |
| 배포 루트 | `/opt/cama/` |
| Compose | `/opt/cama/deploy/docker-compose.cafe24.yml` |
| 환경 변수 | `/opt/cama/deploy/.env.cafe24` (Git 커밋 금지) |
| JAR | `/opt/cama/jars/` |
| DB 덤프 보관 | `/opt/cama/db-import/` |
| Firebase JSON | `/opt/cama/secrets/firebase-adminsdk.json` |
| 업로드 파일 | `/opt/cama/data/cama-files` |

### 2.2 Docker 서비스

| 컨테이너 | 이미지/런타임 | 포트 (호스트) | 역할 |
|----------|---------------|---------------|------|
| `cama-cafe24-postgres` | PostgreSQL **17** | 내부 5432 | `cama`, `cama_doctor` DB |
| `cama-plus-server` | Temurin **JRE 21** | `127.0.0.1:8080` | REST API (`--spring.profiles.active=cafe24`) |
| `cama-back-batch` | Temurin **JRE 21** | 외부 노출 없음 (:8082) | **Spring `@Scheduled` 스케줄·FCM** ([상세](CAFE24_BATCH_SCHEDULE.md)) |
| `cama-doctor-web` | Temurin **JRE 21** | `127.0.0.1:8081` | 의사 웹 (Thymeleaf) |

**Nginx (호스트):** HTTPS 종료 후 경로 분기

- `/api/`, `/files/` → `cama-plus-server:8080`
- `/proxy/`, `/`, 의사 로그인·WebView 경로 → `cama-doctor-web:8081`
- batch는 **외부 노출 금지**

### 2.3 서버 소스·빌드 (로컬 → VPS)

| 모듈 | 경로 (로컬) | 산출물 | 스택 |
|------|-------------|--------|------|
| API | `cama-cafe24/cama-plus-server` | `cama-back-1.0-SNAPSHOT.jar` | Spring Boot **3.5**, JDK **21** |
| Batch | `cama-cafe24/cama-back-batch` | `cama-batch-1.0-SNAPSHOT.jar` | 동일 |
| Doctor Web | `cama-cafe24/cama-doctor-web` | `cama-doctor-web-0.0.1-SNAPSHOT.jar` | Spring Boot **3.5**, JDK **21** |

**원칙:** VPS에서 Maven/Gradle 컴파일하지 않고, **PC에서 JAR 빌드 후 `scp` 업로드**.

```powershell
# 예시 (JDK 21)
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
cd F:\cama_pjt\cama-cafe24\cama-plus-server
mvn clean package -DskipTests
scp target\cama-back-1.0-SNAPSHOT.jar camaplus-vps:/opt/cama/jars/
```

컨테이너 재시작:

```bash
cd /opt/cama/deploy
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 restart cama-plus-server cama-back-batch cama-doctor-web
```

### 2.4 환경 변수 요약 (`.env.cafe24`)

템플릿: `deploy/env.cafe24.example`

| 변수 | 현재 의도 |
|------|-----------|
| `PUBLIC_HOST` | `camaplus.cafe24.com` |
| `POSTGRES_*` | VPS 로컬 Postgres (`cama` 사용자) |
| `JWT_CLIENT_SECRET` | API JWT (운영과 동일 값으로 맞춤) |
| `IMAGE_CDN_BASE_URL` | `https://camaplus.cafe24.com/files` |
| `CAMA_CORS_ORIGINS` | `https://camaplus.cafe24.com` |
| `CAMA_BATCH_FCM_DRY_RUN` | **`true`** — 실제 푸시 미발송 |
| `FIREBASE_CREDENTIALS_PATH` | `/secrets/firebase-adminsdk.json` |
| `CAMA_BILLIVE_BASE_URL` | `http://cama-plus-server:8080` (Docker 내부) |

---

## 3. 데이터베이스

### 3.1 운영 RDS (AWS) — 참고 접속 정보

| 항목 | 운영 | 개발 |
|------|------|------|
| Host | `cama-prd.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com` | `cama-dev.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com` |
| DB | `cama` | `cama` |
| User | `maca` | `maca` |
| Port | 5432 | 5432 |

> 비밀번호는 별도 보관. 문서·Git에 평문 커밋 금지.

**운영 RDS에 존재하는 DB:** `cama`, `postgres`, `rdsadmin` — **`cama_doctor` 없음**.

### 3.2 `cama` DB — 운영 기준 마이그레이션 ✅

**수행 내용 (2026-06-02):**

1. 운영 RDS `pg_dump` → `F:\cama_pjt\db-dump\cama_prod.sql` (~74MB, cmd 리다이렉트로 UTF-8)
2. VPS `/opt/cama/db-import/` 업로드
3. 앱 컨테이너 중지 → `DROP DATABASE cama` → `CREATE DATABASE cama` → `psql` 복원
4. 컨테이너 재기동

**검증 (운영 RDS ↔ Cafe24 VPS 일치):**

| 항목 | 운영 | VPS |
|------|------|-----|
| public 테이블 수 | 42 | 42 |
| `account` | 550 | 550 |
| `care_time_type` | 8 | 8 |
| `cm_doctor` | 3 | 3 |
| `max(account.seq)` | 562 | 562 |
| `max(account.updated_at)` | 2026-05-15 01:12:49 UTC | 동일 |

**의사 비즈니스 데이터** (`cm_doctor` 등)는 **`cama` DB 안**에 있으며, 위 마이그레이션에 포함됨.

**재적용 시 (요약):**

```bash
# VPS
cd /opt/cama/deploy
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 stop cama-plus-server cama-back-batch cama-doctor-web
docker exec cama-cafe24-postgres psql -U cama -d postgres -c 'DROP DATABASE IF EXISTS cama;'
docker exec cama-cafe24-postgres psql -U cama -d postgres -c 'CREATE DATABASE cama OWNER cama;'
cat /opt/cama/db-import/cama_prod.sql | docker exec -i cama-cafe24-postgres psql -U cama -d cama -v ON_ERROR_STOP=1
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 start cama-plus-server cama-back-batch cama-doctor-web
```

### 3.3 `cama_doctor` DB — ⚠️ 스키마만

| 항목 | 내용 |
|------|------|
| 용도 | `cama-doctor-web` 전용 (`app_user`: Firebase UID ↔ Billive doctor_seq 매핑) |
| 운영 RDS | **없음** — 운영 덤프 불가 |
| 현재 VPS | `app_user` 테이블만, **데이터 0건** (`cama_doctor_raw.sql` 기준) |
| 소스 DDL | `cama-doctor-web/src/main/resources/db/ddl/postgresql_schema.sql` |

운영 실데이터가 다른 환경(구 Billive/Cloud Run/로컬 Postgres)에만 있다면, **별도 덤프**로 재반영 필요.

---

## 4. cama-doctor-web

| 항목 | 내용 |
|------|------|
| 원본 참고 | `F:\cama_pjt\cama-doctor_web` |
| Cafe24 반영본 | `F:\cama_pjt\cama-cafe24\cama-doctor-web` |
| 동기화 | `cama-doctor_web` 소스 → cafe24 복사, Cafe24 전용 `build.gradle`·`application-*.yml`·`Dockerfile` 유지 |
| Billive API | Docker 내부 `http://cama-plus-server:8080` (`CAMA_BILLIVE_BASE_URL`) |
| 헬스 | `https://camaplus.cafe24.com/actuator/health` → 200 확인 |

**참고:** 의사 WebView가 Billive API를 호출할 때 **401** 로그가 남을 수 있음 — API 인증·토큰 연동 추가 검증 필요.

---

## 5. 환자 앱 (`cama-plus-app`)

### 5.1 Cafe24 접속 설정 ✅

| 파일 | 설정 |
|------|------|
| `src/config/stage.ts` | `currentStage = 'PROD'` |
| API base URL | `https://camaplus.cafe24.com/` (LOCAL/DEV/PROD 모두 동일) |
| Admin/WebView | `https://camaplus.cafe24.com` |
| `src/services/apis/mainApiClient.ts` | `resolveApiBaseUrl(currentStage)` 사용 |
| `src/screens/MyPage/MyPhoto/index.tsx` | 업로드 URL Cafe24 고정 |

**검색 결과:** `src/` 내 `localhost`, `10.0.2.2`, `amazonaws`, `billive.me` **미사용**.

### 5.2 Android 빌드 — **현재 기준 유지 (JDK 17)**

| 항목 | 값 | 비고 |
|------|-----|------|
| React Native | **0.71.1** | 2023 세대, 최신 안정(0.85) 아님 |
| React | 18.2.0 | |
| JDK (앱 빌드) | **17** | `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot` |
| Gradle | 7.5.1 | |
| AGP | 7.3.1 (RN Gradle Plugin) | |
| compileSdk | 34 | RN 0.71 기본(33)보다 높음 — **빌드 성공 확인** |
| targetSdk | 35 | Play 요구 충족 |
| Hermes | enabled | |

**JDK 21 빌드 테스트:** `assembleRelease` **실패** (`react-native-firebase_app` / `JdkImageTransform`).  
→ **앱은 JDK 17 유지** (문제 없이 빌드됨).

**APK (Cafe24 연동 테스트용):**

| 항목 | 경로 |
|------|------|
| 빌드 산출물 | `cama-plus-app/android/app/build/outputs/apk/release/app-release.apk` |
| 배포용 복사본 | `cama-cafe24/dist/cama-plus-cafe24-1.2.3-release.apk` |
| 버전 | 1.2.3 (versionCode 22) |

**서명:** 배포 keystore(`camaplusappkey.keystore`) 미보유 시 **debug keystore로 서명**된 상태 — 스토어 배포 전 release keystore로 재서명 필요.

**빌드 명령 예시:**

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
.\gradlew.bat clean assembleRelease
```

**알려진 빌드 이슈 (해결됨):**

- Release 시 `src/main/res`의 `node_modules_*` drawable과 번들 생성 리소스 **중복** → 중복 11개 제거 후 빌드
- PowerShell `>` 리다이렉트로 DB 덤프 시 UTF-16/깨짐 → **`cmd /c` 리다이렉트** 사용

---

## 6. cama-back-batch (스케줄 배치)

> **상세 문서:** [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)

| 항목 | 내용 |
|------|------|
| 실행 | VPS `cama-back-batch` 컨테이너 상시 기동, **OS cron 아님** |
| 스케줄러 | `@EnableScheduling` + `RunTask` (`Asia/Seoul`) |
| DB | API와 동일 `cama` (일정·track·통계·FCM 토큰 조회) |
| 분 단위 | `batchCheck` / `batchCheck2` / `batchCheck3` — 복약·내원·멘탈 등 알림 (매 1분) |
| 일 단위 | 01:00 track 만료, 09~17시 코칭·가이드, 23:00 계정 통계 등 |
| Cafe24 수동 API | **없음** (`BatchDevController` = `local-cafe24` 전용) |
| FCM | `CAMA_BATCH_FCM_DRY_RUN=true` 시 job은 돌고 **푸시만 생략** |

**검증 완료 (2026-06-03):**

- DB mig 이후 스케줄 ERROR **0건**
- `dayOneBatch` 01:00 KST 실행 로그
- 테스트 일정(`CAFE24_BATCH_TEST`) → `FCM dry-run type=SCH_002` (복약 알림) 후 **삭제 완료**
- 스크립트: `deploy/scripts/insert-batch-test-schedule.sql`, `cleanup-batch-test-schedule.sql`

---

## 7. Firebase · FCM

| 항목 | 상태 |
|------|------|
| 서버 JSON | `/opt/cama/secrets/firebase-adminsdk.json` (로컬: `cama-plus-server/.../firebase/` 하위 파일 업로드) |
| Batch 초기화 | 로그상 Firebase 로드·초기화 **성공** |
| 실발송 | **`CAMA_BATCH_FCM_DRY_RUN=true`** — 검증 완료 전 **실푸시 금지** |

---

## 8. 주의사항 (운영·개발)

### 8.1 보안

- `.env.cafe24`, RDS 비밀번호, JWT 시크릿, keystore 비밀번호 **Git 커밋 금지**
- VPS SSH는 키 인증 사용, root 비밀번호 노출 최소화
- batch `:8082` **방화벽·Nginx 외부 노출 금지**

### 8.2 DB

- `cama` 재마이그레이션 시 **반드시 API·batch·doctor-web 중지** 후 `DROP/CREATE`
- 덤프는 **cmd UTF-8** 또는 `pg_dump -f` 사용 (PowerShell `>` 단독 사용 금지)
- 운영 RDS에는 `cama_doctor` 없음 — 의사 웹 로그인 매핑 데이터는 **별도 소스** 필요

### 8.3 API / 인증

- `/api/enums` 등 `permitAll` 경로도 **401** 응답이 나는 경우 확인됨 (VPS localhost:8080 동일)
- 서버는 기동 중이나 **Security/JWT 필터와 permitAll 정합성** 추가 점검 필요
- 앱 실사용 전 **로그인·회원가입·케어트랙·이미지 업로드** E2E 테스트 권장

### 8.4 앱 · Android

- **JDK 21로 앱 빌드 JVM만 올리지 말 것** (현 RN 0.71 스택과 비호환)
- RN/Firebase는 SDK 33 세대 기대, 프로젝트는 compile 34 / target 35 — **당분간 유지**, 대규모 업그레이드 전까지 무분별 SDK 상향 지양
- Play 배포용 APK는 **release keystore**로 재서명 필요

### 8.5 파일·이미지 ✅ (2026-06-03)

- `CAMA_STORAGE_TYPE=local`, 경로 `/opt/cama/data/cama-files`
- S3 `cama-images` + `cama-files` → VPS 동기화 완료 (~4700 objects)
- DB URL → `https://camaplus.cafe24.com/files/` 치환 완료
- `/files/**` GET·HEAD 공개 (`SecurityConfig`)
- 재동기화: `python deploy/scripts/aws-to-cafe24-migrate.py --sync-s3 --use-legacy-aws-config`

### 8.6 도메인 · 배치

- Cafe24 무료도메인은 **`api.` 서브도메인 불가** → 반드시 **경로 기반** (`/api/...`)
- 배치 스케줄은 **컨테이너가 살아 있는 동안 자동 실행** — 별도 crontab 설정 불필요
- `cama` DB 재마이그레이션 시 batch도 중지 (일정·track 데이터와 FCM 토큰 동시 영향)
- VPS에서는 `/api/batch/dev` **사용 불가** — 로컬 `local-cafe24` 또는 로그·시각 대기로 검증

---

## 9. TO-BE (해야 할 일)

### 9.1 우선순위 높음 — **APK 실접속** (P0)

| # | 작업 | 설명 |
|---|------|------|
| 1 | **APK 설치·실접속 E2E** | `dist/cama-plus-cafe24-1.2.3-release.apk` — [핸드오프 §C](CAFE24_CURSOR_HANDOFF.md) |
| 2 | Logcat `baseURL` | `https://camaplus.cafe24.com/` 확인 |
| 3 | 로그인 → 홈 → WebView → 사진 업로드 | 운영 mig 계정으로 수동 시나리오 |
| 4 | **API 401 원인 조사** | 실패 시 `SecurityConfig` / JWT — curl `/api/enums` 401 잔존 |
| 5 | **의사 웹 Billive 프록시 인증** | doctor-web → plus-server 호출 시 401 해결 |
| 6 | **`cama_doctor` 실데이터** | 운영에 없음 — 구 환경 덤프 확보 시 `app_user` 반영 |
| 7 | ~~업로드 파일 동기화~~ | ✅ 완료 — [MIGRATION-GIT](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md) |
| 8 | **AWS RDS·CloudFront·S3 만료** | [CAFE24_AWS_DECOMMISSION.md](CAFE24_AWS_DECOMMISSION.md) |
| 9 | **서비스 승인 UI E2E** | `/service-management/service/list` → 승인 화면 |

### 9.2 FCM (검증 완료 후)

| # | 작업 | 설명 |
|---|------|------|
| 6 | FCM DRY_RUN 해제 | `.env.cafe24`에서 `CAMA_BATCH_FCM_DRY_RUN=false` |
| 7 | 푸시 수신 테스트 | Android 앱 + Firebase 프로젝트 설정 일치 확인 |
| 8 | 운영 알림 정책 합의 | 대량 발송·야간 발송 등 |

### 9.3 배포·운영 성숙도

| # | 작업 | 설명 |
|---|------|------|
| 9 | **release keystore** | `camaplusappkey.keystore` 확보·`gradle.properties` 연동·Play 서명 |
| 10 | DB 백업 자동화 | VPS Postgres 일일 덤프 + 보관 주기 |
| 11 | 운영 RDS → VPS **재동기화 절차서** | 본 문서 3.2 + cron/수동 스크립트화 |
| 12 | `SPRING_JPA_HIBERNATE_DDL_AUTO` | doctor-web: 최초 테이블 생성 후 **`validate` 권장** |
| 13 | IAMPORT 키 | `.env.cafe24`에 운영 키 반영 (결제 사용 시) |
| 14 | 모니터링 | 디스크(`/opt/cama/data`), 메모리(6GB), 컨테이너 헬스 |

### 9.4 중장기 (선택)

| # | 작업 | 설명 |
|---|------|------|
| 15 | React Native 업그레이드 | 0.71 → 0.74 → 0.76+ (JDK 21·AGP 8·compileSdk 36 정렬) |
| 16 | AWS RDS·S3·CloudFront **만료** | Cafe24 검증 후 — [DECOMMISSION](CAFE24_AWS_DECOMMISSION.md) |
| 17 | iOS 앱 | 동일 Cafe24 base URL 반영·TestFlight |
| 18 | CI/CD | JAR·APK 빌드·배포 파이프라인 |

---

## 10. 빠른 체크리스트 (배포 후)

상세 TC-ID·curl/adb 명령은 **[CAFE24_TEST_GUIDE.md](CAFE24_TEST_GUIDE.md)** 참고.

```text
[ ] TC-INF-03  docker ps — 4컨테이너 Up, postgres healthy
[ ] TC-DOC-03  https://camaplus.cafe24.com/actuator/health → 200
[ ] TC-DB-02   VPS account count = 550, cm_doctor = 3
[ ] TC-BATCH-01 batch 컨테이너 Up · Firebase initialized
[ ] TC-FCM-02   CAMA_BATCH_FCM_DRY_RUN=true
[ ] TC-APP-10  Logcat: [cama-api] baseURL=https://camaplus.cafe24.com/
[ ] TC-API-02  로그인 → apiToken 발급
[ ] TC-API-10  /api/account/me → 200
[ ] TC-APP-20  앱 로그인 → 홈
[ ] FCM: 의도적 테스트 전까지 DRY_RUN 유지 (TC-FCM-02)
```

---

## 11. 디렉터리 맵 (cama-cafe24)

```text
cama-cafe24/
├── cama-plus-server/      # API (Spring 3.5, JDK 21 빌드)
├── cama-back-batch/       # 배치·FCM
├── cama-doctor-web/       # 의사 웹
├── cama-plus-app/         # React Native 환자 앱 (JDK 17 빌드)
├── deploy/
│   ├── docker-compose.cafe24.yml
│   ├── env.cafe24.example
│   └── scripts/           # 배치 테스트 SQL 등
├── cama-super-admin/      # Super Admin SPA (/admin/)
├── react-app-dawplus/     # 환자 WebView SPA
├── dist/                  # ★ APK: cama-plus-cafe24-1.2.7-release.apk (Git 추적)
└── docs/
    ├── CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md  ← ★ Super Admin·모니터링·Git 3fa1c59
    ├── CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md  ← AWS·Admin·Git
    ├── CAFE24_AWS_DECOMMISSION.md
    ├── CAFE24_PROGRESS_HANDOFF.md
    ├── CAFE24_CURSOR_HANDOFF.md
    ├── CAFE24_WORK_STATUS_AND_TODO.md  ← 본 문서
    └── …
```

---

## 12. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-02 | 운영 RDS `cama` → Cafe24 VPS 마이그레이션, 앱 Cafe24 URL 반영 |
| 2026-06-03 | cama-doctor-web 소스 동기화·JAR 배포, `cama_doctor` 스키마 복원, APK 빌드(JDK17), 본 문서 작성 |
| 2026-06-03 | [CAFE24_TEST_GUIDE.md](CAFE24_TEST_GUIDE.md) 추가 (링크·테스트 케이스) |
| 2026-06-03 | [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md) 추가 (스케줄 배치 상세) |
| 2026-06-03 | 배치 FCM dry-run E2E, [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md) |
| 2026-06-03 | AWS→Cafe24 S3·DB·`/files/`, Super Admin, `/api/doctor/service`, GitHub, [MIGRATION-GIT](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md) |
| 2026-06-06 | Vite Super Admin `/admin/` VPS 배포, 403/JWT, 코칭 radial·월평가 YYYYMM·로딩 UX, Git `3fa1c59` — [HANDOFF 2026-06-06](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md) |
| 2026-06-06 | 문서 `5790939` · **`happycog` `/admin/login` 계정** (`cm_doctor` 생성, PW VPS 반영) |

---

*문서 수정 시 실제 VPS 상태·row count·버전 번호를 재확인한 뒤 갱신할 것.*
