# React-App: React 19 · Cafe24 API · 로그인 전략

> **대상:** `cama-cafe24/react-app-dawplus`  
> **갱신:** 2026-06-04  
> **기존 앱 Git:** `cama-plus-app` / `cama-plus-server` **미수정**

---

## 1. React 18 → 19 마이그레이션

### 결론: **가능. 소규모 TS 수정 후 `npm run build` 성공.**

| 항목 | 결과 |
|------|------|
| `react` / `react-dom` | **19.2.0** |
| `@types/react` / `@types/react-dom` | **19.x** |
| Vite 6 + `@vitejs/plugin-react-swc` | 빌드 OK |
| TanStack Router / Query / Table | peer `^19` 지원, 문제 없음 |
| Radix UI 전체 | `^19.0` peer 범위 포함 |
| GSAP, Lottie, Recharts, Motion | React 19와 함께 빌드 통과 |

### 발생했던 이슈 (수정 완료)

| 파일 | 원인 | 조치 |
|------|------|------|
| `IconTabs.tsx` | React 19 `cloneElement` 제네릭 엄격화 | `isValidElement` + props 타입 단언 |
| `AlertDialogProvider.tsx` | `useRef()` 인자 필수 (React 19 types) | `useRef<...>(undefined)` |

### 주의·리스크 (런타임)

1. **README 구버전 문구** — “Vite가 React 19 미지원”은 **2025년 초 기준**이며, 현재 스택에서는 **19 사용 가능**.
2. **`react-is@19.1.1`** — 이미 19 계열. Recharts 내부 Redux와 함께 동작 확인은 **빌드만** 했고, 전 화면 E2E는 미실시.
3. **Strict Mode** — React 19에서 effect double-invoke 동작은 18과 유사; 코칭 step·GSAP 애니메이션 화면은 **실기기/브라우저 스모크** 권장.
4. **향후** — `@types/react` major 올릴 때 위 2파일 패턴 재발 가능.

### 권장

- **지금 19 유지** (빌드·의존성 모두 통과).
- 코칭·차트·로그인 플로우만 **수동 QA 1회** 후 RN WebView 임베드 테스트.

---

## 2. Cafe24 API 주소 변경 (완료)

### 이전

- 문서/예시: `https://api.camaplus.me/...`
- 코드 fallback: `http://localhost:8080`

### 이후 (cama-plus-app `stage.ts` 와 동일)

| 용도 | URL |
|------|-----|
| API base | `https://camaplus.cafe24.com/` |
| Admin / WebView 호스트 | `https://camaplus.cafe24.com` |

### 변경된 파일

| 파일 | 내용 |
|------|------|
| `src/config/stage.ts` | **신규** — `resolveApiBaseUrl`, `apiExampleUrl` |
| `src/apis/client/index.ts` | fallback → Cafe24 |
| `src/lib/ApiClient.tsx` | 동일 |
| `.env.example`, `.env.cafe24.example` | `VITE_API_SERVER` |
| `src/data/apiData.json` | urlExample 11건 |
| `api.md`, `api.txt` | 문서 URL |

### 런타임 API 경로 (코드)

실제 호출 경로는 **상대 경로** `api/webview/...`, `api/coaching/...` — 호스트만 Cafe24로 맞추면 됨.  
Vite dev: `/api` 프록시 → `VITE_API_SERVER` (rewrite로 `/api` 제거 — **로컬에서 prefix 중복 주의**).

---

## 3. 로그인 — DawPlus vs cama-plus-app (상세)

### 3.1 현재 React-App에 있는 **세 가지** 인증 경로

| # | 구현 | 실제 동작 | Cafe24 API 정합 |
|---|------|-----------|-----------------|
| A | `src/auth.tsx` + `/login` UI | localStorage에 username 문자열만 저장 (목업) | ❌ 서버 미호출 |
| B | `apis/api/auth.ts` + `useAuthMutations` | `POST auth/login` (email/password), `token`/`user` 응답 가정 | ❌ **경로·스키마 모두 불일치** |
| C | `interceptors` + `VITE_DEV_TEST_TOKEN` / SecureLS | `api_key: Bearer …` — **webview API용** | △ 토큰만 있으면 webview 동작 |

**`_auth` 라우트 가드**는 주석 처리 → 로그인 없이 URL 접근 가능.

**`accountMeAtom`**은 `VITE_ACCOUNT_ID`(loginId) 고정 — RN WebView가 넘기던 loginId를 env로 대체한 상태.

### 3.2 cama-plus-app (기존 · 검증됨)

