# Cafe24 세션 작업 기록 — AWS 이관 · Super Admin · 서비스 신청 · Git (2026-06-03)

> **최종 갱신:** 2026-06-03  
> **워크스페이스:** `F:\cama_pjt` · **작업 루트:** `F:\cama_pjt\cama-cafe24`  
> **목적:** AWS 만료·Cafe24 단일 운영 전환, 관리자/의사 웹 수정, GitHub 공유까지 이번 세션 완료 내역.

**관련 문서**

1. [CAFE24_AWS_DECOMMISSION.md](CAFE24_AWS_DECOMMISSION.md) — AWS 리소스 만료 체크리스트
2. [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) — 전체 이관 롤업
3. [CAFE24_SUPER_ADMIN_MIG.md](CAFE24_SUPER_ADMIN_MIG.md) — Super Admin Cafe24 전환

**대화 기록 (Cursor):** `agent-transcripts/b7713878-c619-4b2e-80f1-eb3bc4424371`

---

## 1. 한 줄 요약

| 영역 | 상태 |
|------|------|
| AWS S3 → VPS 로컬 파일 (`/files/`) | ✅ `cama-images` + `cama-files` 동기화 |
| DB AWS URL 치환 (image·HTML·웰빙) | ✅ 전 컬럼 감사 0건 |
| `/files/**` 공개 HTTP | ✅ GET·HEAD 200 |
| Super Admin 라우팅·테마·치료정보 사용현황 | ✅ 수정·배포 |
| 의사 웹 **서비스 신청 목록** API 404 | ✅ `/api/doctor/service` 구현·배포 |
| GitHub 소스 공유 | ✅ [nicecog/cama-cafe24](https://github.com/nicecog/cama-cafe24) |
| `dist/` APK Git 추적 | ✅ `cama-plus-cafe24-1.2.7-release.apk` |
| AWS 리소스 실제 만료 (RDS·CloudFront·DNS) | ⏳ 검증 후 — [DECOMMISSION](CAFE24_AWS_DECOMMISSION.md) |

---

## 2. AWS → Cafe24 마이그레이션

### 2.1 아키텍처 (to-be)

| 항목 | Cafe24 |
|------|--------|
| 공개 도메인 | `https://camaplus.cafe24.com` |
| API | `/api/...` (`cama-plus-server:8080`) |
| 이미지 | `https://camaplus.cafe24.com/files/` (로컬 디스크) |
| Super Admin | `https://camaplus.cafe24.com/admin/` |
| DB | VPS PostgreSQL 17 (`cama`) |
| VPS | `210.114.18.156`, compose `/opt/cama/deploy` |

### 2.2 데이터베이스

| 작업 | 결과 |
|------|------|
| RDS `cama` 스냅샷 (2026-06-02) → VPS | ✅ 42 tables, account 550 |
| `cm_contents.image` CloudFront → Cafe24 | ✅ 637건 |
| `cm_contents.contents` embedded URL | ✅ 392 CloudFront + 64 S3 direct |
| `cm_wellbeing_resources` thumbnail/contents | ✅ 61건 |
| **전체 text/json 컬럼 감사** | ✅ AWS/CloudFront/`api.camaplus.me` **0건** |

> 2026-06-02 이후 AWS RDS 변경분은 미포함. 최신 동기화 필요 시 prod 재덤프.

### 2.3 파일 스토리지

| S3 버킷 | VPS 경로 | 규모 |
|---------|----------|------|
| `cama-images` | `/opt/cama/data/cama-files/` | ~3170 objects, ~813MB |
| `cama-files` (레거시 해시 키) | 동일 | ~1500 objects |

환경 변수 (VPS `.env.cafe24`):

```env
CAMA_STORAGE_TYPE=local
FILE_STORAGE_PATH=/opt/cama/data/cama-files
IMAGE_CDN_BASE_URL=https://camaplus.cafe24.com/files
```

### 2.4 코드·설정 변경

| 파일 | 내용 |
|------|------|
| `CamaHostingProperties.java` | 기본 `storageType=local`, Cafe24 CDN URL |
| `AwsConfig.java` / `S3ImageStorageService` | `storage-type=s3` 일 때만 활성화 |
| `SecurityConfig.java` | `/files/**` GET·**HEAD** permitAll |
| `application-gabia.yml` | CDN 기본값 Cafe24 |

### 2.5 마이그레이션 스크립트

```powershell
cd F:\cama_pjt\cama-cafe24
python deploy/scripts/aws-to-cafe24-migrate.py --audit --use-legacy-aws-config
python deploy/scripts/aws-to-cafe24-migrate.py --sync-s3 --use-legacy-aws-config
python deploy/scripts/aws-to-cafe24-migrate.py --rewrite-db --use-legacy-aws-config
python deploy/scripts/aws-to-cafe24-migrate.py --verify --use-legacy-aws-config
```

| 파일 | 용도 |
|------|------|
| `deploy/scripts/aws-to-cafe24-migrate.py` | audit / sync-s3 / rewrite-db / verify / --all |
| `deploy/sql/cafe24-rewrite-aws-urls.sql` | URL 일괄 치환 |
| `deploy/local-aws-migrate.env.example` | S3 동기화용 AWS 키 템플릿 (Git 제외) |

### 2.6 `/files/` 401 이슈 (해결)

- **증상:** HEAD 요청만 401, GET는 200
- **조치:** `SecurityConfig`에 `HttpMethod.HEAD` permitAll 추가, verify 스크립트 GET+Range 사용
- **검증:** `GET https://camaplus.cafe24.com/files/upload/...` → 200 (3/3)

---

## 3. Super Admin (`/admin/`)

### 3.1 수정 내역

| 이슈 | 원인 | 조치 |
|------|------|------|
| `/admin/` 빈 화면 | 중첩 `<Routes>` | `Outlet` 레이아웃 (`adminAppRoutes.tsx`, `App.tsx`) |
| 로그인 후 빈 화면 | 누락 라우트 | flat routes + `Home` Outlet |
| `theme.spacing is not a function` | styled-components vs MUI | `@mui/material` `styled` (`Home/index.tsx`) |
| 치료정보 사용현황 빈 화면 | 라우트·페이지 없음 | `TreatmentStatus` 페이지 + API 연동 |
| React 버전 | CRA 제약 | **18.3.1** (React 19 보류) |

### 3.2 배포

- 빌드: `REACT_APP_API_URL=https://camaplus.cafe24.com`, `PUBLIC_URL=/admin`
- 스크립트: `deploy/scripts/vps-deploy-super-admin.py`
- 테스트 관리자: `happycog` / `CamaAdmin2026!` (문서·채팅에 비밀번호 장기 보관 지양)

### 3.3 주요 파일

- `cama-super-admin/src/App.tsx`
- `cama-super-admin/src/routes/adminAppRoutes.tsx`
- `cama-super-admin/src/pages/Home/index.tsx`
- `cama-super-admin/src/pages/_SystemManagement/TreatmentStatus/index.tsx`
- `cama-super-admin/package.json` — AWS S3 배포 스크립트 제거, `deploy:cafe24` 추가

---

## 4. 의사 웹 — 서비스 신청 목록 404

### 4.1 증상

- URL: `https://camaplus.cafe24.com/service-management/service/list`
- 페이지(Thymeleaf)는 로드되나 API `/proxy/api/doctor/service` → **404**

### 4.2 원인

- `cama-doctor-web` → `/proxy` → `cama-plus-server`
- **컨트롤러에 `/api/doctor/service` 미구현** (MyBatis SQL만 존재)
- `hospital_service` 테이블에 `status`·`approve_date` 컬럼 **없음** (레거시 SQL과 불일치)

### 4.3 조치

| API | 설명 |
|-----|------|
| `GET /api/doctor/service` | 병원별 신청 목록 (페이지네이션) |
| `GET /api/doctor/service/{seq}/view` | 상세 |
| `PUT /api/doctor/service/{seq}/view` | 승인(APPROVE) / 거절(REJECT) |

**승인 상태 판별 (실제 스키마 기준)**

- `REQUEST`: `account_disease` 레코드 없음
- `APPROVE`: `account_disease` 존재 → `approveDate` = min(created_at)
- `REJECT`: `hospital_service.is_enabled = false`

**추가 복구:** `GET /api/common/disease/{hospitalSeq}/detail/list` (승인 화면용)

### 4.4 주요 파일

- `cama-plus-server/.../DoctorRestController.java` — service 3 endpoints
- `cama-plus-server/.../mapper/DoctorMapper.xml` — SQL 실스키마 반영
- `cama-plus-server/.../CommonRestController.java` — disease detail list
- `cama-doctor-web/.../static/js/service-list.js` — `CamaApi.getDoctorServiceList`

### 4.5 검증

```text
GET https://camaplus.cafe24.com/proxy/api/doctor/service?page=1
  → HTTP 200, totalCount 538 (병원 seq=1 기준)
```

배포: `python deploy/scripts/vps-deploy-server-src.py`

---

## 5. GitHub 저장소

| 항목 | 값 |
|------|-----|
| URL | https://github.com/nicecog/cama-cafe24 |
| 브랜치 | `main` |
| 초기 커밋 | `b32e870` — 전체 소스 (~1988 files) |
| APK 커밋 | `a15a4eb` — `dist/cama-plus-cafe24-1.2.7-release.apk` |

### 5.1 포함 프로젝트

`cama-plus-server`, `cama-back-batch`, `cama-doctor-web`, `cama-super-admin`, `react-app-dawplus`, `cama-plus-app`, `deploy/`, `docs/`, `dist/`

### 5.2 Git 제외 (`.gitignore`)

- `node_modules/`, `target/`, `build/`
- `.env`, `local-cafe24.mail.env`, `CAFE24_VPS_ACCESS.local.md`
- `*firebase-adminsdk*.json`, `deploy/*.zip`, `deploy/jars/`
- 프론트 빌드만: `react-app-dawplus/dist/`, `cama-plus-app/dist/` (루트 `dist/` APK는 **추적**)

### 5.3 clone

```bash
git clone https://github.com/nicecog/cama-cafe24.git
```

협업자에게 `deploy/env.cafe24.example` 등 예시 파일 복사 안내.

---

## 6. 미완료 · 다음 작업

| 우선 | 작업 |
|------|------|
| P0 | Super Admin·의사 웹·앱에서 이미지·HTML 본문 표시 수동 확인 |
| P0 | AWS `api.camaplus.me` DNS 리다이렉트 후 트래픽 모니터링 |
| P1 | prod RDS 재덤프 (2026-06-02 이후 데이터 필요 시) |
| P1 | IAM Access Key 로테이션 (레거시 `application.yml` 노출 키) |
| P1 | AWS S3·CloudFront·RDS 만료 — [CAFE24_AWS_DECOMMISSION.md](CAFE24_AWS_DECOMMISSION.md) |
| P2 | `coaching-api-rewrite-snippet.html` nginx 주입 제거 여부 검토 |

---

## 7. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-06-03 | AWS→Cafe24 파일·DB URL 마이그레이션, `/files/` 수정, Super Admin 라우팅·테마·치료현황 |
| 2026-06-03 | `/api/doctor/service` API 구현, DoctorMapper 실스키마 반영, VPS 배포 |
| 2026-06-03 | GitHub `nicecog/cama-cafe24` 초기 push, `dist/` APK 추가 |

---

*다음 세션: [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) §11 → AWS 만료 또는 APK E2E.*
