# cama-billive ↔ cama-cafe24 실질적 갭 (추후 수정 TODO)

> 작성: 2026-07-09  
> 목적: billive 네이티브 앱과 cafe24(WebView + server) 간 **의도적으로 다르거나 아직 맞추지 않은** 항목 기록

---

## 1. 로그아웃

| 항목 | cama-billive | cama-cafe24 (react-app-dawplus) |
|------|--------------|----------------------------------|
| API | `PUT /api/account/firebase/init` 호출 후 로컬 토큰 삭제 | 서버 호출 없이 클라이언트 토큰만 삭제 |
| 위치 | 내 상세정보 화면 | 내 상세정보 팝업 (billive와 동일 위치로 이동 완료) |

**TODO:** WebView 로그아웃 시 `PUT /api/account/firebase/init` 또는 WebView 전용 엔드포인트 호출 여부 결정 및 RN 셸 연동.

---

## 2. 약관 / 개인정보 처리방침

| 항목 | cama-billive | cama-cafe24 |
|------|--------------|-------------|
| 제공 방식 | Notion URL WebView | React 정적 컴포넌트 (`TermsContent`, `PrivacyContent`) |
| 서버 API | 없음 | 없음 |

**TODO:** Notion URL 통일 vs SPA 정적 문서 유지 결정. URL 변경 시 billive `TermsOfUseServiceScreen` URI 동기화.

---

## 3. 도움말

| 항목 | cama-billive | cama-cafe24 |
|------|--------------|-------------|
| 로드 | RN WebView → `{adminUrl}/webview/help` | SPA `/webview/help` 정적 페이지 |
| 서버 API | 없음 | 없음 |

**TODO:** admin CDN 배포 URL과 cafe24 SPA `/webview/help` 콘텐츠 동기화 프로세스 정의.

---

## 4. API 경로 (Native vs WebView)

billive는 JWT Native API (`GET /api/account/me` 등), cafe24 WebView는 `/api/webview/*` (메서드·경로 상이).

**TODO:** RN 셸이 cafe24 서버를 직접 호출할 경우 WebView API vs Native API 전략 문서화.

---

## 5. 걸음수 등록

| 항목 | cama-billive | cama-cafe24 |
|------|--------------|-------------|
| 조회 | `POST /api/track/service/stepList` | `POST /api/webview/track/service/stepList` |
| 등록 UI | 주석 처리 (API 존재) | 조회만 (`MySteps`) |

**TODO:** 걸음수 수동 등록 UI 필요 시 billive `StepInfoScreen` 등록 폼 복원 또는 네이티브 브릿지 연동.

---

## 6. 즐겨찾기 메뉴

| 항목 | cama-billive | cama-cafe24 |
|------|--------------|-------------|
| 마이페이지 메뉴 | 주석 처리 | 없음 (하단 탭 「즐겨찾기」) |

**TODO:** 마이페이지 내 즐겨찾기 항목 노출 여부 결정.

---

## 7. QR 코드 / 의사앱 자료전송

| 항목 | cama-billive | cama-cafe24 |
|------|--------------|-------------|
| 마이페이지 QR | 없음 | ✅ **의사앱 자료전송** (`/mypage/doctor-transfer`) |
| 연동 | — | `cama-tablet` BLE 오프라인 프로토콜 |

상세: [CAFE24_DOCTOR_TRANSFER_FEATURE.md](./CAFE24_DOCTOR_TRANSFER_FEATURE.md)

**TODO:** iOS BLE·QR, APK 배포, 실기기 E2E 검증.

---

## 8. 알려진 클라이언트 이슈

- `react-app-dawplus/src/apis/api/webview/track.ts` — `cancelCareTrackService` 주석 「현재 오류」: 서버 엔드포인트는 존재, 런타임 검증 필요.
- `POST /api/hospital/{hSeq}/service/cancel` — billive 클라이언트에만 정의, cafe24 서버·UI 미사용.

---

## 9. 이번 작업에서 맞춘 항목 (2026-07-09)

- WebView 상단 **사람 + 도움말(말풍선)** 아이콘 2개 (`WebViewLogoHeader`)
- 마이페이지 목록 billive와 동일 구성 (`/mypage`)
- 도움말 6개 항목 (`/webview/help`, `/help`)

## 10. cafe24 전용 URL 라우트 (2026-07-09 추가)

| 화면 | cafe24 URL |
|------|------------|
| 마이페이지 | `/mypage` |
| 내 상세정보 | `/mypage/user-info` |
| 걸음수 | `/mypage/steps` |
| 서비스 이용약관 | `/mypage/terms` |
| 개인정보 처리방침 | `/mypage/privacy` |
| 암정보 가이드 설정 | `/mypage/care-track/apply` |
| 암정보 가이드 상세 | `/mypage/care-track` |
| 도움말 목록 (WebView) | `/webview/help` |
| 도움말 상세 (WebView) | `/webview/help/1` … `/6` |
| 도움말 목록 (브라우저) | `/help` |
| 도움말 상세 (브라우저) | `/help/1` … `/6` |
