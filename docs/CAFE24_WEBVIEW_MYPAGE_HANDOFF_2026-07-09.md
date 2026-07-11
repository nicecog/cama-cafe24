# Cafe24 WebView · 마이페이지 / 도움말 작업 인계 (2026-07-09)

> **범위:** cama-billive 대비 react-app-dawplus WebView UI 정렬, 마이페이지·도움말 전용 URL화, VPS 배포, 운영 확인  
> **프로덕션:** https://camaplus.cafe24.com  
> **관련 TODO:** [BILLIVE_CAFE24_GAP_TODO.md](./BILLIVE_CAFE24_GAP_TODO.md)

---

## 1. 작업 배경

cama-cafe24 환자 앱(`cama-plus-app`)은 **React Native WebView 껍데기** + **react-app-dawplus SPA** 구조이다.  
billive(`cama-billive/cama-plus-app`) 네이티브 화면과 cafe24 WebView UI·API 차이를 분석하고, **마이페이지(내정보)·도움말** 영역을 billive와 동일한 정보 구조로 맞춘 뒤 cafe24 VPS에 반영했다.

---

## 2. 완료된 작업 요약

| # | 항목 | 상태 |
|---|------|------|
| 1 | billive vs cafe24 API·UI 갭 분석 | ✅ 문서화 |
| 2 | WebView 상단 헤더 (로고 + 사람 + 도움말) | ✅ 배포 |
| 3 | 마이페이지 목록 billive 구성 (암정보 가이드 / 나의메뉴 4종 / 최근 알림) | ✅ 배포 |
| 4 | 팝업 → cafe24 전용 URL 라우트 전환 (마이페이지·도움말 하위) | ✅ 배포 |
| 5 | 홈 암정보 가이드 설정 **팝업 유지** (기능 동일, UX 선택) | ✅ 유지 |
| 6 | 앱 API·URL cafe24 단일 호스트 확인 | ✅ 확인 |
| 7 | 마이페이지 최근 알림 하단 Dockbar 가림 수정 | ✅ 배포 |
| 8 | 홈 vs 내정보 가이드 달성률 차이 — AS-IS 동일 → **수정 보류** | ✅ 결정 |

---

## 3. 아키텍처 (운영 기준)

```
cama-plus-app (RN)
  └─ WebView → https://camaplus.cafe24.com/webview
       └─ react-app-dawplus (SPA)
            ├─ 화면: /home, /mypage/*, /webview/help/* …
            └─ API:  https://camaplus.cafe24.com/api/*
                 └─ cama-plus-server (VPS Docker, nginx 프록시)
```

| 구분 | 호스트 | 비고 |
|------|--------|------|
| WebView 진입 | `camaplus.cafe24.com/webview` | RN `webviewShell.ts` PROD |
| REST API | `camaplus.cafe24.com/api/*` | `stage.ts`, `VITE_API_SERVER` |
| 정적 SPA | `camaplus.cafe24.com` (nginx → `/opt/cama/www/react-app`) | |
| 이미지 CDN | `camaplus.cafe24.com/files/` | AWS CloudFront 이전 완료 |
| **미사용 (앱)** | `api.camaplus.me`, billive API | cafe24 빌드에 없음 |

**RN 네이티브:** HTTP API 직접 호출 없음. WebView + 디바이스 브릿지(걸음수, FCM, 카메라 등)만.

---

## 4. WebView 헤더 (billive `LogoHeader` 정렬)

| 위치 | 아이콘 | 동작 |
|------|--------|------|
| 좌측 | CAMA 로고 | — |
| 우측 1 | 사람 (`icon_my_off.svg`) | `/mypage` |
| 우측 2 | 말풍선 (`icon_help.svg`) | `/webview/help` |

**파일:** `src/components/webview/WebViewLogoHeader.tsx`  
**표시 조건:** `isReactNativeWebView()` && 마이페이지 **서브 경로가 아닐 때** (`_auth/_layout.tsx`)

마이페이지 서브 화면(`/mypage/user-info` 등)은 `WebViewBackHeader` + `MypageSubPageLayout` 사용.

---

## 5. 마이페이지 화면 구성

### 5.1 메인 (`/mypage`)

| 섹션 | billive 대응 | cafe24 |
|------|--------------|--------|
| 암정보 가이드 | `CareTrackInfo` 카드 / 설정 CTA | 동일 (`CareTrackInfo`, `linkTo`) |
| 나의메뉴 | 4항목 | 내 상세정보 / 걸음수 / 이용약관 / 개인정보 |
| 최근 알림 | notification list | `MyHistory` (최대 10건) |

