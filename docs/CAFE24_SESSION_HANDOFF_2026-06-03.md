# Cafe24 세션 작업 기록 — WebView · 로그인 ID 변경 · 로그인 오류 (2026-06-03)

> **최종 갱신:** 2026-06-03  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** Cursor·개발자가 **다시 시작할 때** 이번 세션에서 한 작업·검증 결과·계정 상태·다음 단계를 한 문서에서 참조.

**관련 문서 (읽는 순서)**

1. [CAFE24_SESSION_HANDOFF_2026-06-04.md](CAFE24_SESSION_HANDOFF_2026-06-04.md) — **이후 세션** WebView 성능·탭바·헤더
2. **본 문서** — 이번 세션(WebView nginx, ID 변경, 로그인 메시지, APK 1.2.7)
3. [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) — 계정 복구·APK 1.2.4·Brevo
3. [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md) — 재시작 5분 체크리스트
4. [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) — 인프라·TO-BE 상세

**대화 기록 (Cursor):** `agent-transcripts` — `b7713878-c619-4b2e-80f1-eb3bc4424371`

---

## 1. 재시작 시 5분 체크리스트

```text
[ ] 1. 워크스페이스: F:\cama_pjt\cama-cafe24 (앱은 cama-plus-app, 서버는 cama-plus-server)
[ ] 2. VPS: ssh camaplus-vps "docker ps --format '{{.Names}} {{.Status}}'"
[ ] 3. Health: curl.exe -sk https://camaplus.cafe24.com/actuator/health
[ ] 4. 앱 stage: cama-plus-app/src/config/stage.ts → currentStage = 'PROD'
[ ] 5. 최신 APK: dist/cama-plus-cafe24-1.2.7-release.apk
[ ] 6. WebView 감사: ssh camaplus-vps "python3 /tmp/vps-webview-url-audit.py"
[ ] 7. 로그인 감사(선택): ssh camaplus-vps "python3 /tmp/vps-test-auth-errors.py"
```

---

## 2. 인프라 · 배포 (변경 없음 + 주의)

| 항목 | 값 |
|------|-----|
| 공개 URL | `https://camaplus.cafe24.com` |
| VPS SSH | `camaplus-vps` (`210.114.18.156`) |
| API | `cama-plus-server` → `:8080` |
| Doctor web | `cama-doctor-web` → `:8081` |
| Postgres | Docker `c6fdf0e55844_cama-cafe24-postgres` (또는 `docker ps`로 이름 확인) |
| API JAR | `/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar` |
| 배포 루트 | `/opt/cama/` |

### Nginx 주의 (중요)

- **활성 설정:** `/etc/nginx/sites-enabled/cama` — **복사본** (symlink 아님)
- coaching/help WebView 수정 시 **`sites-enabled/cama`에 반영** 또는 `apply-coaching-nginx.py` 실행
- `sites-available`만 수정하면 **적용 안 됨**

### 서버 JAR 배포 (표준)

```powershell
cd F:\cama_pjt\cama-cafe24
python deploy/scripts/make-server-src-zip.py
scp deploy/cama-plus-server-src.zip camaplus-vps:/tmp/
# VPS에서 Maven 빌드 후 JAR 복사·재시작 (기존 스크립트/대화 기록 참고)
```

---

## 3. 이번 세션 완료 작업 요약

### 3.1 건강코칭 WebView Whitelabel Error → 해결

| 증상 | 로그인 후 건강코칭 탭 → Spring Whitelabel 404 |
|------|-----------------------------------------------|
| 원인 | 앱 URL `${adminUrl}/webview/coaching/{loginId}` — doctor-web에는 `/webview/treatment/{seq}`만 있음. 코칭 SPA는 CloudFront |
| 해결 | nginx: `/webview/(coaching|help)/**`, `/assets/**` → CloudFront 프록시 + HTML에 API URL 치환 스크립트 주입 |

**파일**

- `deploy/nginx/cama-coaching-webview-locations.conf`
- `deploy/scripts/apply-coaching-nginx.py` (패턴: `# Mobile app (?:WebView SPA|health coaching WebView)` … `location / {`)

### 3.2 WebView URL 전수 감사

| 경로 | 상태 |
|------|------|
| `/webview/coaching/{loginId}` | 200 |
| `/webview/coaching/wellbeing/{loginId}` | 200 |
| `/webview/help` | 200 (이전 404 → nginx 수정) |
| `/webview/treatment/{seq}` | 200 (doctor-web) |
| `/assets/index-*.js` | 200 |

**감사 스크립트:** `deploy/scripts/vps-webview-url-audit.py`  
- `01032984763` → recover API로 **현재 loginId 자동 조회** (기본 `happycog`)

### 3.3 로그인 ID 변경 기능

**서버**

- `PUT /api/account/login-id` (인증 필요)
- DTO: `ChangeLoginIdRequest` (`newLoginId`, `credentials`)
- 검증: 영문/숫자 4~20자, GENERAL/DEFAULT만, 중복·비밀번호 확인
- `account.login_id` 업데이트 + **새 JWT** 발급
- 변경 후 DB 검증 (`countBySeqAndLoginId`)

