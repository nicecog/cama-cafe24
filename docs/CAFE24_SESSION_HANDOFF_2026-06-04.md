# Cafe24 세션 작업 기록 — WebView 성능·탭바·RN 홈 복귀·헤더 (2026-06-04)

> **최종 갱신:** 2026-06-04  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** 내일(다음 세션) Cursor·개발자가 **이어서 작업**할 때 한 문서로 맥락·완료·미완료·배포·테스트를 파악.

**관련 문서 (읽는 순서)**

1. **본 문서** — WebView 성능, 탭바/헤더, RN↔SPA 홈 복귀 (2026-06-04)
2. [WEBVIEW_PERFORMANCE_FUTURE.md](WEBVIEW_PERFORMANCE_FUTURE.md) — 성능 **추후 검토** 항목만 (미구현)
3. [CAFE24_SESSION_HANDOFF_2026-06-03.md](CAFE24_SESSION_HANDOFF_2026-06-03.md) — ID 복구·WebView nginx·APK 1.2.7
4. [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) — 전체 이관 진행·Brevo 등
5. [REACT_APP_WEBVIEW_SCREENS.md](REACT_APP_WEBVIEW_SCREENS.md) — WebView 화면·URL 매핑

**대화 기록 (Cursor):** `agent-transcripts/b7713878-c619-4b2e-80f1-eb3bc4424371`

---

## 1. 재시작 시 5분 체크리스트

```text
[ ] 1. 워크스페이스: F:\cama_pjt\cama-cafe24
[ ] 2. VPS: ssh camaplus-vps "docker ps --format '{{.Names}} {{.Status}}'"
[ ] 3. Health: curl.exe -sk https://camaplus.cafe24.com/actuator/health
[ ] 4. SPA 스모크:
       curl.exe -sk -o NUL -w "coaching_hub:%{http_code}\n" "https://camaplus.cafe24.com/coaching/?wvLoginId=happycog"
       curl.exe -sk -o NUL -w "wellbeing:%{http_code}\n" "https://camaplus.cafe24.com/wellbeing?wvLoginId=happycog"
[ ] 5. 앱 stage: cama-plus-app/src/config/stage.ts → currentStage = 'PROD'
[ ] 6. RN 변경 후: JS 번들 + assembleDebug (아래 §6)
[ ] 7. SPA 변경 후: build-react-app-cafe24.mjs + vps-deploy-react-app.py
```

---

## 2. 한 줄 요약 (이번 세션)

| 주제 | 상태 |
|------|------|
| WebView **체감 속도** 1차 (reload 제거, 직접 URL, bootstrap 캐시) | ✅ 코드·SPA 배포 |
| WebView **로그인 화면** (Hello CAMA) 우회 | ✅ `wvLoginId` + session 유지 |
| **웰빙** SPA Dockbar + RN 탭 **이중 표시** | ✅ RN WebView에서 Dockbar/Header 숨김 |
| 수면 테스트 후 **홈으로** → 암정보 가이드 + 탭 없음 | ✅ `goNativeHome` 브리지 |
| **건강코칭 탭** 하단 바·홈 버튼 없음 | ✅ 탭바 복구 + 허브 헤더 |
| **웰빙** 상단 글자크기 ± (건강코칭과 동일) | ✅ 공통 헤더 |
| **웰빙** 상단 홈 버튼 | ✅ **숨김** (`showHomeButton={false}`) |
| 성능 **추가 개선** (프리로드, nginx 캐시 등) | ⏳ [WEBVIEW_PERFORMANCE_FUTURE.md](WEBVIEW_PERFORMANCE_FUTURE.md) |

---

## 3. 아키텍처 (참고)

```text
[RN cama-plus-app]  하단 탭 + WebView
        │
        ▼
https://camaplus.cafe24.com  (react-app-dawplus dist on VPS)
        │
        ├─ /coaching/          → _auth/_layout/coaching  (건강코칭 허브)
        ├─ /coaching/sleep …   → _auth/_coaching        (CoachingLayoutHeader)
        ├─ /wellbeing          → _auth/_layout/wellbeing
        └─ /api/*              → cama-plus-server :8080
```

**RN WebView URL 중앙 설정:** `cama-plus-app/src/config/webviewUrls.ts`  
**RN ↔ SPA 브리지:** `cama-plus-app/src/utils/webviewBridge.ts` · `react-app-dawplus/src/lib/webview/rnBridge.ts`

---

## 4. 완료 작업 상세

### 4.1 WebView 성능 1차

