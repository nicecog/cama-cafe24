# DawPlus/React-App 분석 (로컬: `react-app-dawplus`)

> **다운로드:** 2026-06-04 · `git clone https://github.com/DawPlus/React-App.git` → `cama-cafe24/react-app-dawplus/`  
> **원칙:** 기존 `cama-plus-app`, `cama-plus-server` 등 **Git/소스 수정 없음** (별도 클론만 추가)  
> **SMTP:** VPS `.env.cafe24` 반영 완료 — [CAFE24_BREVO_RESUME_2026-06-04.md](CAFE24_BREVO_RESUME_2026-06-04.md)  
> **React 19 · API · 로그인:** [REACT_APP_MIGRATION_LOGIN_API.md](REACT_APP_MIGRATION_LOGIN_API.md)

---

## 1. 한 줄 요약

**CAMA Plus 환자용 WebView UI를 React Native 대신 Vite SPA로 재구성하는 프로젝트**입니다.  
백엔드는 기존 Spring API의 **`/api/webview/*`** 엔드포인트를 그대로 호출하며, RN 앱(`cama-plus-app`)은 WebView로 이 SPA(또는 동일 URL)를 띄우는 구조를 전제로 합니다.

| 구분 | 기존 (`cama-plus-app`) | 신규 (`react-app-dawplus`) |
|------|------------------------|----------------------------|
| 런타임 | React Native | React 18 + Vite 6 |
| 화면 | `react-native-webview` → `adminUrl/webview/...` | TanStack Router 파일 라우팅 |
| API | RN 네이티브 `GET /api/...` | SPA `POST/GET /api/webview/...` (ky) |
| 배포 | APK | Vercel SPA (`vercel.json` rewrites) + nginx 연동 예상 |

---

## 2. 저장 위치 · Git

| 항목 | 값 |
|------|-----|
| 로컬 경로 | `F:\cama_pjt\cama-cafe24\react-app-dawplus\` |
| 원격 | `https://github.com/DawPlus/React-App` |
| 최신 커밋 (clone 시) | `f07ce81` — `fix : 건강코칭 수정` |
| 브랜치 | `main` (기본), `camaplus-webview`, `cnt`, `tanstack-table` |
| 작성자 (README) | 채지웅 · 2025-02-03 기준 템플릿 |

`react-app-dawplus`는 **자체 `.git`** 을 가진 독립 저장소입니다. `cama-cafe24` 루트는 Git 저장소가 아니므로, 상위 monorepo와 충돌하지 않습니다.

---

## 3. 기술 스택

| 영역 | 선택 |
|------|------|
| 빌드 | Vite 6, `@vitejs/plugin-react-swc` |
| 라우팅 | TanStack Router v1 (파일 기반, `routeTree.gen.ts` 자동 생성) |
| 서버 상태 | TanStack Query v5 + `jotai-tanstack-query` |
| 클라이언트 상태 | Jotai |
| HTTP | `ky` (+ `apis/client` 인터셉터) |
| UI | Radix UI, Tailwind 3, shadcn 스타일 컴포넌트 |
| 차트 | ECharts, Recharts |
| i18n | i18next |
| 린트 | Biome (ESLint/Prettier 대신) |
| 기타 | GSAP/Motion, Lottie, Three.js/OGL, xlsx, DOMPurify, SecureLS |

Node 권장: README **20.18.2** · React **18.3.1** (React 19는 Vite 호환 이슈로 18 고정)

---

## 4. 디렉터리 구조 (핵심만)

```text
react-app-dawplus/
├── src/
│   ├── routes/          # 화면 (TanStack file routes) — 규모 최대
│   ├── apis/            # API 클라이언트 + 타입
│   │   ├── client/      # ky + interceptors (api_key Bearer)
│   │   └── api/
│   │       ├── auth.ts, hospital.ts, common.ts, wellbeing.ts
│   │       └── webview/ # account, contents, coaching, schedule, track, notification
│   ├── hooks/
│   │   ├── queries/     # useXxxQueries (webview/* 분리)
│   │   └── mutations/   # useXxxMutations
│   ├── atoms/           # accountMeAtom 등 (Jotai + Query)
│   ├── components/      # layout, ui, coaching 공통
│   ├── data/apiData.json  # RN vs WebView API 대조표 (개발용 대시보드)
│   ├── i18n/
│   └── tobe/            # 수면 코칭 콘텐츠 md/csv (기획/이관용)
├── .env.example
├── vite.config.ts       # dev 프록시 /api → VITE_API_SERVER
└── vercel.json          # SPA fallback
```