**파일:** `MyPageMainContent.tsx`, `routes/_auth/_layout/mypage/index.tsx`

### 5.2 전용 URL (팝업 → 페이지)

| 화면 | URL |
|------|-----|
| 마이페이지 | `/mypage` |
| 내 상세정보 | `/mypage/user-info` |
| 걸음수 | `/mypage/steps` |
| 서비스 이용약관 | `/mypage/terms` |
| 개인정보 처리방침 | `/mypage/privacy` |
| 암정보 가이드 **설정** (6단계 마법사) | `/mypage/care-track/apply` |
| 암정보 가이드 **상세/요약** | `/mypage/care-track` |
| 도움말 목록 (WebView) | `/webview/help` |
| 도움말 상세 (WebView) | `/webview/help/1` … `/6` |
| 도움말 목록 (브라우저) | `/help` |
| 도움말 상세 (브라우저) | `/help/1` … `/6` |

**공통 레이아웃:** `MypageSubPageLayout`, **공통 본문:** `MyInfosContent`, `MyStepsContent`, `PolicyPageContent`, `HelpMenuList`, `helpDetailMap`

### 5.3 팝업 유지 (의도적)

| 진입 | 방식 | 컴포넌트 |
|------|------|----------|
| 홈 `WelcomeHeader` 「암정보가이드 설정하기」 | **팝업** (`cancerInfoGuideOpenAtom`) | `CancerInfoGuide` (전역, `_auth/_layout`) |
| 마이페이지 「암정보 가이드 설정하기」 | **URL** `/mypage/care-track/apply` | `CancerInfoGuide asPage` |

**동일 기능:** 6단계 설정, `useApplyCareTrackService`, 확인 다이얼로그. 표시 shell만 다름 (팝업 vs 전체 페이지).  
**결정:** 홈 팝업은 AS-IS UX 유지 — 동작 이상 없음.

---

## 6. 도움말

- 6개 항목 billive와 동일 (`helpMenuItems.ts`)
- 목록: `HelpMenuList` → 상세 URL 이동
- 상세: `helpDetailMap.tsx` (Detail1~6)

---

## 7. 홈 vs 내정보 「가이드 달성률」 (AS-IS 유지)

### 7.1 사용자 관찰

홈에서 가이드 콘텐츠를 읽어 진행도가 올랐는데, 내정보 상단 카드의 달성률은 거의 변하지 않음.

### 7.2 원인 — **서로 다른 지표** (billive와 동일 패턴)

| | 홈 「진행도」 | 내정보 「가이드 달성률」 |
|--|--------------|------------------------|
| **의미** | 선택 **일차** 콘텐츠 읽음 비율 | **전체 가이드** 누적 진행률 |
| **데이터** | `POST /api/webview/track/service/info` (일차별 목록) | `POST /api/webview/track/service/request/info` → `process` |
| **계산 (cafe24 홈)** | `(progress===100 개수) / 그날 전체 × 100` | 서버 SQL: `sum(progress) / 전체 콘텐츠 수` |
| **billive 홈** | `progressSum / careTrackList.length` (일차 목록 평균) | `careTrackAppliedInfo.process` |

**billive 참고:**
- 홈: `MainScreen/index.tsx` — `contentProgress`
- 마이페이지: `MyPage/MainScreen/index.tsx` — `careTrackAppliedInfo?.process`

### 7.3 캐시 (부가 이슈)

홈에서 콘텐츠 열람 시 `ContentDetai.tsx`는 `serviceList` 쿼리만 invalidate.  
`appliedInfo`(내정보 `process`)는 즉시 갱신되지 않을 수 있음.

### 7.4 결정 (2026-07-09)

> AS-IS(billive)와 동일한 이중 지표 구조이므로 **우선 수정하지 않음**.  
> 추후 통일 시: 라벨 분리(「오늘 진행도」/「전체 달성률」) 또는 `appliedInfo` invalidate 추가 검토.

---

## 8. UI 버그 수정 — 최근 알림 / Dockbar

**증상:** `/mypage` 최근 알림 목록 맨 아래 항목이 하단 Dockbar(`fixed`, `h-14`)에 가려 반만 보임.