| 조치 | 파일 |
|------|------|
| 탭 포커스 시 `webviewRef.reload()` **제거** | `HealthCoaching/MainScreen`, `CategoryScreen`, `Wellbeing/MainScreen`, `HelpInfo` |
| 코칭 URL **SPA 직접** (`/coaching/`, `/coaching/sleep` + `wvLoginId`) | `webviewUrls.ts` |
| `/coaching` 404 → **`/coaching/`** (trailing slash) | `webviewUrls.ts` |
| `bootstrapWebviewSession` 동일 loginId **API 생략** | `bootstrapSession.ts` |
| WebView `cacheEnabled`, `domStorageEnabled` 등 공통화 | `usePatientWebViewSource.ts` |

### 4.2 WebView 로그인 (Hello, CAMA) 우회

- RN: `getCamaWebViewInjectedJavaScript*` 로 `cama.auth.session` 주입
- SPA: `wvLoginId` search + webview session 유지 (`auth.tsx`, `_auth.tsx` 등)
- 이전 대화·[CAFE24_SESSION_HANDOFF_2026-06-03.md](CAFE24_SESSION_HANDOFF_2026-06-03.md) 참고

### 4.3 웰빙 이중 하단 바 수정

| 증상 | RN 탭 + SPA `<Dockbar />` 동시 표시 |
|------|--------------------------------------|
| 해결 | `react-app-dawplus/src/routes/_auth/_layout.tsx` — `isReactNativeWebView()` 일 때 `<Header />`, `<Dockbar />` 미렌더 |

### 4.4 RN 앱 메인 홈 복귀 (`goNativeHome`)

| 증상 | 수면 코칭 WebView에서 「홈으로」→ SPA `/home`(암정보 가이드 설정), RN 탭 없음 |
|------|-------------------------------------------------------------------------------|
| 해결 | SPA `CoachingHeader` 홈 클릭 시 RN이면 `requestNativeHome()` postMessage |
| RN | `webviewBridge` `goNativeHome` → `navigateToNativeHomeTab()` |

**파일**

- `react-app-dawplus/src/lib/webview/rnBridge.ts` — `requestNativeHome()`
- `react-app-dawplus/src/components/coaching/layout/CoachingHeader.tsx`
- `cama-plus-app/src/utils/nativeHomeNavigation.ts`
- `cama-plus-app/src/utils/webviewBridge.ts`
- `HealthCoaching/CategoryScreen`, `MainScreen`, `Wellbeing/MainScreen`

### 4.5 건강코칭 탭 — 하단 탭바 + 상단 툴바

| 증상 | 웰빙 Dockbar 숨기면서 RN `HealthCoachingMainScreen`에 `tabBarStyle: display none` → 탭·홈 버튼 없음 |
|------|--------------------------------------------------------------------------------------------------|
| 해결 | `MainBottomTabNavigation.tsx` 건강코칭도 `styles.tabBarStyle` 사용 |
| 해결 | 코칭 허브(`/coaching/`)에 RN용 상단 툴바 (홈 + 글자크기) |

### 4.6 공통 상단 툴바 + 웰빙

**컴포넌트:** `react-app-dawplus/src/components/webview/PatientWebViewToolbarHeader.tsx`

| 화면 | hubMode | 홈 버튼 | 글자 크기 ± |
|------|---------|---------|-------------|
| 건강코칭 허브 `/coaching/` | ✅ | ✅ | ✅ |
| 건강코칭 상세 `/_auth/_coaching` | `CoachingLayoutHeader` | ✅ | ✅ |
| 웰빙 `/wellbeing` | ✅ | ❌ `showHomeButton={false}` | ✅ |

**웰빙만 홈 숨김 이유:** 하단 RN 탭으로 홈 이동 가능, 탭 전용 화면이라 상단 홈 불필요 (사용자 요청 2026-06-04).

---

## 5. 주요 변경 파일 목록

### react-app-dawplus (SPA)

| 경로 | 용도 |
|------|------|
| `src/components/webview/PatientWebViewToolbarHeader.tsx` | **신규** RN WebView 공통 헤더 |
| `src/components/coaching/layout/CoachingHeader.tsx` | 코칭 상세용 래퍼 |
| `src/routes/_auth/_layout.tsx` | RN에서 Header/Dockbar 숨김 |
| `src/routes/_auth/_layout/coaching/index.tsx` | 코칭 허브 + RN 툴바 |
| `src/routes/_auth/_layout/wellbeing/index.tsx` | 웰빙 + RN 툴바 (홈 없음) |
| `src/lib/webview/bootstrapSession.ts` | 세션 캐시 |
| `src/lib/webview/rnBridge.ts` | `requestNativeHome` 등 |

### cama-plus-app (RN)