**앱**

- 마이페이지 → **본인 정보 확인** → 아이디 표시 + **로그인 ID 변경** 모달
- `src/services/apis/account/` — `changeLoginId()`
- `src/screens/MyPage/UserInfo/index.tsx`

### 3.4 DB 스키마 패치 (500 오류 원인)

| 증상 | `/api/account/me`, `PUT /api/account/login-id` → 500 |
|------|------------------------------------------------------|
| 원인 | Postgres `account` 테이블에 `patient_management_number` 컬럼 없음 (JPA 엔티티와 drift) |
| 해결 | VPS에 컬럼·unique index 추가 |

**SQL:** `deploy/sql/cafe24-account-schema-patch.sql`  
**적용 스크립트:** `deploy/scripts/vps-apply-schema-patch.py`

### 3.5 QA 계정 — ID 변경 완료

| 항목 | 값 |
|------|-----|
| 이름 | 최완규 |
| 전화 | `01032984763` |
| **현재 loginId** | **`happycog`** |
| 이전 loginId | `C23IFZ39UWLD4` (더 이상 사용 불가) |
| account seq | **121** (활성) |
| 중복 계정 | seq **118** `6VIQ934Y2F75D` — **탈퇴(dropped)** |

**E2E 스크립트:** `deploy/scripts/vps-change-login-id-e2e.py`

### 3.6 DB — 이전 ID 잔존 데이터 검증

**결론:** `C23IFZ39UWLD4` 문자열은 **DB 전체 varchar/text/json에 0건**.  
환자 데이터는 **`account_seq=121`** 로만 연결 (코칭 답변 142건 등 유지).

| login_id 컬럼 테이블 | 환자 관련 |
|---------------------|-----------|
| `account` | ✅ 유일 (변경 대상) |
| `cm_admin`, `cm_doctor` | 관리자/의사 전용 |

**감사 스크립트**

- `deploy/scripts/vps-audit-login-id-refs.py`
- `deploy/scripts/vps-audit-login-id-deep.py`

### 3.7 로그인 실패 메시지 개선

| 원인 (사용자 증상) | 이전 임시 비밀번호 사용 + 구 아이디 시도 |
|--------------------|----------------------------------------|
| 서버 | 모든 실패 → `Authentication error (cause: unauthorized)` |
| 해결 | 한글 메시지 분리 (배포 완료) |

| 상황 | API 메시지 |
|------|------------|
| 비밀번호 불일치 | 비밀번호가 일치하지 않습니다. 비밀번호 찾기에서 임시 비밀번호를 다시 발급받을 수 있습니다. |
| 아이디 없음 | 존재하지 않는 아이디입니다. |
| 구 ID `C23IFZ39UWLD4` | 존재하지 않는 아이디입니다. |

**서버 파일**

- `EntryPointUnauthorizedHandler.java`
- `JwtAuthenticationProvider.java`

**앱 파일**

- `src/utils/loginErrorMessage.ts`
- `src/hooks/auth/usePatientSession.ts`
- `src/screens/Auth/FindAccountScreen/index.tsx` — 임시 비밀번호 **재발급 시 이전 번호 무효** 안내

**주의:** 비밀번호 초기화를 할 때마다 **이전 임시 비밀번호는 즉시 무효**. 테스트·E2E 중 여러 번 reset 했을 수 있음.

---

## 4. Android APK 빌드 이력 (이번 세션)

| 버전 | versionCode | 경로 | 비고 |
|------|-------------|------|------|
| 1.2.5 | 24 | `dist/cama-plus-cafe24-1.2.5-release.apk` | 코칭 nginx 등 |
| 1.2.6 | 25 | `dist/cama-plus-cafe24-1.2.6-release.apk` | 로그인 ID 변경 UI |
| **1.2.7** | **26** | **`dist/cama-plus-cafe24-1.2.7-release.apk`** | **로그인 실패 alert·PW 초기화 안내** ← **권장** |

**빌드 (JDK 17 필수)**

```powershell
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
.\gradlew.bat assembleRelease --no-daemon
Copy-Item app\build\outputs\apk\release\app-release.apk `
  F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-1.2.7-release.apk
```

---

## 5. 주요 파일 경로 (빠른 참조)

### 서버 (cama-plus-server)

```
src/main/java/com/cama/back/
  controller/account/AccountRestController.java     # PUT account/login-id
  service/account/AccountServiceImpl.java           # changeLoginId()
  repo/account/AccountRepository.java               # updateLoginIdBySeq
  dto/account/ChangeLoginIdRequest.java
  dto/account/ChangeLoginIdResponse.java
  security/EntryPointUnauthorizedHandler.java       # 로그인 실패 메시지
  security/JwtAuthenticationProvider.java
  domain/account/Platform.java                      # ANDROID 대소문자 (이전 세션)
