# Cafe24 세션 작업 기록 — Super Admin · 모니터링 · Git (2026-06-06)

> **최종 갱신:** 2026-06-06  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **GitHub:** https://github.com/nicecog/cama-cafe24 · **커밋:** `3fa1c59` (`main`)

**관련 문서**

1. [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) — 전체 현황·TO-BE
2. [CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md](CAFE24_SESSION_HANDOFF_2026-06-03-MIGRATION-GIT.md) — AWS 이관·403 fix (`42a2225`)
3. [CAFE24_SUPER_ADMIN_MIG.md](CAFE24_SUPER_ADMIN_MIG.md) — Super Admin 아키텍처

**대화 기록 (Cursor):** `agent-transcripts/b7713878-c619-4b2e-80f1-eb3bc4424371`

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| Super Admin Vite 앱 `/admin/` VPS 배포 | ✅ |
| Doctor 403 / JWT (`api_key` + `Authorization`) | ✅ (선행 커밋 `42a2225`) |
| 신규 Vite Super Admin 로그인·라우팅·빌드 | ✅ doctor auth, `base: /admin/` |
| 환자모니터링 radial 차트 (최정자 등) | ✅ acSeq SQL + 프론트 조회 수정 |
| 월평가지표 데이터 없음 | ✅ UI `YYYY-MM` ↔ DB `yyyymm` 형식 불일치 수정 |
| 웰빙·즐겨찾기 통계 멈춤처럼 보임 | ✅ API 정상, 로딩 UI 추가 |
| `account_cnt_statistics` AWS 이관 | ✅ 202411~ 데이터 존재 (마이그레이션 문제 아님) |
| 배치 `accountStatisticsBatch` (23:00 KST) | ✅ Cafe24 정상 동작 확인 |
| GitHub push | ✅ `3fa1c59` |

---

## 2. Super Admin (Vite) 배포·수정

### 2.1 배경

협업자 커밋 `4688602 feat: 신규 관리자/webview 추가` 로 Super Admin이 **CRA → Vite** (`cama-super-admin/src/app/**`) 로 전환됨.  
Cafe24 `/admin/` 경로에 맞춰 빌드·배포·인증·라우팅을 재점검 후 VPS 반영.

### 2.2 주요 수정

| 파일 | 내용 |
|------|------|
| `vite.config.ts` | `base: "/admin/"` |
| `src/router/router.tsx` | `basename: "/admin"` |
| `src/hooks/useAuth.tsx` | `/api/auth/doctor` + `apiToken`/`doctor` 검증 |
| `src/utils/axios.tsx` | `api_key` + `Authorization` 동시 전송 |
| `src/app/App.tsx` | 로그인 후 `VITE_DEFAULT_PAGE`로 직행 |
| `src/layout/Layout.tsx` | basename 반영 리다이렉트 |
| `.env.production` | `VITE_COOKIE_ACCESS_TOKKEN=Api_key` (따옴표 제거) |
| `tsconfig.json` | 미사용 legacy `src/services`, `src/pages` exclude |
| `deploy/scripts/build-super-admin-cafe24.mjs` | Vite `build:prod` |
| `deploy/scripts/vps-deploy-super-admin.py` | `node` 빌드, 헬스체크 URL 수정 |

### 2.3 로그인·역할

| URL | 용도 | 계정 |
|-----|------|------|
| `/admin/` | **신규 Vite 의사 관리자** (환자·콘텐츠·모니터링) | `cama` / `admincama!` |
| 구 CRA `/admin/system-management/*` | 시스템 Admin (현 라우터 **미포함**) | `happycog` / (별도) |

### 2.4 배포

```powershell
node deploy/scripts/build-super-admin-cafe24.mjs
python deploy/scripts/vps-deploy-super-admin.py
```

- 정적 파일: `/opt/cama/www/super-admin` (135 files)
- Nginx: `/admin/` → `127.0.0.1:8083` (cama-super-admin 컨테이너)

---

## 3. 403 Forbidden 수정 (선행 — `42a2225`)

| 원인 | 조치 |
|------|------|
| JWT 필터가 `api_key`만 읽음 | `Authorization` fallback |
| Super Admin이 ADMIN 토큰으로 `/api/doctor/*` 호출 | `SecurityConfig` DOCTOR+ADMIN 허용 |
| doctor-web proxy가 Authorization 미전달 | `BilliveProxyController` 수정 |
| nginx `/api/` 헤더 | `vps-patch-nginx-api-auth.py` |

---

## 4. 환자모니터링 — radial 차트 (코칭 진행률)

### 4.1 증상

환자 목록 → 상세(코칭 모니터링) 진입 시 **중앙 동그란 통계(radial bar)가 안 보이거나 늦게 표시**.  
최정자(seq=558) 등 특정 환자에서 재현.

