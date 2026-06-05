# cama-super-admin (Cafe24)

CAMA Plus **슈퍼 관리자** SPA — 병원·의사·질환 기초 데이터 관리.

- **원본 레포:** `F:\cama_pjt\cama-super-admin` (AWS/S3, `api.camaplus.me`) — 수정하지 않음
- **이 복사본:** Cafe24 VPS 배포용 (`camaplus.cafe24.com`)

## API

- Base: `https://camaplus.cafe24.com` (`REACT_APP_API_URL`)
- 인증: `POST /api/auth/admin` → `api_key: Bearer <token>`

## 실행

```bash
yarn install
cp .env.cafe24.example .env
yarn start          # http://localhost:3000/admin/
yarn build:cafe24   # production build → build/
```

## Cafe24 배포

상위 문서: [docs/CAFE24_SUPER_ADMIN_MIG.md](../docs/CAFE24_SUPER_ADMIN_MIG.md)

```bash
cd ..
python deploy/scripts/vps-deploy-super-admin.py
```

공개: `https://camaplus.cafe24.com/admin/`