```

### 앱 (cama-plus-app)

```
src/screens/MyPage/UserInfo/index.tsx               # 로그인 ID 변경 UI
src/hooks/auth/usePatientSession.ts                 # 로그인 + 에러 alert
src/utils/loginErrorMessage.ts                      # 에러 메시지 매핑
src/screens/Auth/FindAccountScreen/index.tsx
src/screens/Auth/LoginCredentialsScreen/index.tsx
src/services/apis/account/index.ts
```

### 배포 · 운영 스크립트

```
deploy/nginx/cama-coaching-webview-locations.conf
deploy/scripts/apply-coaching-nginx.py
deploy/scripts/vps-webview-url-audit.py
deploy/scripts/vps-change-login-id-e2e.py
deploy/scripts/vps-apply-schema-patch.py
deploy/scripts/vps-audit-login-id-refs.py
deploy/scripts/vps-audit-login-id-deep.py
deploy/scripts/vps-debug-login.py
deploy/scripts/vps-test-auth-errors.py
deploy/sql/cafe24-account-schema-patch.sql
deploy/scripts/make-server-src-zip.py
```

---

## 6. 운영 · 테스트 명령 (VPS)

```bash
# WebView URL 감사 (loginId 자동: happycog)
python3 /tmp/vps-webview-url-audit.py

# 로그인 ID 변경 E2E (이미 happycog면 검증만)
python3 /tmp/vps-change-login-id-e2e.py

# 로그인 오류 메시지 확인
python3 /tmp/vps-test-auth-errors.py

# nginx coaching 블록 재적용
python3 /tmp/apply-coaching-nginx.py && nginx -t && systemctl reload nginx
```

스크립트를 VPS에 올릴 때:

```powershell
scp deploy/scripts/vps-*.py camaplus-vps:/tmp/
```

---

## 7. 로그인 방법 (QA / 실기기)

1. **아이디:** `happycog` (`C23IFZ39UWLD4` 사용 불가)
2. **비밀번호:** 앱 **ID/PW 찾기 → PW 초기화**
   - 아이디: `happycog`
   - 이름: 최완규
   - 전화: `01032984763`
3. alert의 **임시 비밀번호를 그대로** 복사해 로그인 (재발급 시 **이전 임시 번호 무효**)
4. 로그인 후 비밀번호 변경 권장

서버만 갱신된 경우에도 로그인 실패 시 **한글 메시지**가 내려옴. alert·초기화 안내는 **APK 1.2.7** 권장.

---

## 8. 이전 세션에서 이미 해결된 항목 (참고)

| 항목 | 내용 |
|------|------|
| 비밀번호 초기화 후 401 | `Platform.fromJson()` 대소문자 무시 (`ANDROID`) |
| recover API | `/api/public/patient/recover/*` |
| 코칭 API | `loginId` → `account_seq` 조회 후 데이터 접근 |

---

## 9. 미완료 · 후속 작업

| 우선순위 | 항목 |
|----------|------|
| P1 | **APK 1.2.7 실기기 E2E** — 로그인, 건강코칭 WebView, ID 변경 UI |
| P1 | 사용자 **임시 비밀번호 재발급** 후 로그인 확인 (happycog) |
| P2 | nginx `sites-available` ↔ `sites-enabled` 동기화 또는 symlink |
| P2 | 코칭/help SPA **CloudFront 의존** → 장기적으로 VPS 자체 호스팅 검토 |
| P2 | Brevo SMTP·`camaplus.me` DNS (기존 PROGRESS_HANDOFF 참고) |
| P3 | `CAMA_BATCH_FCM_DRY_RUN` — 실푸시 전 검증 유지 |

---

## 10. 알려진 이슈 · 함정

1. **임시 비밀번호:** 초기화할 때마다 이전 임시 비밀번호 무효. E2E·디버그 스크립트가 reset 하면 사용자 비밀번호도 바뀜.
2. **nginx:** `sites-enabled/cama`만 실제 적용.
3. **Postgres drift:** 새 환경 배포 시 `deploy/sql/cafe24-account-schema-patch.sql` 적용 필요.
4. **JDK:** 앱 빌드는 **JDK 17**. JDK 21은 `assembleRelease` 실패.
5. **동일 전화 2계정:** 01032984763 — 활성은 seq 121만 사용.

---

## 11. API 빠른 참조

| API | 메서드 | 비고 |
|-----|--------|------|
| `/api/auth` | POST | `principal`, `credentials`, `firebase.platform`: `ANDROID` |
| `/api/public/patient/recover/login-id` | POST | name, phone |
| `/api/public/patient/recover/reset-password` | POST | loginId, name, phone |
| `/api/account/login-id` | PUT | Bearer token, `newLoginId`, `credentials` |
| `/api/account/me` | GET | Bearer token |

---

*문서 끝 — 다음 세션 시작 시 §1 체크리스트 → §7 로그인 → §9 후속 작업 순으로 진행.*
