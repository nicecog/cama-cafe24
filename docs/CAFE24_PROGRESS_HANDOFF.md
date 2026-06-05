# Cafe24 이관 — 작업 진행 상황 (재시작용)

> **최종 갱신:** 2026-06-04  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** Cursor·개발자가 세션을 새로 열 때 **지금까지 한 일·미완료·다음 단계**를 한 번에 파악.

**관련 문서 (읽는 순서)**

1. **[CAFE24_SESSION_HANDOFF_2026-06-04.md](CAFE24_SESSION_HANDOFF_2026-06-04.md)** — **최신** WebView 성능·탭바·RN 홈 복귀·웰빙/건강코칭 헤더
2. **[CAFE24_SESSION_HANDOFF_2026-06-03.md](CAFE24_SESSION_HANDOFF_2026-06-03.md)** — WebView nginx·ID 변경·로그인·APK 1.2.7
3. **[WEBVIEW_PERFORMANCE_FUTURE.md](WEBVIEW_PERFORMANCE_FUTURE.md)** — WebView 성능 추후 검토
4. **본 문서** — 계정 복구·APK 1.2.4·Brevo·이슈 정리
5. [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md) — 재시작 5분 체크리스트·배치·APK 테스트
6. [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) — 인프라·TO-BE 상세
7. [CAFE24_TEST_GUIDE.md](CAFE24_TEST_GUIDE.md) · [CAFE24_DEPLOYMENT_GUIDE.md](CAFE24_DEPLOYMENT_GUIDE.md)

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| VPS + HTTPS `camaplus.cafe24.com` | ✅ 운영 중 |
| 환자 **ID 찾기 / PW 초기화** API·앱 | ✅ 배포·프로덕션 스모크 OK |
| Android APK **1.2.4** | ✅ 빌드·`dist/` 반영 |
| **Brevo SMTP** | ⏳ DNS(`camaplus.com`) **등록 완료** → Brevo Authenticate·VPS `SPRING_MAIL_USERNAME`·발송 테스트 남음 |
| APK 실접속 E2E (로그인·WebView 등) | ⏳ 다음 작업 |
| permitAll 401 (`/api/enums` 등) | ⚠️ 별도 이슈 잔존 가능 |

---

## 2. 인프라 (변경 없음 · 참고)

| 항목 | 값 |
|------|-----|
| 공개 URL | `https://camaplus.cafe24.com` |
| VPS | `210.114.18.156` · SSH `camaplus-vps` |
| 배포 루트 | `/opt/cama/` |
| Compose | `/opt/cama/deploy/docker-compose.cafe24.yml` |
| Env (비밀) | `/opt/cama/deploy/.env.cafe24` — **Git 커밋 금지** |
| API JAR | `/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar` |

**도메인 역할 분리**

| 도메인 | 용도 | DNS |
|--------|------|-----|
| `camaplus.cafe24.com` | VPS HTTPS, API, 앱 PROD | Cafe24 무료도메인 (**서브도메인·DKIM 불가**) |
| `camaplus.me` | 메일 발신 예정 (`CAMA_MAIL_FROM`) | **AWS(Route53 등)** — Brevo DKIM/DMARC 여기 등록 |

---

## 3. 계정 복구 (ID/PW) — 완료 내역

### 3.1 배경 · 원인

- 증상: 특정 번호(`01032984763`) — 가입 시 “이미 가입”, **ID 찾기**는 “데이터 없음”, **401** 발생.
- DB: 동일 번호에 탈퇴(seq 118) + **활성**(seq 121, loginId `C23IFZ39UWLD4`, PASS/DEFAULT, **email 없음**).
- 원인: `existsByPhone`은 되나 **Account 엔티티 전체 로드** 시 401. → **Projection 쿼리** + `updatePasswordBySeq`로 회피.

### 3.2 서버 API (공개)

Base: `https://camaplus.cafe24.com/api/public/patient`

| Method | Path | 입력 | 응답 |
|--------|------|------|------|
| POST | `recover/login-id` | 이름 + 전화 | `found`, `loginId` |
| POST | `recover/password` | 이름 + 전화 + **이메일** | 임시 PW **이메일 발송** (`sendTemporaryPassword`) |
| POST | `recover/reset-password` | **아이디** + 이름 + 전화 | 임시 PW **JSON 응답** (이메일 없는 계정용) |

**주요 파일**