| 항목 | 내용 |
|------|------|
| API | `POST /api/auth` |
| Body | `{ principal, credentials, firebase }` |
| 응답 | axios interceptor가 **`response`만 unwrap** → `{ account, apiToken }` |
| 토큰 저장 | `EncryptedStorage` (RN) / 키 `ACCESS_TOKEN` |
| 헤더 | `api_key: Bearer {apiToken}` — React-App 인터셉터와 **동일** |
| 로그인 후 | `hospitalApi.checkHospitalService()` → `selectInfo` vs `loggedIn` |
| 오류 메시지 | `loginErrorMessage.ts` — 한국어 매핑 (서버 401 문구 연동) |
| 부가 | PASS(`auth/pass`), recover/login-id, change login-id API |

### 3.3 서버 계약 (cama-plus-server)

```http
POST /api/auth
Content-Type: application/json

{
  "principal": "<loginId>",
  "credentials": "<password>",
  "firebase": { ... }
}
```

응답 (`ApiResult`):

```json
{
  "success": true,
  "response": {
    "apiToken": "<jwt>",
    "account": { ... }
  }
}
```

React-App `auth.ts`의 `auth/login` · email 필드 · `LoginResponse.token` 은 **이 서버에 존재하지 않음** (보일러플레이트 잔재).

### 3.4 WebView 전제 시나리오

RN 앱이 이미 로그인한 뒤 WebView로 SPA를 띄우는 경우:

| 방식 | 설명 |
|------|------|
| **권장 (단기)** | RN이 **JWT를 WebView에 주입** (URL hash, postMessage, 또는 cookie) → SPA는 SecureLS에 저장 후 webview API만 호출 |
| **권장 (중기)** | SPA 자체 로그인 화면을 **cama-plus-app과 동일 API**로 구현 (firebase stub 가능) |
| **비권장** | `auth.tsx` 목업 유지 |
| **비권장** | `apis/api/auth.ts` 그대로 사용 |

Firebase: 웹에서 FCM 토큰 없이 빈 객체/더미를 서버가 허용하는지 **서버 DTO 확인 필요** (RN은 `generateFirebaseInfo()` 호출).

### 3.5 추천 방향 (결론)

**기존 cama-plus-app 로그인·토큰·에러 처리를 React-App에 이식하는 것이 맞습니다.**

이유:

1. **이미 Cafe24 PROD에서 동작 검증** (APK 1.2.7, 동일 `api_key` 헤더).
2. DawPlus `auth.ts`는 **다른 백엔드 템플릿**이라 연결 시 404/파싱 오류 확실.
3. 인터셉터(`api_key`, `success/response/error`)는 RN axios와 **거의 동일** — 로그인 응답 처리만 RN처럼 맞추면 됨.
4. 환자 메시지·ID 변경·복구 API는 **이미 RN에 구현** — SPA 단독 로그인 시 재사용 가치 큼.

구현 순서 제안:

1. `apis/api/auth.ts` → `POST api/auth` + `AuthenticationResult` 타입 (account, apiToken).
2. `/login` → `useLogin` 연동, `auth.tsx` 목업 **제거 또는 WebView 전용 bypass**.
3. `accountMeAtom` → 로그인 응답 `account.loginId` / `seq` 사용 (`VITE_ACCOUNT_ID`는 dev만).
4. `_auth` `beforeLoad` 가드 복구.
5. (선택) `loginErrorMessage.ts` 포팅.

**WebView-only 배포**라면: 로그인 UI 없이 **토큰 주입 + loginId query** 만 먼저 해도 되고, 독립 웹 배포 시에만 1~4 필수.

---

## 4. 완료 (2026-06-04)

```text
[x] auth.ts → POST api/auth (principal, credentials, firebase)
[x] /login → usePatientSession + 한국어 오류
[x] accountMeAtom → authSessionAtom.loginId
[x] _auth 가드 (JWT 없으면 /login)
[x] React 19 — type-check + build 성공
[x] test:login-api — 401 "존재하지 않는 아이디" 확인
[ ] RN WebView JWT 주입 (postMessage)
[ ] CAMA_TEST_LOGIN_ID/PASSWORD 로 full login-api 테스트
```

WebView 화면 상세: [REACT_APP_WEBVIEW_SCREENS.md](REACT_APP_WEBVIEW_SCREENS.md)

---

## 5. Cursor 재개

> “`REACT_APP_MIGRATION_LOGIN_API.md` 기준으로 React-App 로그인 이식 진행.”
