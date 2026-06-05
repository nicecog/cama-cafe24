# Cafe24 연동 — 링크 · 테스트 가이드

> **작성일:** 2026-06-03 · **최종 갱신:** 2026-06-03  
> **대상:** `camaplus.cafe24.com` (Cafe24 VPS) + `cama-plus-app`  
> **Cursor AI 재시작:** [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md)  
> **관련:** [작업 현황·TO-BE](CAFE24_WORK_STATUS_AND_TODO.md) · [배포 가이드](CAFE24_DEPLOYMENT_GUIDE.md) · [배치 스케줄](CAFE24_BATCH_SCHEDULE.md)

---

## 0. 테스트 방침 — APK 실접속 우선

| 항목 | 내용 |
|------|------|
| **기본** | `dist/cama-plus-cafe24-1.2.3-release.apk` 설치 후 **실기기/에뮬레이터**에서 Cafe24 서버 접속 |
| **하지 않음** | Metro + `localhost` / `10.0.2.2` / `run-android` 개발 서버 연동 테스트 (URL 검증 목적 아님) |
| **서버** | curl·SSH는 보조; **앱 Logcat + 화면**이 1차 판단 기준 |
| **계정** | 운영 mig 된 `cama` DB 계정 (비밀번호는 문서에 미기록) |