**파일 수:** 약 638개 (clone 기준). 라우트 TSX만 수백 개 — **건강코칭 day/step 라우트가 대부분**.

---

## 5. 라우팅 아키텍처

### 5.1 레이아웃 계층

| 경로 패턴 | 파일 | URL에 노출 | 역할 |
|-----------|------|------------|------|
| `__root.tsx` | 루트 | `/` | Toaster, 전역 에러 |
| `_auth.tsx` | 인증 레이아웃 | (없음) | `Outlet` — **beforeLoad 가드 주석 처리됨** |
| `_auth/_layout.tsx` | 메인 앱 셸 | (없음) | Header + Dockbar + 스크롤 컨테이너 |
| `_auth/_coaching.tsx` | 코칭 전용 셸 | (없음) | 코칭 플로우 레이아웃 |

### 5.2 주요 사용자 URL (실경로)

| URL | 기능 |
|-----|------|
| `/login` | 로그인 UI |
| `/home` | 홈 (암정보 설정 전/후 분기) |
| `/schedule` | 일정 |
| `/favorite` | 즐겨찾기·치료정보 |
| `/wellbeing` | 웰빙 |
| `/coaching` | 건강코칭 목록 |
| `/coaching/coaching/{type}/{day}` | 코칭 타입·일차 허브 (`sleep`/`meal`/`physical`/`mind`) |
| `/coaching/coaching/meal/day{N}/step{M}` | 식사 코칭 단계 (day0~16, step1~3) |
| `/coaching/coaching/sleep/day{N}/...` | 수면 코칭 (동일 패턴) |
| `/coaching/coaching/physical/day{N}/...` | 운동 코칭 |
| `/report` | 리포트 (7섹션) |
| `/reporting` | 인지 리포트 데모/차트 |
| `/content/detail/$id` | 콘텐츠 상세 |
| `/dashboard-api` | **API 대조 대시보드** (`apiData.json` 시각화) |

### 5.3 코칭 라우트 규모

- **식사(meal):** day0~day16 × (index + step1~3) — 공유 템플릿 `_shared/standardMealDay`, `selectableMealDay`, `finalMealDay`
- **수면(sleep):** day0~day16 (일부 day는 step만)
- **운동(physical):** day0~day16
- Vite 플러그인 `routeFileIgnorePattern`으로 `stepN`, `_shared` 등은 라우트 트리에서 제외하고 **동적 조합**으로 처리

최근 커밋 흐름: 수면 코칭 완료 → 건강코칭 진행/수정 (`f07ce81`).

---

## 6. API · 인증

### 6.1 WebView API (서버와 정합)

SPA는 RN REST가 아니라 **`/api/webview/...`** 를 사용합니다. 구현은 `cama-plus-server` 컨트롤러와 1:1 대응 (`AccountRestController`, `TrackRestController`, `ScheduleRestController` 등).

예시 (`apis/api/webview/account.ts`):

- `POST api/webview/account/me` — `{ loginId }`
- `POST api/webview/account/hospital` — `{ seq }`
- `POST api/webview/account/withdrawal`

`src/data/apiData.json`에 **rnApi vs webviewApi** 매핑·상태(사용/미사용)·예시 URL이 정리되어 있으며, `/dashboard-api`에서 검색·필터 UI로 확인합니다. (예시 URL은 아직 `api.camaplus.me` 기준 — Cafe24 전환 시 env/문서만 갱신 필요)

### 6.2 HTTP 클라이언트

- **`apis/client`:** `ky` + `setupInterceptors`
  - 헤더: `api_key: Bearer {token}` (기존 Axios/RN 방식 유지)
  - 응답: `{ success, response, error }` Axios 호환 파싱
  - 401 → 토큰 삭제 후 `/login` 이동
- **`lib/ApiClient.tsx`:** 별도 ky 인스턴스 (로딩 카운터용 Jotai) — 일부 레거시

### 6.3 인증 — **이중 구조 (중요)**

| 레이어 | 구현 | 실제 사용 |
|--------|------|-----------|
| **A. `auth.tsx`** | `localStorage` + `VITE_APP_KEY`, `login(username)` 목업 | **`/login` 페이지가 A만 사용** (비밀번호 필드는 UI만, API 미호출) |
| **B. `useAuthMutations` + SecureLS** | `login()` API → `setTokenEncryptedStorage` | 훅·인터셉터는 B 준비됨, 로그인 화면과 **미연결** |
| **C. 개발 토큰** | `VITE_DEV_TEST_TOKEN` | DEV에서 인터셉터가 우선 사용 |

