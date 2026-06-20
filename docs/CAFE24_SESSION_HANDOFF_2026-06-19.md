# Cafe24 세션 핸드오프 — WebView·APK·Admin·FCM (2026-06-19)

> **작성일:** 2026-06-19  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** RN WebView 브릿지 검증, Android APK 배포, Admin Whitelabel 수정, 알림메시지 FCM 실패 원인·복구까지의 내역 정리.

**선행·연관 문서**

- [CAFE24_SESSION_HANDOFF_2026-06-17-APK-ADMIN.md](CAFE24_SESSION_HANDOFF_2026-06-17-APK-ADMIN.md) — APK 관리·브릿지
- [CAFE24_DEPLOYMENT_GUIDE.md](CAFE24_DEPLOYMENT_GUIDE.md) — Firebase는 `camaplus-1de96` (앱과 동일)
- [CAFE24_CURSOR_HANDOFF.md](CAFE24_CURSOR_HANDOFF.md)

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| `cama-plus-app` ↔ `react-app-dawplus` WebView 브릿지 | ✅ 프로토콜 일치 (goNativeHome, getStepCount, wvLoginId) |
| Android APK v1.2.8 빌드·Admin 업로드 | ✅ |
| `https://camaplus.cafe24.com/admin` Whitelabel 404 | ✅ nginx `/admin/` → super-admin 수정 |
| 알림메시지관리 FCM → 최완규 전송 | ✅ **사용자 전송 성공 확인** |
| VPS Firebase Admin 키 | ✅ `camaplus-1de96` 로 교체 |
| 배치 스케줄 (FCM 테스트 모드) | ✅ `restore-fcm-test` 로 복원 |

---

## 2. URL · 서비스 매핑

| URL | 대상 | 비고 |
|-----|------|------|
| `https://camaplus.cafe24.com/admin/` | `cama-super-admin` (:8083) | 로그인 `cama` / `cama!` |
| `https://camaplus.cafe24.com/coaching/` 등 | `react-app-dawplus` (정적 SPA) | WebView `?wvLoginId=` |
| `https://camaplus.cafe24.com/api/*` | `cama-plus-server` (:8080) | |
| `https://camaplus.cafe24.com/apk_down/*` | APK 저장소 | Admin APK 관리 |
| `/admin/main/contentMng/apkMng` | APK 관리 메뉴 | |
| `/admin/main/monitoring/notificationMsg` | 알림메시지관리 | FCM 실전송 |

---

## 3. RN WebView 브릿지 (cama-plus-app → react-app-dawplus)

### 3.1 정상 연결된 메시지

| 방향 | 프로토콜 | RN | SPA |
|------|----------|----|-----|
| SPA → RN | `navigationStateChange` | `createWebViewMessageHandler` | history hook + `notifyWebViewNavigation()` |
| SPA → RN | `{ type: "goNativeHome" }` | `navigateToNativeHomeTab()` | `requestNativeHome()` |
| SPA → RN | `{ type: "getStepCount", requestId }` | `handleGetStepCount` → `cama-native` 이벤트 | `requestNativeStepCount()` |
| RN → SPA | `sessionStorage['cama.auth.session']` | `getWebviewSessionBootstrapScript` | `authSessionAtom` + `bootstrapWebviewSession` |
| RN → SPA | `__CAMA_NATIVE_BRIDGE__ = true` | injected JS | `isReactNativeWebView()` |

### 3.2 WebView URL (PROD)

- 베이스: `https://camaplus.cafe24.com` (`cama-plus-app/src/config/stage.ts`, `webviewUrls.ts`)
- 코칭 허브: `/coaching/?wvLoginId={loginId}`
- 웰빙: `/wellbeing?wvLoginId={loginId}`
- 도움말: `/webview/help`
- 치료 상세: `/webview/treatment/{seq}` → SPA `/content/detail/{id}` 리다이렉트

### 3.3 레거시 (SPA 미사용)

- RN만 처리: `TS` / `TP` (TTS), `BS` (바텀시트 헤더)
- SPA는 Web Speech API(`useTTS`) 사용 — Android WebView TTS 품질은 실기기 확인 권장

