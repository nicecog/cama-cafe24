# Cafe24 세션 핸드오프 — APK 관리·브릿지 검증·관리자 계정 (2026-06-17)

> **작성일:** 2026-06-17 · **갱신:** 2026-06-03 (문서 통합 반영)  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** react-app 통합, RN 브릿지·API 검증, APK 빌드·에뮬레이터 테스트, **Super Admin APK 관리** 기능, **관리자 로그인 `cama`** 설정까지의 전체 내역을 한 문서에 정리.

**선행·연관 문서**

- [CAFE24_REACT_NATIVE_BRIDGE_ANALYSIS_2026-06-17.md](CAFE24_REACT_NATIVE_BRIDGE_ANALYSIS_2026-06-17.md) — 브릿지·API E2E 상세
- [CAFE24_SESSION_HANDOFF_2026-06-12-TABLET-VITAL-BATCH.md](CAFE24_SESSION_HANDOFF_2026-06-12-TABLET-VITAL-BATCH.md) — 생체신호·QR·배치
- [CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md](CAFE24_SESSION_HANDOFF_2026-06-06-SUPER-ADMIN-MONITORING.md) — Super Admin 기초
- [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) · [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md)

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| `react-app-dawplus` 모노레포 통합 | ✅ `cama-cafe24/react-app-dawplus/` |
| RN ↔ SPA 브릿지·라우트·API E2E | ✅ 37 OK / 0 FAIL (스크립트 검증) |
| Vital API 404·500 수정·VPS 재배포 | ✅ |
| Android release APK 빌드 (JDK 17) | ✅ `dist/cama-plus-cafe24-2026-06-17.apk` |
| 에뮬레이터 설치·실행 (CAMA_API33) | ✅ 수동 로그인 필요 |
| **Super Admin APK 관리** 메뉴·API·배포 | ✅ |
| APK 공개 다운로드 `/apk_down/` | ✅ |
| 관리자 로그인 `cama` / `cama!` | ✅ `cm_doctor` + `cm_admin` |

---

## 2. URL · 프로젝트 매핑

| URL | 프로젝트 | 비고 |
|-----|----------|------|
| `https://camaplus.cafe24.com/admin/` | `cama-super-admin/` | Vite SPA, doctor JWT 로그인 |
| `https://camaplus.cafe24.com/` (환자 SPA) | `react-app-dawplus/` | WebView 내 로드 |
| `https://camaplus.cafe24.com/api/*` | `cama-plus-server/` | Spring Boot `:8080` |
| `https://camaplus.cafe24.com/apk_down/*` | VPS `/opt/cama/data/apk_down/` | API 정적 서빙 + nginx 프록시 |
| `https://camaplus.cafe24.com/files/*` | `/opt/cama/data/cama-files/` | 이미지 등 |

---

## 3. 디렉터리 변경 (react-app-dawplus)

| 이전 | 이후 |
|------|------|
| `F:\cama_pjt\react-app-dawplus` | `F:\cama_pjt\cama-cafe24\react-app-dawplus` |

- `package.json`의 `build:cafe24` → `../deploy/scripts/build-react-app-cafe24.mjs` 경로 정상 동작 확인
- 관련 MD 갱신: `CAFE24_REACT_NATIVE_BRIDGE_ANALYSIS_2026-06-17.md`, `CAFE24_WORK_STATUS_AND_TODO.md`, `REACT_APP_DAWPLUS_ANALYSIS.md`, `CAFE24_CURSOR_HANDOFF.md`

---

## 4. 브릿지·API 검증

### 4.1 검증 스크립트

```powershell
cd F:\cama_pjt\cama-cafe24
node deploy/scripts/verify-step-bridge.mjs
node deploy/scripts/verify-webview-routes.mjs
python deploy/scripts/cafe24-app-api-e2e.py
```

### 4.2 API E2E 결과 (2026-06-17)

- **37 OK, 0 FAIL, 1 SKIP** (`POST /api/track/service/info` — journey 데이터 없음)
- 상세: [CAFE24_REACT_NATIVE_BRIDGE_ANALYSIS_2026-06-17.md](CAFE24_REACT_NATIVE_BRIDGE_ANALYSIS_2026-06-17.md)