### 4.2 원인

1. **서버:** `getCoachingMonitoringList` SQL이 `acSeq` 파라미터를 **무시** → page 1(10건)만 반환  
2. **프론트:** 클라이언트에서 `r.seq === searchSeq` 필터 → 해당 환자가 1페이지에 없으면 **0건**  
3. **프론트:** `useEffect([])` — 환자 변경 시 재조회 안 됨  
4. **프론트:** step 차트 `queryKey`에 `seq` 미포함

### 4.3 수정

| 위치 | 내용 |
|------|------|
| `MonitorMapper.xml` | `acSeq` 조건 추가 (union 양쪽) |
| `Coaching.tsx` | `acSeq`+`searchText` 병렬 조회, `useEffect([seq,name,categoryCd])`, 로딩 UI |
| `RadialBarChart.tsx` | `progress=0` 표시, chart id |

### 4.4 검증 (`probe-coaching-radial.py`)

```
최정자 seq=558
기존 (page1 only): matched=0
수정 후 (acSeq filter): matched=5 (수면·식습관·신체·심리·운동, progress=0%)
```

---

## 5. 모니터링 / 월평가지표

### 5.1 증상

Super Admin **모니터링 → 월평가지표** 화면 데이터 없음.

### 5.2 조사 결과

| 항목 | 결과 |
|------|------|
| AWS→Cafe24 DB 이관 | ✅ `account_cnt_statistics` **60건** (user_type 10/20/99 × 20개월, `202411`~`202606`) |
| `account_login_history` | ✅ 8,746건 |
| 배치 `accountStatisticsBatch` | ✅ 매일 **23:00 KST** — 로그 `accountStatisticsBatch completed` (6/4~6/6) |
| **실제 원인** | UI가 `2026-01`~`2026-12` (**YYYY-MM**) 로 조회, DB는 **`202606`** (**yyyymm**) → 문자열 비교 0건 |

### 5.3 수정

| 파일 | 내용 |
|------|------|
| `monthly/Page.tsx` | API 호출 시 `YYYYMM` 변환 |
| `monthly/GridList.tsx` | 표시는 `YYYY-MM` 포맷 |

### 5.4 검증 (`diagnose-monthly-stats.py`)

```
match_dash_format (2026-01~2026-12): 0건
match_compact_format (202601~202612): 6건
```

---

## 6. 기타 Super Admin UX

| 화면 | 원인 | 수정 |
|------|------|------|
| 웰빙자원관리 | 로딩 중 `Each` → null (빈 화면) | `isPending` 스피너·에러 표시 |
| 즐겨찾기 통계 | `data.sort()` 캐시 변형, 로딩 없음 | `[...list].sort()`, 스피너 |

API 프로브 12건 모두 HTTP 200 (`cafe24-super-admin-screen-api-probe.py`).

---

## 7. react-app-dawplus (WebView SPA)

- `4688602` 에서 협업자 push 반영 후 VPS 재배포 (`vps-deploy-react-app.py`)
- 앱 APK 재빌드 불필요 (WebView는 서버 SPA)

---

## 8. 배포·E2E 스크립트 (신규)

| 스크립트 | 용도 |
|----------|------|
| `cafe24-super-admin-vite-e2e.py` | `/admin/` 페이지·doctor API |
| `cafe24-super-admin-screen-api-probe.py` | 화면별 API 12종 |
| `probe-coaching-radial.py` | 코칭 radial 차트 API |
| `diagnose-monthly-stats.py` | 월평가 DB·배치·API 형식 |
| `vps-debug-super-admin.py` | `/admin/` VPS 헬스 |

---

## 9. Git

```text
커밋: 3fa1c59
브랜치: main
메시지: fix: Super Admin Cafe24 deploy and monitoring screen bugs
이전: 4688602 → 3fa1c59
```

**포함:** cama-super-admin, MonitorMapper.xml, deploy scripts  
**제외:** `deploy/scripts/*.out.txt`, `tsconfig.tsbuildinfo`

---

## 10. 미완료 · 후속

| 우선 | 작업 |
|------|------|
| P2 | 구 CRA Super Admin (시스템 Admin, `/api/admin/hospital/*`) — 신규 Vite 라우터에 없음. 필요 시 별도 경로 또는 메뉴 추가 |
| P2 | Super Admin API 경로 leading `/` 통일 (`api/monitoring/...` → `/api/...`) |
| P0 | APK 실접속 E2E (기존 TO-BE 유지) |
| P1 | FCM DRY_RUN 해제 (검증 후) |

---

*다음 세션: [CAFE24_WORK_STATUS_AND_TODO.md](CAFE24_WORK_STATUS_AND_TODO.md) §1 → 본 문서 §10*