- `cama-plus-server/.../PublicPatientAccountRestController.java`
- `cama-plus-server/.../PatientAccountServiceImpl.java` — `findLoginId`, `sendTemporaryPassword`, `resetPassword`
- `cama-plus-server/.../AccountRepository.java` — `findLoginIdByNameAndPhone`, `findRecoveryInfo*`, `updatePasswordBySeq`
- `cama-plus-server/.../SecurityConfig.java` — `/api/public/**`, recover 경로 permitAll

**레거시 경로** (앱은 public 사용): `/api/account/patient/find/*`, `recover/*` 일부 병행.

### 3.3 앱 (cama-plus-app)

| 화면 | 동작 |
|------|------|
| `FindAccountScreen` | 탭 **ID 찾기**: 이름+전화 → `/recover/login-id` |
| | 탭 **PW 초기화**: loginId+이름+전화 → `/recover/reset-password` → Alert에 임시 비밀번호 |
| `patientAuth/index.ts` | 위 public API 연동 |
| `stage.ts` | `PROD` → `https://camaplus.cafe24.com/` |

### 3.4 VPS 배포·검증 (2026-06-03)

```text
python deploy/scripts/make-server-src-zip.py
scp → camaplus-vps:/tmp/cama-plus-server-src.zip
VPS: unzip → docker maven package → cp jar → docker restart cama-plus-server
python3 /tmp/vps-reset-password-test.py  → OK 200
```

- `recover/login-id` (최완규 / 01032984763) → `loginId: C23IFZ39UWLD4`
- `recover/reset-password` → 200, `temporaryPassword` 반환 (테스트마다 값 변경됨)

### 3.5 QA 참고 (비밀번호는 문서에 고정하지 말 것)

- 활성 계정: 이름 `최완규`, 전화 `01032984763`, loginId `C23IFZ39UWLD4`
- PW 초기화 후 **방금 받은** 임시 비밀번호로 로그인 (`POST /api/auth` + firebase 필드)

---

## 4. Android APK — 1.2.4

| 항목 | 값 |
|------|-----|
| 파일 | `dist/cama-plus-cafe24-1.2.4-release.apk` |
| versionName | `1.2.4` |
| versionCode | `23` (`android/app/build.gradle`) |
| JDK | **17** (`C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot`) |
| 이전 빌드 | `dist/cama-plus-cafe24-1.2.3-release.apk` (code 22) |

**재빌드**

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
.\gradlew.bat clean assembleRelease --no-daemon
Copy-Item "app\build\outputs\apk\release\app-release.apk" `
  "..\..\dist\cama-plus-cafe24-1.2.4-release.apk" -Force
```

---

## 5. 이메일 · Brevo SMTP — 진행 중

### 5.1 코드·템플릿 (로컬 반영 ✅, VPS 미반영 가능)

| 파일 | 내용 |
|------|------|
| `application-cafe24.yml` | `cama.mail` + `spring.mail` (Brevo) |
| `application-local-cafe24.yml` | 동일 |
| `deploy/docker-compose.cafe24.yml` | `SPRING_MAIL_*` 전달 |
| `deploy/env.cafe24.example` | Brevo 예시 변수 |

**동작**

- `CAMA_MAIL_ENABLED=true` → `SmtpEmailService` + `JavaMailSender`
- `false` (VPS 기본) → `LoggingEmailService` (로그만)

**Brevo SMTP (공식)**

| 항목 | 값 |
|------|-----|
| Host | `smtp-relay.brevo.com` |
| Port | `587` (STARTTLS) |
| Username | Brevo **로그인 이메일** |
| Password | **SMTP key** (`xsmtpsib-...`) — API key 아님 |

### 5.2 VPS에 넣을 `.env.cafe24` (예시 — 실제 키는 Git 금지)

```env
CAMA_MAIL_ENABLED=true
CAMA_MAIL_FROM=noreply@camaplus.me

SPRING_MAIL_HOST=smtp-relay.brevo.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=<Brevo 로그인 이메일>
SPRING_MAIL_PASSWORD=<SMTP key — 채팅/커밋 금지, 유출 시 재발급>
```

배포: JAR에 `application-cafe24.yml` 포함 후 재시작 + compose env 전달.

### 5.3 Brevo Senders / Domains (미완 · 필수)

1. **Domains** → `camaplus.me` 추가
2. **AWS Route53**(또는 `camaplus.me` DNS)에 Brevo code · DKIM · DMARC TXT/CNAME
3. **Senders** → `noreply@camaplus.me` (표시명 예: `CAMA Plus`)
4. Google/Yahoo 요구: sender **DKIM + DMARC compliant** 확인

**불가**

- `noreply@camaplus.cafe24.com` — 무료도메인, DNS·이메일 계정 생성 불가, Brevo 도메인 인증 불가