### 3.4 핵심 파일

| 구분 | 경로 |
|------|------|
| RN URL·브릿지 | `cama-plus-app/src/config/webviewUrls.ts`, `utils/webviewBridge.ts` |
| RN WebView 훅 | `cama-plus-app/src/hooks/usePatientWebViewSource.ts` |
| SPA 브릿지 | `react-app-dawplus/src/lib/webview/rnBridge.ts` |
| SPA 세션 | `react-app-dawplus/src/lib/webview/bootstrapSession.ts`, `routes/_auth.tsx` |

---

## 4. Android APK 배포

### 4.1 빌드 산출물

| 항목 | 값 |
|------|-----|
| 버전 | **1.2.8** (`versionCode` 27) |
| 로컬 APK | `cama-cafe24/dist/cama-plus-cafe24-2026-06-03.apk` (~20.3 MB) |
| Gradle 출력 | `cama-plus-app/android/app/build/outputs/apk/release/app-release.apk` |
| 서명 | debug keystore (Cafe24 테스트 배포용) |

### 4.2 Admin APK 관리

- 메뉴: 컨텐츠 관리 → **APK 관리** (`menu.json` id 14)
- API: `POST /api/doctor/apk/list`, `/upload`, `/delete`
- VPS 저장: `/opt/cama/data/apk_down/` + `apk-index.json`
- 다운로드: `https://camaplus.cafe24.com/apk_down/cama-plus-cafe24-2026-06-03.apk`

### 4.3 빌드·업로드 명령

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd F:\cama_pjt\cama-cafe24\cama-plus-app\android
.\gradlew.bat assembleRelease

Copy-Item "app\build\outputs\apk\release\app-release.apk" `
  "F:\cama_pjt\cama-cafe24\dist\cama-plus-cafe24-YYYY-MM-DD.apk" -Force

python F:\cama_pjt\cama-cafe24\deploy\scripts\vps-upload-apk-release.py
```

---

## 5. Admin `/admin` Whitelabel Error 수정

### 5.1 증상

- 핸드폰 브라우저에서 `https://camaplus.cafe24.com/admin` 접속 시 **Whitelabel Error Page**
- `Accept: text/html` → Spring Boot 404 HTML (doctor-web `:8081` 로 fallback)

### 5.2 원인

- nginx에 `location /admin/` 블록 **누락**
- `cama-super-admin` 컨테이너(:8083)는 정상이었으나 공개 URL이 Spring으로 전달됨

### 5.3 조치

```powershell
python deploy/scripts/vps-deploy-super-admin.py
```

- `deploy/nginx/cama-super-admin-locations.conf` 적용
- `/admin/` → `http://127.0.0.1:8083/` 프록시
- 확인: `/admin/` HTTP 200 (SPA HTML)

---

## 6. 알림메시지관리 FCM 실패 → 복구

### 6.1 증상

- Admin **알림메시지관리**에서 최완규에게 `test` 전송 → **실패 1건**
- 환자 FCM 토큰은 존재 (`skipped=0`, token prefix `eFVaKX2r...`)

### 6.2 서버 로그 (실패 시)

```
FCM send failed type=ADMIN_001
Error getting access token for service account: 400 Bad Request
{"error":"invalid_grant","error_description":"Invalid JWT Signature."}
iss: firebase-adminsdk-cl1lc@cama-plus.iam.gserviceaccount.com

Admin FCM send sent=0 failed=1 skipped=0
```

### 6.3 근본 원인

| 항목 | VPS (잘못됨) | 올바른 값 |
|------|--------------|-----------|
| Firebase project_id | `cama-plus` | **`camaplus-1de96`** |
| 서비스 계정 | `firebase-adminsdk-cl1lc@...` | `firebase-adminsdk-a2gx1@camaplus-1de96...` |
| 앱 `google-services.json` | ❌ 불일치 | `project_id: camaplus-1de96` |

→ 키 무효(`Invalid JWT Signature`) + 앱 FCM 토큰 프로젝트와 서버 프로젝트 불일치.

### 6.4 조치

