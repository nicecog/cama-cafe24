# WebView 성능 — 추후 검토 항목

> **작성:** 2026-06-03 · **갱신:** 2026-06-04  
> **배경:** 건강코칭·웰빙 WebView 체감 속도 개선 1차 적용 후, 추가로 손볼 만한 후보를 정리합니다.  
> **세션 기록:** [CAFE24_SESSION_HANDOFF_2026-06-04.md](CAFE24_SESSION_HANDOFF_2026-06-04.md)  
> **이미 적용됨(1차):** 포커스 `reload()` 제거, SPA 직접 URL(`/coaching/*`), `bootstrapWebviewSession` 캐시, RN `cacheEnabled` 등 — `usePatientWebViewSource.ts`, `webviewUrls.ts`

---

## 1. 코칭 라우트 API 워터폴 줄이기

**현상:** SPA 코칭/수면 화면 진입 시 `getAccountMe` 외에 카테고리·콘텐츠·설문 등 여러 API가 순차 호출되면 첫 페인트가 늦어집니다.

**검토 방향:**

- `_auth` / 코칭 레이아웃 `loader`에서 필요한 데이터를 **병렬** `Promise.all`로 묶기
- RN WebView 전용 **집계 API** (`/api/webview/coaching/bootstrap?category=A`) 로 1회 호출
- React Query `staleTime` / `gcTime` 을 WebView 세션 동안 길게 (예: 5~10분)

**우선순위:** 중 — 첫 진입 체감에 가장 도움

---

## 2. 숨김 WebView 프리로드 (RN)

**현상:** 건강코칭 탭을 처음 누를 때만 Vite 번들 + HTML 파싱 비용이 큼.

**검토 방향:**

- 로그인 직후 또는 홈 탭에서 `height:0` / `opacity:0` WebView로 `coachingHub` URL 미리 로드
- 메모리·배터리 trade-off — 저사양 기기에서는 옵션 플래그로 끄기
- iOS/Android 각각 `cacheMode` / `incognito` 동작 차이 QA 필요

**우선순위:** 중 — 구현·테스트 비용 대비 효과는 기기별로 다름

---

## 3. nginx 정적 자산 캐시

**현상:** `index.html` 은 짧게, `assets/*.js` 는 해시 파일명이라 장기 캐시 가능.

**검토 방향:**

- `/assets/` → `Cache-Control: public, max-age=31536000, immutable`
- `index.html` → `no-cache` 또는 짧은 `max-age` (배포 후 즉시 반영)
- CDN(CloudFront) 재도입 시 **API와 정적 분리** 유지

**파일:** `deploy/nginx/cama-patient-spa-locations.conf`

**우선순위:** 낮~중 — 2번째 방문부터 체감 개선

---

## 4. SPA 번들 크기·코드 스플리팅

**현상:** Vite 단일 청크가 크면 WebView 첫 JS 파싱이 길어짐.

**검토 방향:**

- 코칭·웰빙·도움말 라우트 **lazy route** (`React.lazy` + TanStack Router lazy)
- 차트/에디터 등 무거운 라이브러리 dynamic import
- `rollup-plugin-visualizer` 로 청크 분석 후 200KB 이상 청크 분리

**우선순위:** 중 — 빌드·회귀 테스트 필요

---

## 5. 코칭 허브 URL trailing slash

**현상:** TanStack Router 기준 `/coaching` 은 404, `/coaching/` 은 200.

**조치(2026-06-04):** RN `coachingHub` → `/coaching/` 로 수정. nginx `try_files` 와 SPA base 일치 여부도 배포 시 확인.

---

## 6. 도움말·기타 WebView URL 직접화

**현상:** `patientWebviewUrls.help()` 는 아직 `/webview/help` (리다이렉트 0~1회).

**검토 방향:**

- RN → `/help` 직접 (코칭과 동일 패턴)
- `treatment` WebView도 `/webview/treatment` 대신 SPA 직경로 정리

**우선순위:** 낮

---

## 7. WebView `reload` 정책 문서화 (다른 탭)

**현상:** 마이페이지·홈 등 일부 화면은 `isFocused` 시 **데이터 refetch**만 하고 WebView는 아님. 혼동 방지용.

**검토 방향:**

- WebView 화면 목록과 “언제 새로고침할지” 기준을 `REACT_APP_WEBVIEW_SCREENS.md`에 표로 추가
- Pull-to-refresh 또는 RN→SPA `postMessage('REFRESH')` 로 사용자 제어 새로고침

**우선순위:** 낮 (기능 요구 시)

---

## 8. iOS 걸음수·WebView 성능 패리티

**현상:** Android `CamaStepCounterModule` 만 구현. iOS WebView는 동일 bridge 미구현 가능.

**검토 방향:**

- HealthKit 걸음수 bridge
- iOS `WKWebView` 캐시·`limitsNavigationsToAppBoundDomains` 설정 점검

**우선순위:** 플랫폼 요구 시

---

## 9. 측정·회귀 기준

배포 전후 비교 시 기록할 항목:

| 시나리오 | 측정 |
|----------|------|
| 건강코칭 탭 **첫** 진입 | `onLoadEnd` ~ 화면 인터랙션 가능까지 (수동 스톱워치 또는 RN `performance.now`) |
| 탭 이탈 후 **재** 진입 | 전체 reload 없이 SPA 상태 유지 여부 |
| 수면 카테고리 진입 | 네트워크 탭: redirect 횟수, `getAccountMe` 호출 횟수 |
| 웰빙 | 하단 탭 1개만 표시 |

**도구:** Chrome DevTools (원격 디버깅), Android `chrome://inspect`, React Query Devtools (개발 빌드만).

---

## 관련 파일

| 영역 | 경로 |
|------|------|
| RN WebView URL | `cama-plus-app/src/config/webviewUrls.ts` |
| RN 성능 props | `cama-plus-app/src/hooks/usePatientWebViewSource.ts` |
| SPA bootstrap | `react-app-dawplus/src/lib/webview/bootstrapSession.ts` |
| 화면 목록 | `docs/REACT_APP_WEBVIEW_SCREENS.md` |
| 배포 | `docs/CAFE24_REACT_APP_DEPLOY.md`, `deploy/scripts/vps-deploy-react-app.py` |