빠른 시작: [핸드오프 §C APK 실접속](CAFE24_CURSOR_HANDOFF.md#c-apk-실접속-테스트-앞으로의-기본-방식)

---

## 목차

1. [링크 모음](#1-링크-모음)
2. [URL · 경로 맵](#2-url--경로-맵)
3. [테스트 환경 준비](#3-테스트-환경-준비)
4. [테스트 케이스 — 인프라](#4-테스트-케이스--인프라)
5. [테스트 케이스 — DB](#5-테스트-케이스--db)
6. [테스트 케이스 — API (cama-plus-server)](#6-테스트-케이스--api-cama-plus-server)
7. [테스트 케이스 — 의사 웹](#7-테스트-케이스--의사-웹)
8. [테스트 케이스 — 배치 · FCM](#8-테스트-케이스--배치--fcm)
9. [테스트 케이스 — Android 앱](#9-테스트-케이스--android-앱)
10. [E2E 시나리오 (권장 순서)](#10-e2e-시나리오-권장-순서)
11. [결과 기록 템플릿](#11-결과-기록-템플릿)
12. [알려진 이슈 · 기대 결과](#12-알려진-이슈--기대-결과)

---

## 1. 링크 모음

### 1.1 운영·서비스 (공개)

| 구분 | URL | 설명 |
|------|-----|------|
| **메인 (의사 웹)** | https://camaplus.cafe24.com/ | doctor-web 루트 |
| **의사 로그인** | https://camaplus.cafe24.com/login | Thymeleaf 로그인 |
| **환자 API 베이스** | https://camaplus.cafe24.com/api/ | 앱 `mainApiClient` base |
| **파일 CDN** | https://camaplus.cafe24.com/files/ | 업로드 이미지 등 |
| **Billive 프록시** | https://camaplus.cafe24.com/proxy/ | doctor-web → API 중계 |
| **Doctor 헬스** | https://camaplus.cafe24.com/actuator/health | Spring Actuator |
| **HTTP → HTTPS** | http://camaplus.cafe24.com/ | 301/302 리다이렉트 확인용 |

> Cafe24 무료도메인은 **`api.camaplus.cafe24.com` 같은 서브도메인 불가**. API는 반드시 `/api/...` 경로 사용.

### 1.2 서버 · 인프라 (비공개 / 관리)

| 구분 | 값 | 비고 |
|------|-----|------|
| VPS IP | `210.114.18.156` | SSH·방화벽 관리 |
| SSH | `ssh camaplus-vps` | `~/.ssh/config` 별칭 권장 |
| API (내부) | `http://127.0.0.1:8080` | VPS에서만 |
| Doctor (내부) | `http://127.0.0.1:8081` | VPS에서만 |
| Batch (내부) | `http://127.0.0.1:8082` | **외부 노출 금지** |
| Compose | `/opt/cama/deploy/docker-compose.cafe24.yml` | |
| Env | `/opt/cama/deploy/.env.cafe24` | Git 커밋 금지 |
| Nginx 예시 | `deploy/nginx/cama-single-host.conf.example` | 실제: `/etc/nginx/sites-available/cama` |

### 1.3 AWS RDS (참고 · 운영 원본 DB)

| 구분 | Host | DB |
|------|------|-----|
| 운영 | `cama-prd.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com` | `cama` |
| 개발 | `cama-dev.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com` | `cama` |

- User: `maca` / Port: `5432`  
- **`cama_doctor` DB는 RDS에 없음**

### 1.4 로컬 프로젝트 경로

| 구분 | 경로 |
|------|------|
| Cafe24 스택 루트 | `F:\cama_pjt\cama-cafe24` |
| API 소스 | `cama-cafe24\cama-plus-server` |
| 배치 | `cama-cafe24\cama-back-batch` |
| 의사 웹 | `cama-cafe24\cama-doctor-web` |
| 환자 앱 | `cama-cafe24\cama-plus-app` |
| 운영 DB 덤프 | `F:\cama_pjt\db-dump\cama_prod.sql` |
| 테스트 APK | `cama-cafe24\dist\cama-plus-cafe24-1.2.3-release.apk` |
| 앱 API 설정 | `cama-plus-app\src\config\stage.ts` |
| Firebase (로컬) | `cama-plus-server\src\main\resources\firebase\` |
| Firebase (VPS) | `/opt/cama/secrets/firebase-adminsdk.json` |

### 1.5 문서 링크

| 문서 | 파일 |
|------|------|
| 배포 실행 순서 | [CAFE24_DEPLOYMENT_GUIDE.md](CAFE24_DEPLOYMENT_GUIDE.md) |
| API·라이브러리 변경 | [CAFE24_API_MIGRATION.md](CAFE24_API_MIGRATION.md) |
| 작업 현황·TO-BE | [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) |
| **본 문서 (테스트)** | [CAFE24_TEST_GUIDE.md](CAFE24_TEST_GUIDE.md) |
| **배치 스케줄** | [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md) |
| 프로젝트 README | [../README.md](../README.md) |

### 1.6 외부 참고

| 항목 | 링크 |
|------|------|
| Cafe24 가상서버 가이드 | https://help.cafe24.com/docs/server-hosting/virtual-server-hosting/virtual-server-hosting-management-guide |
| Cafe24 무료도메인 HTTPS | https://help.cafe24.com/faq/special-hosting/homepage-hosting/setup-management/https-setup-homepage-builder-ssl |
| React Native 환경 설정 | https://reactnative.dev/docs/set-up-your-environment |

---

## 2. URL · 경로 맵

```text
https://camaplus.cafe24.com
├── /api/*          → cama-plus-server:8080   (환자·의사 REST API)
├── /files/*        → cama-plus-server:8080   (로컬 스토리지 파일)
├── /proxy/*        → cama-doctor-web:8081    (의사 웹 → API 프록시)
├── /actuator/*     → cama-doctor-web:8081    (헬스 등)
└── /*              → cama-doctor-web:8081    (로그인·관리 UI·WebView)

(외부 노출 없음) cama-back-batch:8082
```

### 2.1 앱이 호출하는 대표 API (상대 경로)

| 기능 | Method | 경로 | 인증 |
|------|--------|------|------|
| 일반 로그인 | POST | `/api/auth` | 없음 |
| PASS 로그인 | POST | `/api/auth/pass` | 없음 |
| 관계자(secure) 로그인 | POST | `/api/auth/secure` | 없음 |
| 내 계정 | GET | `/api/account/me` | `api_key: Bearer {token}` |
| 병원 서비스 확인 | GET | `/api/...` (hospital) | 토큰 |
| 이미지 업로드 | POST | `/api/common/images/base64/upload` | 토큰 |
| enum 목록 | GET | `/api/enums` | 없음 (설정상) — **현재 401 이슈** |

JWT 헤더 이름: **`api_key`** (값: `Bearer {apiToken}`)

---

## 3. 테스트 환경 준비

### 3.1 PC (Windows)

| 도구 | 권장 버전·경로 |
|------|----------------|
| JDK (서버 빌드) | 21 — `C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot` |
| JDK (앱 빌드) | **17** — `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot` |
| Android SDK | `%LOCALAPPDATA%\Android\Sdk` |
| PostgreSQL 클라이언트 | `psql` / `pg_dump` (RDS 비교용) |
| curl | **curl.exe** (PowerShell `curl` 별칭 주의) |

### 3.2 테스트 계정

| 용도 | 준비물 | 보관 |
|------|--------|------|
| 환자 앱 로그인 | 운영 이관된 `loginId` / 비밀번호 | 팀 비밀관리 (문서에 기록 금지) |
| 관계자(secure) | `secureCode` | 동일 |
| 의사 웹 | 의사 계정 또는 Firebase 연동 | `cama_doctor.app_user` 데이터 필요 시 별도 |

### 3.3 앱 설치물

```powershell
# APK 경로
F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-1.2.3-release.apk

# 에뮬레이터 설치
adb install -r "F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-1.2.3-release.apk"
```

---

## 4. 테스트 케이스 — 인프라

| ID | 항목 | 방법 | 기대 결과 |
|----|------|------|-----------|
| TC-INF-01 | HTTPS 인증서 | 브라우저에서 https://camaplus.cafe24.com 접속 | 경고 없이 로드 |
| TC-INF-02 | HTTP 리다이렉트 | `curl.exe -I http://camaplus.cafe24.com` | `301`/`302` → HTTPS |
| TC-INF-03 | Docker 4컨테이너 | VPS: `docker ps` | postgres, plus-server, batch, doctor-web **Up** |
| TC-INF-04 | Postgres health | `docker inspect cama-cafe24-postgres` | healthy |
| TC-INF-05 | API 포트 (내부) | VPS: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/` | 응답 (4xx/2xx 가능, 연결 거부 아님) |
| TC-INF-06 | Batch 미노출 | 외부 PC: `curl http://210.114.18.156:8082/` | 타임아웃/거부 (열리면 **실패**) |
| TC-INF-07 | Nginx 라우팅 | `curl.exe -sk https://camaplus.cafe24.com/api/` | API 서버 JSON (404/401 등 연결됨) |
| TC-INF-08 | 디스크 여유 | VPS: `df -h /opt/cama` | 여유 20% 이상 권장 |

**실행 예 (로컬 PC):**

```powershell
curl.exe -sk -o NUL -w "doctor-health:%{http_code}\n" https://camaplus.cafe24.com/actuator/health
curl.exe -sk -o NUL -w "api-root:%{http_code}\n" https://camaplus.cafe24.com/api/
```

**실행 예 (VPS SSH):**

```bash
ssh camaplus-vps "docker ps --format 'table {{.Names}}\t{{.Status}}'"
ssh camaplus-vps "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/"
```

---

## 5. 테스트 케이스 — DB

| ID | 항목 | 방법 | 기대 결과 |
|----|------|------|-----------|
| TC-DB-01 | `cama` 테이블 수 | VPS·운영 RDS 각각 `count(*)` from `information_schema.tables` where public | **42** |
| TC-DB-02 | account 건수 | `select count(*) from account` | **550** |
| TC-DB-03 | care_time_type | `select count(*) from care_time_type` | **8** |
| TC-DB-04 | cm_doctor | `select count(*) from cm_doctor` | **3** |
| TC-DB-05 | 최신 account | `select max(seq), max(updated_at) from account` | 운영·VPS **동일** |
| TC-DB-06 | cama_doctor | `select count(*) from app_user` on `cama_doctor` | 현재 **0** (스키마만) |

**VPS (PowerShell에서 SSH):**

```powershell
ssh camaplus-vps "docker exec cama-cafe24-postgres psql -U cama -d cama -t -c 'select count(*) from account;'"
```

**운영 RDS (로컬 psql):**

```powershell
$env:PGPASSWORD='<비밀번호>'
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -h cama-prd.cqa5tfc6wvv8.ap-northeast-2.rds.amazonaws.com -U maca -d cama -t -c "select count(*) from account;"
```

---

## 6. 테스트 케이스 — API (cama-plus-server)

### 6.1 공개 API (토큰 없음)

| ID | Method | URL | 기대 | 비고 |
|----|--------|-----|------|------|
| TC-API-01 | GET | `/api/enums` | 200 + JSON | **현재 401** — 이슈 추적 |
| TC-API-02 | POST | `/api/auth` | 200 또는 4xx(잘못된 계정) | 아래 body 참고 |
| TC-API-03 | POST | `/api/account/check` | 요청 형식에 따른 200/4xx | 회원가입 전 중복 확인 |
| TC-API-04 | GET | `/files/{path}` | 기존 파일 200 | DB만 이관 시 **404 가능** |

**TC-API-02 로그인 (curl.exe):**

```powershell
curl.exe -sk -X POST "https://camaplus.cafe24.com/api/auth" `
  -H "Content-Type: application/json" `
  -d "{\"principal\":\"<로그인ID>\",\"credentials\":\"<비밀번호>\",\"firebase\":null}"
```

**성공 시 응답 형태 (예):**

```json
{
  "success": true,
  "response": {
    "account": { ... },
    "apiToken": "<JWT>"
  }
}
```

**실패 시:** `success: false`, `error.message` 확인.

### 6.2 인증 API (토큰 필요)

| ID | Method | URL | Header | 기대 |
|----|--------|-----|--------|------|
| TC-API-10 | GET | `/api/account/me` | `api_key: Bearer {token}` | 200 + account |
| TC-API-11 | GET | hospital 관련 API | 동일 | 200 (앱 홈 플로우) |
| TC-API-12 | POST | `/api/common/images/base64/upload` | 동일 | 200 (이미지 업로드) |

**TC-API-10 예시:**

```powershell
$token = "<로그인 후 apiToken>"
curl.exe -sk "https://camaplus.cafe24.com/api/account/me" `
  -H "api_key: Bearer $token"
```

### 6.3 VPS 내부 직접 호출 (Nginx 우회)

| ID | 목적 | 명령 |
|----|------|------|
| TC-API-20 | API만 격리 | `ssh camaplus-vps "curl -s http://127.0.0.1:8080/api/enums"` |
| TC-API-21 | Nginx vs 앱 차이 | 외부 HTTPS vs 내부 8080 결과 비교 |

내부·외부 **동일 401**이면 Nginx 문제보다 **Spring Security** 쪽 가능성 큼.

---

## 7. 테스트 케이스 — 의사 웹

| ID | 항목 | URL | 기대 |
|----|------|-----|------|
| TC-DOC-01 | 로그인 페이지 | https://camaplus.cafe24.com/login | HTML 200, 폼 표시 |
| TC-DOC-02 | 루트 | https://camaplus.cafe24.com/ | 리다이렉트 또는 대시 |
| TC-DOC-03 | Actuator | https://camaplus.cafe24.com/actuator/health | `{"status":"UP"}` 등 **200** |
| TC-DOC-04 | 환자 목록 | `/patient-management/patient/list` | 로그인 후 200 |
| TC-DOC-05 | 프록시 | `/proxy/api/...` (로그인·세션 후) | API JSON (401 해결 후) |
| TC-DOC-06 | WebView | `/webview/treatment/{seq}` | 로그인·데이터 필요 |

**브라우저 수동:** Chrome 시크릿 → 로그인 → 네트워크 탭에서 `/proxy/` 요청 Host가 `camaplus.cafe24.com`인지 확인.

**서버 로그 (401 추적):**

```bash
ssh camaplus-vps "docker logs cama-doctor-web 2>&1 | tail -50"
```

---

## 8. 테스트 케이스 — 배치 · FCM

> 스케줄 잡 목록·cron 표: **[CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)**

| ID | 항목 | 방법 | 기대 |
|----|------|------|------|
| TC-BATCH-01 | 컨테이너 | `docker ps \| grep batch` | Up |
| TC-BATCH-02 | `@Scheduled` 기동 | 로그 `Started RunApplication` | 스케줄러 활성 |
| TC-BATCH-03 | 8082 미노출 | 외부 `curl :8082` | 거부 |
| TC-BATCH-04 | 분 배치 | 일정 데이터 + `grep batchCheck` | targets 로그 |
| TC-BATCH-05 | 10:00 가이드 | KST 10:00 전후 `batchCheck4` | cancer guide 로그 |
| TC-BATCH-06 | 01:00 track | KST 01:00 전후 `dayOneBatch` | CANCEL 로그 |
| TC-BATCH-07 | 로컬 수동 | `local-cafe24` + `GET /api/batch/dev/run/check1` | targets JSON |
| TC-FCM-01 | Firebase 초기화 | `docker logs cama-back-batch 2>&1 \| grep -i firebase` | `Firebase application has been initialized` |
| TC-FCM-02 | DRY_RUN | `.env.cafe24` | `CAMA_BATCH_FCM_DRY_RUN=true` |
| TC-FCM-03 | 실발송 차단 | 스케줄 실행 후 로그 | `FCM dry-run` (푸시 없음) |
| TC-FCM-04 | FCM URL 아웃바운드 | VPS: `curl -I https://fcm.googleapis.com` | 연결 가능 |
| TC-BATCH-08 | FCM dry-run E2E | `insert-batch-test-schedule.sql` + 70초 대기 | `SCH_002` 복약 dry-run 로그 (**2026-06-03 Pass**) |

스크립트: `deploy/scripts/insert-batch-test-schedule.sql`, `cleanup-batch-test-schedule.sql`

**DRY_RUN 해제 후 (TO-BE):**

1. `.env.cafe24` → `CAMA_BATCH_FCM_DRY_RUN=false`
2. `docker-compose ... restart cama-back-batch`
3. TC-FCM-05: 테스트 단말 1대에만 발송 확인

---

## 9. 테스트 케이스 — Android 앱

### 9.1 빌드 · 설치

| ID | 항목 | 방법 | 기대 |
|----|------|------|------|
| TC-APP-01 | JDK 17 빌드 | `gradlew assembleRelease` (JDK17) | BUILD SUCCESSFUL |
| TC-APP-02 | JDK 21 빌드 | 동일 (JDK21) | **실패 예상** (유지 정책) |
| TC-APP-03 | APK 설치 | `adb install -r dist\...apk` | Success |
| TC-APP-04 | 패키지명 | `adb shell pm list packages \| findstr camaplus` | `com.camaplus.app` |

### 9.2 런타임 · 네트워크

| ID | 항목 | 방법 | 기대 |
|----|------|------|------|
| TC-APP-10 | baseURL | Logcat 필터 `[cama-api]` | `baseURL= https://camaplus.cafe24.com/` |
| TC-APP-11 | AWS 미사용 | Logcat 전체 | `amazonaws`, `10.0.2.2`, `billive.me` **없음** |
| TC-APP-12 | HTTPS | 앱 실행 후 첫 API | SSL 핸드셰이크 실패 없음 |
| TC-APP-13 | stage | `stage.ts` | `currentStage = 'PROD'` |

**Logcat (PowerShell):**

```powershell
adb logcat -c
adb logcat | Select-String -Pattern "cama-api|camaplus|axios|Network Error"
```

### 9.3 기능 (수동 E2E)

| ID | 시나리오 | 단계 | 기대 |
|----|----------|------|------|
| TC-APP-20 | 일반 로그인 | ID/PW 입력 → 로그인 | 홈 진입 |
| TC-APP-21 | 병원 미연동 | NOT_SERVICE 계정 | 병원 선택 화면 |
| TC-APP-22 | 홈 로딩 | 로그인 후 홈 | 스케줄·케어트랙 로드 (에러 토스트 없음) |
| TC-APP-23 | 마이페이지 사진 | 사진 업로드 | Cafe24 URL로 POST 성공 |
| TC-APP-24 | WebView | 코칭/치료 WebView | `camaplus.cafe24.com` 로드 |
| TC-APP-25 | 로그아웃·재로그인 | — | 토큰 갱신 정상 |

### 9.4 Metro (개발 빌드 시만)

| ID | 항목 | 명령 | 비고 |
|----|------|------|------|
| TC-APP-30 | Metro | `npm start` in `cama-plus-app` | debug 빌드 시 |
| TC-APP-31 | 포트 충돌 | 8081 사용 여부 | doctor-web과 **포트 다름** (RN Metro 8081 주의) |

---

## 10. E2E 시나리오 (권장 순서)

### 10.1 APK 실접속 (일상 테스트 — 권장)

```text
[1] TC-INF-03, TC-DOC-03     서버·헬스 (1분)
[2] TC-APP-03                APK 설치
[3] TC-APP-10                Logcat baseURL = camaplus.cafe24.com
[4] TC-APP-20                로그인
[5] TC-APP-22                홈
[6] TC-APP-23, 24            업로드·WebView
(실패 시) TC-API-02, 04      curl로 API 분리 진단
```

### 10.2 전체 점검 (배포·마이그 직후)

```text
[1] TC-INF-01 ~ 08     인프라·컨테이너
[2] TC-DB-01 ~ 06      DB row count
[3] TC-BATCH-01~05     스케줄 배치·로그
[4] TC-FCM-01, 02      FCM·DRY_RUN
[5] §10.1 APK 시나리오
```

**소요 시간:** APK만 30분~1시간 / 전체 2시간+

---

## 11. 결과 기록 템플릿

검증 일자: ____________  
검증자: ____________  
APK 버전: ____________ (예: 1.2.3 / 22)  
VPS JAR 배포일: ____________

| ID | Pass/Fail/Skip | 실제 결과 | 메모 |
|----|----------------|-----------|------|
| TC-INF-01 | | | |
| TC-DB-02 | | | |
| TC-API-02 | | | |
| TC-API-10 | | | |
| TC-DOC-03 | | | |
| TC-FCM-01 | | | |
| TC-APP-10 | | | |
| TC-APP-20 | | | |

---

## 12. 알려진 이슈 · 기대 결과

| 이슈 | 영향 | 테스트 시 |
|------|------|-----------|
| `/api/enums` 등 401 | 공개 API 스모크 | **Fail 예상** — TC-API-01 Skip 또는 이슈 티켓 |
| `cama_doctor.app_user` 0건 | 의사 웹 Firebase 매핑 | TC-DOC-04~06 제한적 |
| 파일 스토리지 미동기화 | 이미지 404 | TC-API-04, TC-APP-23 Fail 가능 |
| FCM DRY_RUN | 푸시 | TC-FCM-03은 “미발송”이 **정상** |
| APK debug 서명 | 스토어 배포 | 내부 테스트만 Pass |

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-03 | 최초 작성 (링크·TC-ID·curl/adb 예시) |
| 2026-06-03 | APK 실접속 우선 방침, TC-BATCH-08, E2E §10.1 |

---

*테스트 계정·비밀번호는 이 문서에 작성하지 말고, Pass/Fail 시트에만 기록할 것.*