1. 로컬 유효 키 확인:
   `cama-back-batch/src/main/resources/firebase/camaplus-1de96-firebase-adminsdk-a2gx1-dcc730fa92.json`
2. VPS `/opt/cama/secrets/firebase-adminsdk.json` 교체
3. `docker restart cama-plus-server cama-back-batch`
4. API 검증 (account seq **121**, 최완규 / `happycog`):

```json
{
  "sentCount": 1,
  "failedCount": 0,
  "items": [{ "name": "최완규", "success": true, "detail": "전송 완료" }]
}
```

5. **사용자 Admin UI에서 전송 성공 확인 완료**
6. 배치 복원: `POST /api/monitoring/notification/restore-fcm-test` → `active: false`

### 6.5 알림메시지 API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/monitoring/notification/fcm-test-status` | 테스트 모드 상태 |
| POST | `/api/monitoring/notification/prepare-fcm-test` | 배치 백업·비활성화 |
| POST | `/api/monitoring/notification/restore-fcm-test` | 배치 복원 |
| POST | `/api/monitoring/notification/send` | 선택 환자 FCM 실전송 |

- 전송 시 자동 `prepareTestMode()` — 테스트 후 **반드시 restore** 권장
- 코드: `FcmTestModeServiceImpl`, `FcmMessageSender`, `MonitoringRestController`
- Admin UI: `cama-super-admin/src/app/main/monitoring/notificationMsg/Page.tsx`

### 6.6 QA 계정 (최완규)

| 항목 | 값 |
|------|-----|
| 이름 | 최완규 |
| loginId | `happycog` |
| account seq | **121** |
| 전화 | `01032984763` |

---

## 7. 이번 세션 추가·사용 스크립트

| 스크립트 | 용도 |
|----------|------|
| `deploy/scripts/vps-upload-apk-release.py` | APK → doctor API 업로드 |
| `deploy/scripts/vps-check-fcm-admin-send.py` | FCM 로그·토큰·Firebase 마운트 점검 |
| `deploy/scripts/vps-deploy-firebase-key.py` | `camaplus-1de96` 키 VPS 배포 + 서버·배치 재시작 |
| `deploy/scripts/vps-deploy-super-admin.py` | Super Admin 빌드·배포·nginx `/admin/` |
| `deploy/scripts/vps-super-admin-nginx-debug.py` | admin 라우팅·8083 상태 확인 |

---

## 8. VPS 접속·비밀 (참고)

- 접속 정보: `deploy/CAFE24_VPS_ACCESS.local.md`
- 호스트: `210.114.18.156` · Admin: `https://camaplus.cafe24.com/admin/login`
- Admin 계정: `cama` / `cama!` (doctor JWT)

---

## 9. 내일 이후 작업 후보 (선택)

1. **FCM E2E 재확인** — 최완규 실기기 푸시 수신·앱 포그라운드/백그라운드 동작
2. **배치 FCM** — `CAMA_BATCH_FCM_DRY_RUN=false` 유지·스케줄 정상 cron 확인
3. **Firebase 키 운영** — VPS 키는 `camaplus-1de96`만 사용; `cama-plus` 키는 사용 금지
4. **APK** — Play 배포용 release keystore 전환 검토 (현재 debug 서명)
5. **react-app-dawplus** — `npm run build` 시 `routeTree.gen.ts` 이슈 (`npx vite build` 우회 중)
6. **로컬 monorepo** — `origin/main` 대비 일부만 sync된 상태일 수 있음 → 필요 시 `git pull` 정리
7. **TTS** — WebView Web Speech vs RN `TS`/`TP` 브릿지 실기기 품질 확인

---

## 10. 빠른 상태 확인 명령

```powershell
cd F:\cama_pjt\cama-cafe24

# Admin /admin 라우팅
python deploy/scripts/vps-super-admin-nginx-debug.py

# FCM 로그
python deploy/scripts/vps-check-fcm-admin-send.py

# Firebase 키 재배포 (필요 시)
python deploy/scripts/vps-deploy-firebase-key.py

# WebView URL 감사
python deploy/scripts/vps-webview-url-audit.py
```

---

*문서 끝 — 2026-06-19 세션 기준*