### 4.3 서버 버그 수정·재배포

| 증상 | 원인 | 수정 |
|------|------|------|
| Vital API 404 | `VitalRestController`에 `@RequestMapping("api")` 누락 | 컨트롤러에 추가 |
| Vital API 500 | `VitalMapper.xml` 미등록 | `mybatis-config.xml`에 등록 |
| 재배포 | — | `python deploy/scripts/vps-deploy-server-src.py` |

---

## 5. Android APK 빌드·테스트

### 5.1 빌드 조건

- **JDK 17** (`JAVA_HOME` 설정 필수)
- **중복 drawable 제거:** `assembleRelease` 전 `android/app/src/main/res/drawable-*/node_modules_*` 삭제

### 5.2 산출물

| 파일 | 크기 | 비고 |
|------|------|------|
| `dist/cama-plus-cafe24-2026-06-17.apk` | ~20.3 MB | 최신 빌드 (APK 관리에 업로드됨) |
| `dist/cama-plus-cafe24-1.2.7-release.apk` | ~20.3 MB | 이전 빌드 |
| `cama-plus-app/android/app/build/outputs/apk/release/app-release.apk` | 원본 | Gradle 출력 |

### 5.3 에뮬레이터

- AVD: **CAMA_API33**
- 설치·실행 OK, RN `CamaApp` 기동
- `adb input text` 한글 IME 깨짐 → **수동 로그인** 필요

### 5.4 빌드 명령 (재빌드 시)

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
# drawable 중복 있으면 node_modules_* 삭제 후
.\gradlew.bat assembleRelease
Copy-Item "app\build\outputs\apk\release\app-release.apk" `
  "..\..\dist\cama-plus-cafe24-YYYY-MM-DD.apk" -Force
```

---

## 6. Super Admin — APK 관리 기능

### 6.1 관리자 화면

| 항목 | 값 |
|------|-----|
| 메뉴 | 컨텐츠 관리 → **APK 관리** (즐겨찾기 통계 아래) |
| URL | `/admin/main/contentMng/apkMng` |
| 기능 | 목록(버전·등록일·용량·다운로드 링크), multipart 업로드, 삭제 |

**프론트 파일**

- `cama-super-admin/src/layout/common/sidebar/menu.json` — 메뉴 id `14`
- `cama-super-admin/src/app/main/contentMng/apkMng/Page.tsx`
- `cama-super-admin/src/locales/ko/translation.json` — `apkManagement.*`
- `cama-super-admin/src/layout/common/sidebar/Menu.tsx` — 아이콘 `FcAndroidOs`

### 6.2 백엔드 API

