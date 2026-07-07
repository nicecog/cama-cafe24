# Cafe24 세션 핸드오프 — 일정 피커·FCM 알림·Git (2026-06-20)

> **작성일:** 2026-06-20  
> **워크스페이스:** `F:\cama_pjt\cama-cafe24`  
> **Git:** [nicecog/cama-cafe24](https://github.com/nicecog/cama-cafe24)  
> **목적:** 세션 전체 작업(Git 반영, 일정 UI, FCM 알림 원인·수정, VPS 배포) 정리.

**선행·연관 문서**

- [CAFE24_SESSION_HANDOFF_2026-06-19.md](CAFE24_SESSION_HANDOFF_2026-06-19.md) — WebView·APK·Admin·FCM
- [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md) — 일정 FCM 배치 동작
- [CAFE24_NATIVE_BRIDGE.md](CAFE24_NATIVE_BRIDGE.md) — RN WebView 브릿지

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| Git 대량 반영 + GitHub push | ✅ `0be91a5`, `3251b95` |
| 일정추가 날짜/시간 피커 (Android) | ✅ Popup 위 Drawer z-index·터치 수정 |
| iOS 호환 (safe-area·중첩 Drawer) | ✅ 명시적 수정 반영 |
| 일정 FCM 시간 형식 (`HH:mm:ss`) | ✅ SPA + DB 보정 + VPS 배포 |
| FCM 테스트 모드 (서버) | ⚠️ **아직 활성** — 기존 배치 일정 16,992건 비활성 |
| FCM 실제 수신 (일정 알림) | 🔄 시간 형식 수정 후 재테스트 필요 |

---

## 2. Git 커밋 이력

| 커밋 | 메시지 | 내용 |
|------|--------|------|
| `0be91a5` | `feat: 환자계정·FCM·네이티브브릿지·태블릿·배포 안정화` | 283 files — 환자계정 관리, APK/FCM Admin, RN 브릿지, 태블릿, nginx/deploy |
| `3251b95` | `fix: schedule date/time picker and FCM batch time format (HH:mm:ss)` | 일정 피커·시간 형식·VPS 스크립트 7 files |

**의도적으로 Git 제외:** `dist/*.apk`, `dist/*.png`, `deploy/scripts/*.out.txt`, `__pycache__/`, `react-app-dawplus.backup-*`, `tsconfig.tsbuildinfo`

---

## 3. 일정 날짜/시간 피커 수정

### 3.1 증상

- Android(및 WebView)에서 **일정추가/일정등록** → 시작일·시간 옆 아이콘 탭 시 달력/시간 선택 UI 미표시

### 3.2 원인

- `NewSchedule` / `EditSchedule`는 `Popup`(Radix Dialog, **z-index 201**) 안에서 열림
- `DatePickerDrawer` / `TimePickerDrawer`의 vaul Drawer는 **z-index 50**
- Drawer는 열리지만 **Popup 뒤에 가려져** 사용자에게 “무반응”으로 보임
- 부가: `readOnly` Input + 작은 아이콘 버튼 겹침 → Android WebView 터치 불안정

### 3.3 수정 (react-app-dawplus)

| 파일 | 변경 |
|------|------|
| `src/components/ui/Drawer.tsx` | overlay/content z-index **250/251**, bottom Drawer **`pb-safe`** |
| `src/components/ui/DatePickerDrawer.tsx` | 단일 `<button>` 트리거, iOS `touch-manipulation`, `shouldScaleBackground={false}` |
| `src/components/ui/TimePickerDrawer.tsx` | 동일 + **HH:mm:ss** 저장 (아래 §4) |

### 3.4 iOS 점검 결과

- z-index·button 트리거 변경은 iOS Safari/WebView에 **부정적 영향 없음** (동일 버그도 iOS에서 발생 가능)
- 명시 적용: `pb-safe`, `shouldScaleBackground={false}`, `-webkit-tap-highlight-color: transparent`, `text-base`(16px, 줌 방지)
- `index.html`에 `viewport-fit=cover` 이미 있음 → safe-area 동작

### 3.5 VPS 배포

- 스크립트: `deploy/scripts/vps-deploy-react-app.py`
- 경로: `/opt/cama/www/react-app` (431 files)
- nginx 전체 재적용 (`/admin/` 프록시 유지)

---

## 4. 일정 FCM 알림 — 시간 형식 버그

### 4.1 증상

- 일정 등록 + **알림 ON** 후 해당 시각에 FCM 미수신

### 4.2 원인 (2가지)

**① FCM 테스트 모드 (서버, 2026-06-18 15:40~)**

- `fcm_test_mode` 테이블에 세션 활성
- `prepareTestMode()` 시 `account_batch_schedule.is_enabled=true` **16,992건** 백업 후 **전부 false**
- **관리자 수동 FCM**은 계속 동작; **배치 일정 알림만** 중단
- **테스트 모드 이후 새로 등록한 일정**은 `enabled=true`로 insert → 배치 대상 가능

**② 시간 형식 불일치 (SPA 버그)**

- 배치 SQL: `bs.time = to_char(now(), 'HH24:MI:00')` → 예: `15:03:00`
- `TimePickerDrawer`가 **`15:03`** (초 없음)으로 저장
- 매칭 실패 → FCM 미발송 (계정 121 seq 23211 등)

### 4.3 수정

| 구분 | 내용 |
|------|------|
| `TimePickerDrawer.tsx` | `formatTimeWithSeconds()` → **`HH:mm:ss`** 로 `onChange` |
| | UI 표시는 `HH:mm`, export `normalizeScheduleTime()` |
| `NewSchedule.tsx` / `EditSchedule.tsx` | 제출 시 `time: normalizeScheduleTime(...)` |
| VPS DB 보정 | `deploy/scripts/vps-fix-schedule-time-format.py` |
| | `account_schedule` 6건, `account_batch_schedule` 12건 `:00` 추가 |

### 4.4 배치 FCM 파이프라인 (참고)

```
cama-back-batch (매 1분 batchCheck)
  → account_batch_schedule bs
  JOIN account_schedule sch (alarm=true)
  JOIN firebase_token tk (is_enabled=true)
  WHERE bs.is_enabled AND bs.time = 'HH:mm:00' (KST)
  → FcmMessageSender (CAMA_BATCH_FCM_DRY_RUN=false)
```

- 일정 알림은 **cama-plus-server API가 아니라 cama-back-batch**에서 발송
- 관련 문서: [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)

---

## 5. FCM 테스트 모드 — VPS 현황 (세션 종료 시점)

| 항목 | 값 |
|------|-----|
| 테스트 모드 | **활성** (`session_id`: `24a893473f3e455bbc630ead4aa523ca`) |
| 백업 일정 | 16,992건 |
| batch `is_enabled=true` | **4건** (신규 등록분 위주) |
| batch `is_enabled=false` | 22,962건 |
| `CAMA_BATCH_FCM_DRY_RUN` | `false` (실전송) |

**복원 방법 (관리자)**

- UI: 알림메시지관리 → **FCM 테스트 모드 복원**
- API: `POST /api/monitoring/notification/restore-fcm-test`
- 상태: `GET /api/monitoring/notification/fcm-test-status`

**점검 스크립트:** `deploy/scripts/vps-check-fcm-test-mode-now.py`

---

## 6. 이전 세션에서 Git에 포함된 주요 기능 (0be91a5)

| 영역 | 요약 |
|------|------|
| **관리자** | 환자 계정(이메일/비밀번호), APK 관리, FCM 알림 관리 UI/API |
| **cama-plus-app** | WebView 네이티브 브릿지(FCM·걸음·카메라/GPS 등), v1.2.8 |
| **react-app-dawplus** | 네이티브 브릿지 연동, WebView Dockbar 복구 |
| **cama-plus-server** | Vital/태블릿 QR, APK 저장, FCM 테스트모드, `web-no-fcm` 토큰 보호 |
| **배포** | nginx `/admin/` 프록시 재발 방지, VPS 스크립트 |
| **태블릿** | cama-tablet-android/web/server, 심박 통계 배치 |

---

## 7. VPS · URL

| 항목 | 값 |
|------|-----|
| Host | `210.114.18.156` |
| Admin | `https://camaplus.cafe24.com/admin/` (`cama` / `cama!`) |
| 환자 SPA | `https://camaplus.cafe24.com/webview/...` |
| API | `https://camaplus.cafe24.com/api/` |
| 환자 SPA 정적 | `/opt/cama/www/react-app` |

**주요 배포 스크립트**

| 스크립트 | 용도 |
|----------|------|
| `vps-deploy-react-app.py` | react-app-dawplus 빌드·업로드 |
| `vps-deploy-nginx-full.py` | nginx 전체 (admin 프록시 포함) |
| `vps-fix-schedule-time-format.py` | DB 시간 HH:mm → HH:mm:ss |
| `vps-check-fcm-test-mode-now.py` | FCM 테스트 모드·배치 상태 |

**빌드 참고:** `react-app-dawplus`는 기존 TS 오류로 `tsc` 없이 `npx vite build` 사용 (`.env.cafe24.example` → `.env`)

---

## 8. 핵심 파일 경로

| 기능 | 경로 |
|------|------|
| 일정추가 UI | `react-app-dawplus/src/components/schedule/NewSchedule.tsx` |
| 날짜 피커 | `react-app-dawplus/src/components/ui/DatePickerDrawer.tsx` |
| 시간 피커 | `react-app-dawplus/src/components/ui/TimePickerDrawer.tsx` |
| Popup (z-201) | `react-app-dawplus/src/components/ui/Popup.tsx` |
| FCM 테스트 모드 | `cama-plus-server/.../FcmTestModeServiceImpl.java` |
| 배치 일정 조회 | `cama-back-batch/.../mapper/ScheduleMapper.xml` |
| 일정 등록 API | `cama-plus-server/.../ScheduleRestController.java` |

---

## 9. 미완료 / 후속 작업

| 우선순위 | 항목 |
|----------|------|
| **높음** | FCM 테스트 모드 **복원** (`restore-fcm-test`) — 기존 16,992건 일정 알림 재개 |
| **높음** | 일정 FCM **실기기 재테스트** (알림 ON + 1~2분 뒤 시각, HH:mm:ss 확인) |
| 중간 | FCM 토큰 선택 로직 (`findBestDeliverableToken`, `web-no-fcm` fallback) |
| 중간 | Android `POST_NOTIFICATIONS`·notification channel |
| 낮음 | `react-app-dawplus` TS 빌드 오류 수정 (`nativeBridgeClient.ts`, `webview/index.tsx`) |
| 낮음 | 서버 API에서 schedule `time` 정규화 (다른 클라이언트 방어) |

---

## 10. 테스트 체크리스트

### 일정 피커

- [ ] 일정추가 → 시작일 탭 → 달력 Drawer 표시
- [ ] 일정추가 → 시간 탭 → 시간 Drawer 표시
- [ ] iOS Safari / iOS WebView 동일 확인

### 일정 FCM

- [ ] FCM 테스트 모드 복원 후
- [ ] 알림 ON + **2분 후** 시각으로 일정 등록
- [ ] 해당 분에 FCM 수신 (배치 로그 `batchCheck` targets>0)
- [ ] DB: `account_batch_schedule.time` = `HH:mm:ss` 형식

### Git

- [x] `main` → `origin/main` push 완료 (`3251b95`)

---

## 11. 변경 파일 목록 (3251b95)

```
react-app-dawplus/src/components/ui/Drawer.tsx
react-app-dawplus/src/components/ui/DatePickerDrawer.tsx
react-app-dawplus/src/components/ui/TimePickerDrawer.tsx
react-app-dawplus/src/components/schedule/NewSchedule.tsx
react-app-dawplus/src/components/schedule/EditSchedule.tsx
deploy/scripts/vps-check-fcm-test-mode-now.py
deploy/scripts/vps-fix-schedule-time-format.py
```

---

*다음 세션 시작 시: §5 FCM 테스트 모드 복원 여부 확인 → §10 체크리스트로 일정 알림 검증.*