| 경로 | 용도 |
|------|------|
| `src/config/webviewUrls.ts` | 직접 URL, `/coaching/` |
| `src/hooks/usePatientWebViewSource.ts` | **신규** WebView 성능 props |
| `src/utils/webviewBridge.ts` | `goNativeHome` |
| `src/utils/nativeHomeNavigation.ts` | **신규** 홈 탭 이동 |
| `src/navigations/MainBottomTabNavigation.tsx` | 건강코칭 탭바 표시 |
| `src/screens/HealthCoaching/*` | reload 제거, goNativeHome |
| `src/screens/Wellbeing/MainScreen/index.tsx` | goNativeHome |

### docs

| 경로 | 용도 |
|------|------|
| `docs/WEBVIEW_PERFORMANCE_FUTURE.md` | 성능 추후 검토 (미구현) |
| `docs/CAFE24_SESSION_HANDOFF_2026-06-04.md` | **본 문서** |

---

## 6. 배포 · 빌드 명령 (다음 세션에서 재사용)

### SPA → VPS

```powershell
cd F:\cama_pjt\cama-cafe24
node deploy/scripts/build-react-app-cafe24.mjs
python deploy/scripts/vps-deploy-react-app.py
```

- 정적 경로: `/opt/cama/www/react-app/`
- 스모크: `https://camaplus.cafe24.com/coaching/?wvLoginId=happycog` → 200

### RN Android (JDK 17)

```powershell
cd F:\cama_pjt\cama-cafe24\cama-plus-app
npx react-native bundle --platform android --dev true --entry-file index.js `
  --bundle-output android/app/src/main/assets/index.android.bundle `
  --assets-dest android/app/src/main/res/

cd android
powershell -NoProfile -File .\build-with-jdk17.ps1 :app:assembleDebug

adb install -r app\build\outputs\apk\debug\app-debug.apk
```

- JDK: `C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot`
- **SPA만 수정**한 경우(웰빙 홈 버튼 숨김 등): APK 재빌드 없이 WebView 새로고침/앱 재실행으로 반영 가능

### react-app 타입체크

```powershell
cd F:\cama_pjt\cama-cafe24\react-app-dawplus
npm run type-check
```

---

## 7. QA 체크리스트 (다음 세션 권장)

### 건강코칭

- [ ] 하단 **건강코칭** 탭: 상단 **홈** + **글자크기 ±** + **RN 하단 탭** 표시
- [ ] 메인 → **수면** 진입 (스택, 탭 없음) → 상단 **홈** → **RN 메인 홈** + 탭 복구
- [ ] 건강코칭 탭 이탈 후 재진입: **전체 reload 없이** 빠른지 (1차 성능)

### 웰빙

- [ ] 하단 **웰빙자원** 탭: **글자크기 ±** 있음, **홈 버튼 없음**
- [ ] SPA Dockbar **없음**, RN 탭 **1개만**

### 회귀

- [ ] 로그인 후 WebView **Hello CAMA** 안 뜨는지
- [ ] ID/PW 찾기 (공개 API) — `happycog` / `01032984763` / 최완규

---

## 8. 미완료 · 다음에 할 일

| 항목 | 참고 |
|------|------|
| WebView 성능 2차 | [WEBVIEW_PERFORMANCE_FUTURE.md](WEBVIEW_PERFORMANCE_FUTURE.md) |
| 도움말 URL `/help` 직접화 | 아직 `/webview/help` |
| iOS 걸음수 bridge | Android만 `CamaStepCounterModule` |
| APK release 버전 bump·`dist/` 반영 | 마지막 작업은 **debug** 에뮬레이터 설치 위주 |
| Brevo SMTP | DNS 등록 완료 → [CAFE24_BREVO_RESUME_2026-06-04.md](CAFE24_BREVO_RESUME_2026-06-04.md) §3~4 |
| permitAll 401 (`/api/enums` 등) | 별도 이슈 |

---

## 9. 테스트 계정 (참고)

| 항목 | 값 |
|------|-----|
| 이름 | 최완규 |
| 전화 | 01032984763 |
| loginId | **happycog** (구 `C23IFZ39UWLD4`) |

---

## 10. 이슈 ↔ 해결 매핑 (트러블슈팅)

| 사용자 증상 | 원인 | 해결 |
|-----------|------|------|
| 건강코칭 느림 | 포커스 `reload`, redirect chain | §4.1 |
| WebView 로그인 화면 | SPA session 삭제 | wvLoginId + inject (이전 세션) |
| 웰빙 탭 2개 | Dockbar + RN tab | `_layout.tsx` RN 분기 |
| 홈으로 가니 암정보 가이드 | SPA `/` in WebView | `goNativeHome` |
| 건강코칭 탭 탭/홈 없음 | `tabBarStyle: none` + 허브에 헤더 없음 | §4.5 |
| 웰빙에도 홈 필요? | — | 글자크기만; 홈은 **숨김** §4.6 |

---

*문서 끝 — 다음 세션 시작 시 §1 체크리스트부터 진행.*