Base: `https://camaplus.cafe24.com` · 인증: **doctor JWT** (`POST /api/auth/doctor`)

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/doctor/apk/list` | APK 목록 |
| POST | `/api/doctor/apk/upload` | multipart (`file`, `version`) |
| POST | `/api/doctor/apk/delete` | body: `{ "fileName": "..." }` |

**서버 코드**

- `ApkStorageService` — `/opt/cama/data/apk_down/`, `apk-index.json` 메타
- `DoctorApkRestController`
- `LocalApkResourceConfig` — `/apk_down/**` 정적 서빙
- `SecurityConfig` — `GET /apk_down/**` permitAll
- `CamaHostingProperties` — `apkStoragePath`, `apkPublicBaseUrl`
- `application-cafe24.yml` — `APK_STORAGE_PATH`, `APK_PUBLIC_BASE_URL`

### 6.3 인프라

| 항목 | 경로/값 |
|------|---------|
| VPS 저장소 | `/opt/cama/data/apk_down/` |
| Docker 볼륨 | `../data/apk_down:/opt/cama/data/apk_down` |
| 공개 URL prefix | `https://camaplus.cafe24.com/apk_down` |
| nginx | `location /apk_down/` → `127.0.0.1:8080` |
| multipart 한도 | Spring 50MB, nginx `client_max_body_size 55m` |

### 6.4 현재 등록 APK

| 항목 | 값 |
|------|-----|
| 파일명 | `cama-plus-cafe24-2026-06-17.apk` |
| 버전 | `1.2.7` |
| 다운로드 | https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-17.apk |

### 6.5 배포 스크립트

```powershell
cd F:\cama_pjt\cama-cafe24

# 서버 + Super Admin + APK 일괄 (권장)
python deploy/scripts/vps-deploy-apk-mgmt.py

# 개별
python deploy/scripts/vps-deploy-server-src.py
python deploy/scripts/vps-deploy-super-admin.py
python deploy/scripts/vps-upload-initial-apk.py
python deploy/scripts/vps-patch-nginx-apk.py
python deploy/scripts/vps-set-admin-login-cama.py
```

**운영 시 주의**

- `docker-compose` 1.29에서 `--force-recreate` 시 `ContainerConfig` 오류 가능 → `docker rm -f cama-plus-server` 후 `docker-compose up -d --no-deps cama-plus-server` 권장
- JAR에 APK 클래스 포함 확인: VPS Maven 빌드 후 `DoctorApkRestController` 존재 여부 확인
- nginx 패치는 **`sites-enabled/cama`** 와 **`sites-available/cama`** 모두 확인

---

## 7. Super Admin 로그인 계정 (`cama`)

Super Admin (`/admin/login`)은 **`POST /api/auth/doctor`** 사용 → **`cm_doctor`** 필수.

| 항목 | 값 |
|------|-----|
| 로그인 URL | https://camaplus.cafe24.com/admin/login |
| ID | `cama` |
| 비밀번호 | `cama!` |
| DB | `cm_doctor` (seq 5, hospital_seq 1) + `cm_admin` (생성됨) |

**재설정 스크립트**

```powershell
python deploy/scripts/vps-set-admin-login-cama.py
```

환경 변수로 변경 가능: `CAMA_ADMIN_LOGIN`, `CAMA_ADMIN_PASSWORD`

> 기존 `happycog` 계정은 별도 유지. 운영 기본 관리자는 **`cama`** 로 통일.

---

## 8. 미완 · 다음 작업

| 항목 | 상태 |
|------|------|
| APK 실접속 E2E (로그인·WebView·이미지·서비스 승인) | ⏳ 수동 로그인 후 진행 |
| `/api/enums` 등 permitAll 401 | ⚠️ 별도 조사 |
| FCM 실발송 | ⏸ `CAMA_BATCH_FCM_DRY_RUN=true` |
| Brevo SMTP 실발송 | ⏳ DNS·`.env` |
| AWS 리소스 만료 | ⏳ [DECOMMISSION](CAFE24_AWS_DECOMMISSION.md) |
| APK 관리 E2E 자동화 | ⏳ `cafe24-app-api-e2e.py`에 APK API 추가 가능 |

---

## 9. Cursor 재시작 체크리스트 (추가분)

```text
[ ] Super Admin: https://camaplus.cafe24.com/admin/login (cama / 팀 비밀관리)
[ ] APK 관리: /admin/main/contentMng/apkMng 목록·업로드·삭제
[ ] APK 다운로드: https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-17.apk → 200
[ ] 브릿지: node deploy/scripts/verify-step-bridge.mjs
[ ] API E2E: python deploy/scripts/cafe24-app-api-e2e.py
```

---

## 10. 변경 파일 목록 (참고)

### 백엔드 (`cama-plus-server`)

- `config/CamaHostingProperties.java`
- `config/LocalApkResourceConfig.java`
- `config/SecurityConfig.java`
- `controller/doctor/DoctorApkRestController.java`
- `dto/doctor/ApkReleaseDto.java`, `ApkDeleteRequest.java`
- `service/storage/ApkStorageService.java`
- `resources/application-cafe24.yml`

### Super Admin (`cama-super-admin`)

- `src/layout/common/sidebar/menu.json`
- `src/layout/common/sidebar/Menu.tsx`
- `src/app/main/contentMng/apkMng/Page.tsx`
- `src/locales/ko/translation.json`, `en/translation.json`

### 배포

- `deploy/docker-compose.cafe24.yml`
- `deploy/env.cafe24.example`
- `deploy/nginx/cama-single-host.conf.example`
- `deploy/scripts/vps-deploy-apk-mgmt.py`
- `deploy/scripts/vps-upload-initial-apk.py`
- `deploy/scripts/vps-patch-nginx-apk.py`
- `deploy/scripts/vps-set-admin-login-cama.py`