**수정:**
- `MyPageMainContent` 하단 spacer (`safe-area + 3.5rem`)
- `/mypage` 라우트 padding 조정

**파일:** `MyPageMainContent.tsx`, `mypage/index.tsx`

---

## 9. VPS 배포 이력 (본 작업)

| 일시 | 내용 |
|------|------|
| 2026-07-09 | 마이페이지·도움말 URL 라우트 최초 배포 (438 files) |
| 2026-07-09 | Dockbar 가림 수정 재배포 (438 files) |

**배포 명령:**

```powershell
cd F:\cama_pjt\cama-cafe24
node deploy/scripts/build-react-app-cafe24.mjs
python deploy/scripts/vps-deploy-react-app.py
```

**배포 대상:** `/opt/cama/www/react-app` (프론트만). **백엔드 JAR·APK 재배포 없음** — WebView URL 동일하므로 앱 재설치 불필요.

### Smoke test (프로덕션 200 확인)

- `/webview`, `/mypage`, `/mypage/user-info`, `/mypage/steps`
- `/mypage/terms`, `/mypage/privacy`
- `/mypage/care-track`, `/mypage/care-track/apply`
- `/webview/help`, `/webview/help/1`, `/help/1`

---

## 10. 주요 신규·수정 파일

```
react-app-dawplus/src/
├── components/
│   ├── webview/WebViewLogoHeader.tsx
│   ├── webview/WebViewBackHeader.tsx      (+ backTo)
│   ├── help/HelpMenuList.tsx, helpMenuItems.ts, helpDetailMap.tsx
│   ├── mypage/MypageSubPageLayout.tsx, MyInfosContent.tsx, MyStepsContent.tsx, PolicyPageContent.tsx
│   └── layout/header/myPage/MyPageMainContent.tsx
├── routes/
│   ├── _auth/_layout/mypage/**            (index + sub routes)
│   ├── webview/help/$id/
│   └── help/$id/
└── assets/icons/billive/icon_my_off.svg, icon_help.svg
```

---

## 11. billive 대비 미해결 갭 (요약)

상세는 [BILLIVE_CAFE24_GAP_TODO.md](./BILLIVE_CAFE24_GAP_TODO.md) 참고.

| 우선순위 | 항목 |
|----------|------|
| P1 | 로그아웃 시 `PUT /api/account/firebase/init` 미호출 |
| P2 | 약관/개인정보: billive Notion URL vs cafe24 정적 React |
| P2 | 도움말 콘텐츠 동기화 프로세스 |
| P3 | 걸음수 수동 등록 UI |
| P3 | `cancelCareTrackService` 런타임 검증 |

---

## 12. 로컬 개발 참고

| 항목 | 값 |
|------|-----|
| 프론트 | `react-app-dawplus/` — `npm run dev` |
| cafe24 PROD 빌드 | `node deploy/scripts/build-react-app-cafe24.mjs` |
| API 스테이지 | `src/config/stage.ts` → `PROD` = `https://camaplus.cafe24.com/` |
| RN WebView PROD | `cama-plus-app/src/config/webviewShell.ts` |

---

## 13. 결정 로그

| 날짜 | 결정 |
|------|------|
| 2026-07-09 | 마이페이지·도움말 하위 화면 cafe24 전용 URL로 전환 |
| 2026-07-09 | 홈 암정보 가이드 설정은 **팝업 유지** (apply URL과 동일 `CancerInfoGuide`) |
| 2026-07-09 | 앱 API·URL은 cafe24 단일 호스트 — billive/AWS 미사용 |
| 2026-07-09 | 홈 진행도 vs 내정보 달성률 차이 — AS-IS 동일 → **수정 보류** |
| 2026-07-09 | 최근 알림 Dockbar 가림 — spacer로 수정·배포 |

---

## 14. 다음 작업 후보 (미착수)

- [ ] 로그아웃 Firebase init API 연동
- [ ] 콘텐츠 읽기 후 `appliedInfo` 캐시 invalidate (내정보 숫자 즉시 반영)
- [ ] 달성률 UI 라벨 명확화 (선택)
- [ ] 홈 WelcomeHeader → `/mypage/care-track/apply` URL 통일 (선택, 현재 팝업 유지)
- [ ] `BILLIVE_CAFE24_GAP_TODO.md` 잔여 항목 순차 처리

---

*작성: 2026-07-09 · cama-cafe24 WebView 마이페이지/도움말 작업 세션 인계*
