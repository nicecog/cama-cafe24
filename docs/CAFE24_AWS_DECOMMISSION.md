# AWS → Cafe24 마이그레이션 및 AWS 만료 체크리스트

> **목표:** AWS(RDS, S3, CloudFront, `api.camaplus.me`) 운영을 종료하고 Cafe24 VPS 단일 호스트로 통합.

## 현재 운영 아키텍처

| 항목 | Cafe24 (to-be) |
|------|----------------|
| 공개 도메인 | `https://camaplus.cafe24.com` |
| API | `/api/...` (Spring `cama-plus-server`) |
| 이미지 CDN | `https://camaplus.cafe24.com/files/` (로컬 디스크) |
| Super Admin | `https://camaplus.cafe24.com/admin/` |
| DB | VPS PostgreSQL 17 (`cama` DB) |
| VPS | `210.114.18.156`, compose: `/opt/cama/deploy` |

---

## 마이그레이션 완료 항목

### 1. 데이터베이스 (`cama`)

- [x] AWS RDS `cama-prd` 스냅샷(2026-06-02) → VPS PostgreSQL 복원
- [x] CloudFront URL → `https://camaplus.cafe24.com/files/` 일괄 치환 (637건, `cm_contents.image` 등)
- [x] DB 전체 컬럼 감사: AWS/CloudFront/`api.camaplus.me` 문자열 **0건**

> **참고:** 2026-06-02 이후 AWS 운영 DB에 쌓인 변경분은 포함되지 않음. 최신 동기화가 필요하면 prod RDS 재덤프 후 복원.

### 2. 파일/이미지 (S3 → VPS 로컬)

- [x] `s3://cama-images/` → `/opt/cama/data/cama-files/` 동기화 (~813MB, ~3170 objects)
- [x] `s3://cama-files/` (레거시 해시 키) → 동일 경로 동기화 (~1500 objects)
- [x] HTML 본문(`cm_contents.contents`)·웰빙 리소스 내 embedded URL 치환 (CloudFront + S3 direct)
- [x] `CAMA_STORAGE_TYPE=local`, `IMAGE_CDN_BASE_URL=https://camaplus.cafe24.com/files`
- [x] Spring Security: `/files/**` GET·HEAD 공개 허용

### 3. 애플리케이션 설정

- [x] `cama-super-admin`: `REACT_APP_API_URL=https://camaplus.cafe24.com`
- [x] `react-app-dawplus`: `VITE_API_SERVER=https://camaplus.cafe24.com/`
- [x] `cama-plus-server` 프로필 `cafe24`: 로컬 스토리지 기본값
- [x] `AwsConfig` / `S3ImageStorageService`: `storage-type=s3` 일 때만 활성화
- [x] Super Admin `package.json`: AWS S3 배포 스크립트 제거, `deploy:cafe24` 추가

### 4. 인프라 (Cafe24 VPS)

- [x] Docker Compose 5서비스 (postgres, API, batch, doctor-web, super-admin)
- [x] nginx 단일 호스트 라우팅 (`/api`, `/admin`, `/files`, WebView SPA)
- [x] 메일: Brevo API/SMTP (AWS SES 미사용)

---

## AWS 만료 전 최종 검증 (필수)

```bash
# DB·파일 감사
python deploy/scripts/aws-to-cafe24-migrate.py --audit --use-legacy-aws-config
python deploy/scripts/aws-to-cafe24-migrate.py --verify --use-legacy-aws-config

# API 스모크
python deploy/scripts/super-admin-api-smoke.py
python deploy/scripts/cafe24-app-api-e2e.py
```

**수동 확인:**

- [ ] Super Admin 로그인 → 병원 목록 → 치료정보 사용현황 이미지 로드
- [ ] 환자 WebView (`/coaching/...`) API 호출 정상
- [ ] 신규 이미지 업로드 → `/files/upload/...` URL 반환·표시
- [ ] 모바일 앱 API 호스트가 `camaplus.cafe24.com` (구 `api.camaplus.me` 아님)

---

## AWS 리소스 만료 순서

> 아래는 **위 검증 완료 후** 진행. 되돌리기 어려우므로 단계별로 확인.

### Phase 1 — 트래픽 차단 (즉시 가능)

| 리소스 | 조치 |
|--------|------|
| `api.camaplus.me` DNS | `camaplus.cafe24.com` 301 리다이렉트 또는 A/CNAME 해제 |
| CloudFront 배포 (3개) | 비활성화 전 1주일 모니터링 — Cafe24 `/files/` 트래픽만 확인 |
| Super Admin S3 (`cama-system`, `cama-system-prod`) | 이미 Cafe24 nginx 정적 호스팅으로 대체됨 — 삭제 가능 |

### Phase 2 — 스토리지

| 리소스 | 조치 |
|--------|------|
| S3 `cama-images` | VPS 동기화 검증 후 버킷 삭제 (또는 Glacier 아카이브) |
| S3 `cama-files` | 레거시 해시 이미지 — 동기화 완료 후 삭제 |
| S3 기타 버킷 | 사용 여부 확인 후 정리 |

### Phase 3 — 데이터베이스

| 리소스 | 조치 |
|--------|------|
| RDS `cama-prd` | 최종 스냅샷 보관 후 인스턴스 삭제 |
| RDS `cama-dev` | 개발용 — 필요 시 로컬/VPS로 대체 후 삭제 |

### Phase 4 — 보안

| 항목 | 조치 |
|------|------|
| IAM Access Key (`application.yml`에 노출된 키) | **즉시 로테이션·폐기** |
| AWS 계정 | 미사용 서비스 정리, 결제 알람 해제 |

---

## 마이그레이션 스크립트 참고

| 스크립트 | 용도 |
|----------|------|
| `deploy/scripts/aws-to-cafe24-migrate.py` | `--audit`, `--sync-s3`, `--rewrite-db`, `--verify`, `--all` |
| `deploy/sql/cafe24-rewrite-aws-urls.sql` | CloudFront → Cafe24 URL 치환 |
| `deploy/scripts/vps-deploy-server-src.py` | API JAR 빌드·배포 |
| `deploy/scripts/vps-deploy-super-admin.py` | Super Admin SPA 배포 |
| `deploy/local-aws-migrate.env.example` | S3 동기화용 AWS 자격증명 (Git 제외) |

---

## 레거시 shim (선택 제거)

`deploy/nginx/coaching-api-rewrite-snippet.html` — 구버전 JS에 하드코딩된 `api.camaplus.me`를 런타임에 `camaplus.cafe24.com`으로 치환.

- Cafe24 빌드 산출물에 `api.camaplus.me`가 **없으면** nginx `sub_filter` 주입 제거 가능.
- 확인: `python deploy/scripts/vps-coaching-webview-test.py`

---

## 롤백 (비상 시)

1. CloudFront/S3는 삭제 전 스냅샷·동기화본 보관 (`/opt/cama/data/cama-files`, `db-dump/cama_prod.sql`)
2. DNS `api.camaplus.me` → AWS ALB/CloudFront 복구
3. `CAMA_STORAGE_TYPE=s3` + AWS 키로 API 재기동 (레거시 모드)

---

*최종 갱신: 2026-06-03*