`_auth.tsx`의 `beforeLoad` 인증 가드도 **전부 주석** → 현재는 URL만 알면 화면 진입 가능.

### 6.4 계정 식별 (WebView 패턴)

`atoms/accountAtoms.ts`의 `accountMeAtom`은 **`import.meta.env.VITE_ACCOUNT_ID`** (loginId)로 `getAccountMe` 호출합니다.

→ RN WebView가 URL에 `loginId`를 넘기던 방식을, 개발/스테이징에서는 **env 고정 loginId**로 대체한 상태입니다. 프로덕션 연동 시 URL search param 또는 postMessage로 치환 필요.

---

## 7. 상태 관리 패턴

- **전역 계정:** `accountMeAtom`, `accountHospitalAtom` (Jotai Query)
- **코칭 저장:** `useSaveCoachingAndNavigate`, `useCoachingMutations`, `formatCoachingAnswer`
- **홈 분기:** `useCheckAppliedCareTrack()` → 암정보 가이드 신청 여부
- **Query keys:** `lib/queryClient.ts`의 `queryKeys.webview.*`

---

## 8. 기존 RN 앱과의 관계

`cama-plus-app` (변경 없음):

```text
${adminUrl}/webview/coaching/${loginId}
${adminUrl}/webview/coaching/wellbeing/${loginId}
${adminUrl}/webview/help
${adminUrl}/webview/treatment/${seq}
```

신규 SPA는 **동일 API 계약**을 웹에서 직접 호출하도록 설계되었습니다.  
Cafe24/nginx에서는 기존처럼 `/webview/*` 를 **정적 빌드 또는 Vercel/CloudFront**로 프록시하면 RN은 URL만 유지한 채 WebView 소스만 교체 가능합니다.

**API 베이스 (로컬 dev):**

```env
VITE_API_SERVER=https://camaplus.cafe24.com/
```

Vite dev 시 `/api` → `VITE_API_SERVER` 프록시 (`vite.config.ts`).

---

## 9. 로컬 실행 방법

```powershell
cd F:\cama_pjt\cama-cafe24\react-app-dawplus
copy .env.example .env
# .env 편집: VITE_API_SERVER, VITE_ACCOUNT_ID, VITE_DEV_TEST_TOKEN(선택)
npm install
npm run dev
```

- 포트: `VITE_BASE_PORT` (기본 5173)
- `npm run validate` — `tsc` + Biome

---

## 10. 배포 · 브랜치

| 항목 | 내용 |
|------|------|
| Vercel | `vercel.json` — 모든 경로 `index.html` (SPA) |
| 빌드 산출 | `outDir: env.VITE_MODE` (기본 `dist`) |
| `camaplus-webview` 브랜치 | WebView/CAMA 연동용으로 추정 — Cafe24 연동 시 이 브랜치 diff 확인 권장 |

---

## 11. 완성도 · 리스크 (Cafe24 연동 전)

| 항목 | 상태 |
|------|------|
| WebView API 레이어 | ✅ 대부분 `hooks/queries/webview`, `apis/api/webview` 구현 |
| 건강코칭 UI/라우트 | 🔄 진행 중 (meal/sleep/physical, mind 허브) |
| 로그인 ↔ JWT | ⚠️ UI는 목업 auth, API auth 미연결 |
| 라우트 가드 | ⚠️ `_auth` beforeLoad 비활성 |
| loginId 전달 | ⚠️ `VITE_ACCOUNT_ID` 고정 — RN 연동 설계 필요 |
| API 문서 URL | ⚠️ `api.camaplus.me` 잔존 |
| Cafe24 호스트 | 미배포 (nginx `/webview` 정적 경로 또는 doctor-web 연동 결정 필요) |

---

## 12. 권장 다음 단계 (기존 Git 건드리지 않음)

1. `camaplus-webview` 브랜치와 `main` diff — Cafe24 URL·base path 확인  
2. `.env`로 `VITE_API_SERVER=https://camaplus.cafe24.com` + 실제 `VITE_ACCOUNT_ID` / dev JWT 테스트  
3. `/login`을 `useLogin` + SecureLS로 교체, `_auth` beforeLoad 활성화  
4. RN WebView URL과 SPA `base` (`VITE_BASE_PATH`) 맞춤 — nginx `apply-coaching-nginx` 계열과 병행 검토  
5. SMTP/메일은 기존 handoff 문서대로 DNS 재개 후 진행  

---

## 13. Cursor 재개 한 줄

> “`react-app-dawplus` + `REACT_APP_DAWPLUS_ANALYSIS.md` 기준으로 신규 React 앱 연동 이어서.”