### 5.4 API별 이메일 동작

| API | 이메일 발송 |
|-----|-------------|
| `recover/password` | ✅ DB email 일치 시 `emailService.sendPlainText` |
| `recover/reset-password` | ❌ 응답에만 임시 PW (SMTP 미연동) — 연동 시 코드 추가 필요 |

이메일 없는 PASS 계정 다수 → **SMS** 또는 **reset-password 화면 표시**가 현실적 대안.

---

## 6. 서버 배포 절차 (소스 변경 시)

```powershell
python F:\cama_pjt\cama-cafe24\deploy\scripts\make-server-src-zip.py
scp F:\cama_pjt\cama-cafe24\deploy\cama-plus-server-src.zip camaplus-vps:/tmp/cama-plus-server-src.zip
```

```bash
ssh camaplus-vps
rm -rf /tmp/cama-plus-server && mkdir -p /tmp/cama-plus-server
cd /tmp/cama-plus-server && python3 -m zipfile -e /tmp/cama-plus-server-src.zip .
sed -i 's/\r$//' pom.xml
docker run --rm -v /tmp/cama-plus-server:/app -v /root/.m2:/root/.m2 -w /app \
  maven:3.9-eclipse-temurin-21 mvn clean package -DskipTests -q
cp target/cama-back-1.0-SNAPSHOT.jar /opt/cama/jars/cama-back-1.0-SNAPSHOT.jar
docker restart cama-plus-server
```

**검증 스크립트**

- `deploy/scripts/vps-reset-password-test.py`
- `deploy/scripts/vps-auth-recover-test.py`
- `deploy/scripts/vps-phone-check.py`

**주의**

- `docker compose` 대신 VPS는 **`docker-compose`** 사용
- postgres 재생성 시 컨테이너명이 `c6fdf0e55844_cama-cafe24-postgres` 등으로 바뀔 수 있음 → `docker ps` 확인

---

## 7. 미완료 · 다음 작업 (우선순위)

| 우선 | 작업 | 비고 |
|------|------|------|
| **P0** | APK **1.2.4** 실기기 E2E | ID 찾기 → PW 초기화 → 임시 PW 로그인 |
| **P0** | Brevo `camaplus.me` DNS 인증 + VPS `.env` + JAR 재배포 | SMTP key 재발급 권장(채팅 유출 이력) |
| P1 | `reset-password` 성공 시 응답에서 PW 제거 + 이메일 발송 | 보안·Brevo 연동 후 |
| P1 | `/api/enums` 등 permitAll 401 | SecurityConfig·필터 |
| P1 | `MyPhoto/index.tsx` 하드코딩 JWT 만료 | 별도 이슈 |
| P2 | SMS (NCP/알리고 등) | 이메일 없는 계정 대량 |
| P2 | FCM `CAMA_BATCH_FCM_DRY_RUN=false` | APK·배치 검증 후 |

---

## 8. 재시작 시 5분 체크리스트

```text
[ ] ssh camaplus-vps "docker ps"  → postgres, cama-plus-server, batch, doctor-web Up
[ ] curl.exe -sk https://camaplus.cafe24.com/actuator/health → 200
[ ] recover API: ssh + python3 /tmp/vps-reset-password-test.py (또는 curl)
[ ] dist/cama-plus-cafe24-1.2.4-release.apk 존재
[ ] stage.ts → PROD, baseURL camaplus.cafe24.com
[ ] grep CAMA_MAIL /opt/cama/deploy/.env.cafe24  → Brevo 설정 여부
[ ] Brevo Domains: camaplus.me DKIM/DMARC 상태
```

---

## 9. 보안 · 운영 메모

- `.env.cafe24`, Firebase JSON, **SMTP key** — Git·채팅에 올리지 않음
- SMTP key가 채팅에 노출된 적 있음 → **Brevo에서 재발급** 후 VPS만 갱신
- 테스트 계정 비밀번호는 reset 할 때마다 바뀜 — 문서에 고정값 기록하지 않음

---

## 10. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-02~03 | VPS·DB·배치·doctor-web·APK 1.2.3 ([CURSOR_HANDOFF](CAFE24_CURSOR_HANDOFF.md)) |
| 2026-06-03 | ID/PW 찾기 401 수정, public recover API, reset-password, APK **1.2.4**, VPS 재배포 |
| 2026-06-03 | Brevo SMTP yml/compose/example 추가, camaplus.me vs cafe24.com 메일 정리, **본 문서 작성** |

---

*새 Cursor 세션: 본 문서 → [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md) §A 순으로 진행.*
