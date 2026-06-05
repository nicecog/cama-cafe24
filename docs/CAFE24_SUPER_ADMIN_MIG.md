# cama-super-admin → Cafe24 마이그레이션

> **원본:** `F:\cama_pjt\cama-super-admin` (변경 없음)  
> **Cafe24 복사본:** `cama-cafe24/cama-super-admin`  
> **공개 URL:** `https://camaplus.cafe24.com/admin/`

## 스택 버전 (Cafe24 정렬)

| 계층 | 버전 | 비고 |
|------|------|------|
| Super Admin UI | React 18 + CRA 5 + TypeScript 4.8 | Node **20** 빌드 |
| API Server | Spring Boot **3.5** + JDK **21** | `cama-plus-server` |
| Doctor Web | Spring Boot 3.x + JDK 21 | `cama-doctor-web` |
| DB | PostgreSQL **17** alpine | `docker-compose.cafe24.yml` |
| Reverse proxy | nginx | `/api/` → 8080, `/admin/` → 8083 |
| 레거시 (AWS) | `api.camaplus.me` + S3 | **미사용** (Cafe24 복사본만 변경) |

## API Base URL

- **변경 전:** `https://api.camaplus.me`
- **변경 후:** `https://camaplus.cafe24.com`
- 설정: `REACT_APP_API_URL` (`.env.cafe24.example`)

## 로컬 개발

```bash
cd cama-cafe24/cama-super-admin
yarn install
cp .env.cafe24.example .env
yarn start
# http://localhost:3000/admin/
```

## 빌드

```bash
cd cama-cafe24
node deploy/scripts/build-super-admin-cafe24.mjs
```

## API 스모크 테스트

```bash
set CAMA_ADMIN_USER=<관리자 로그인>
set CAMA_ADMIN_PASSWORD=<비밀번호>
python deploy/scripts/super-admin-api-smoke.py
```

## VPS 배포 (컨테이너)

```bash
cd cama-cafe24
python deploy/scripts/vps-deploy-super-admin.py
```

- 이미지: `cama-super-admin:cafe24` (nginx + static build)
- 포트: `127.0.0.1:8083`
- nginx: `deploy/nginx/cama-super-admin-locations.conf` 를 VPS `sites-available`에 include

## docker-compose

`deploy/docker-compose.cafe24.yml` 서비스 `cama-super-admin` 추가됨.

```bash
cd /opt/cama/deploy
docker-compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d --build cama-super-admin
```
