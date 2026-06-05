# Cafe24 — `react-app-dawplus` 배포

> **호스트:** `https://camaplus.cafe24.com`  
> **VPS 정적 경로:** `/opt/cama/www/react-app/`  
> **RN WebView:** `/webview/*` → SPA (`dist/`)  
> **API:** 동일 호스트 `/api/` (nginx → `cama-plus-server:8080`)

---

## 1. 아키텍처

```text
[APK WebView]  https://camaplus.cafe24.com/webview/coaching/{loginId}
       │
       ▼
[Nginx]  /assets/*, /webview/*, /coaching/*, /wellbeing/*, /help, /content/*
       │   root /opt/cama/www/react-app  (try_files → index.html)
       ▼
[react-app-dawplus dist]

[동일 호스트]  /api/*  → Docker :8080
[나머지 /]     → cama-doctor-web :8081  (의사 /login 등)
```

CloudFront + `api.camaplus.me` sub_filter 는 **제거**합니다. API는 이미 Cafe24 단일 호스트입니다.

---

## 2. PC에서 빌드

```powershell
cd F:\cama_pjt\cama-cafe24\react-app-dawplus

# 환경 (최초 1회: 비밀값 편집)
copy .env.cafe24.example .env

# 또는 원스텝 빌드
node ..\deploy\scripts\build-react-app-cafe24.mjs
# → dist/
```

| 변수 | 운영 값 |
|------|---------|
| `VITE_BASE_PATH` | `/` |
| `VITE_API_SERVER` | `https://camaplus.cafe24.com/` |
| `VITE_ENCRYPTION_SECRET` | **VPS와 별도 강한 랜덤** (Git 금지) |

검증:

```powershell
npm run test:webview-routes
npm run type-check
```

---

## 3. VPS 업로드

### 3.1 디렉터리 (최초 1회)

```bash
sudo mkdir -p /opt/cama/www/react-app
sudo chown -R $USER:www-data /opt/cama/www/react-app
```

### 3.2 PowerShell (권장)

접속 정보: [`deploy/CAFE24_VPS_ACCESS.local.md`](../deploy/CAFE24_VPS_ACCESS.local.md) (Git 제외)

```powershell
# 비밀번호 SSH (권장)
cd F:\cama_pjt\cama-cafe24
python deploy/scripts/vps-deploy-react-app.py

# 또는 SSH 키 설정 시
cd deploy\scripts
.\deploy-react-app-cafe24.ps1 -Build -ApplyNginx
```

`-ApplyNginx` 는 `cama-patient-spa-locations.conf` 를 `/etc/nginx/sites-enabled/cama` 에 주입 후 `nginx -t && reload` 합니다.

### 3.3 수동 scp

```powershell
scp -r F:\cama_pjt\cama-cafe24\react-app-dawplus\dist\* root@IP:/opt/cama/www/react-app/
```

---

## 4. Nginx

템플릿: `deploy/nginx/cama-patient-spa-locations.conf`  
전체 예시: `deploy/nginx/cama-single-host.conf.example`

VPS에서만 반영:

```bash
sudo cp /opt/cama/deploy/nginx/cama-patient-spa-locations.conf /tmp/
sudo python3 /opt/cama/deploy/scripts/apply-patient-spa-nginx.py
sudo nginx -t && sudo systemctl reload nginx
```

### 4.1 스모크 URL

| URL | 기대 |
|-----|------|
| `https://camaplus.cafe24.com/webview/help` | 도움말 SPA 200 |
| `https://camaplus.cafe24.com/webview/coaching/TEST_ID` | → `/coaching?wvLoginId=` |
| `https://camaplus.cafe24.com/assets/index-*.js` | 200 (해시 파일) |
| `https://camaplus.cafe24.com/login` | **의사 웹** (doctor-web, SPA 아님) |

WebView 감사 (기존):

```bash
python3 /opt/cama/deploy/scripts/vps-webview-url-audit.py
```

---

## 5. 운영 주의

1. **`/login` 충돌** — 의사 포털은 doctor-web, 환자 SPA 로그인은 `/login` 이지만 nginx는 의사 쪽에만 매칭됩니다. WebView는 `wvLoginId` 부트스트랩을 사용합니다.
2. **`/assets/`** — 환자 SPA 전용으로 두었습니다. 의사 웹이 동일 prefix 를 쓰면 nginx 순서를 조정해야 합니다.
3. **`/webview/treatment/{seq}`** — SPA가 `/content/detail/{id}` 로 처리합니다 (구 doctor-web Thymeleaf 대체).
4. 배포 후 APK **캐시 WebView** — 앱 재시작 또는 WebView hard reload 권장.

---

## 6. 관련 문서

- [WebView 화면 매핑](REACT_APP_WEBVIEW_SCREENS.md)
- [VPS 전체 배포](CAFE24_DEPLOYMENT_GUIDE.md)
- `deploy/env.cafe24.example` — `REACT_APP_WWW_ROOT`, `CAMA_SSH_TARGET`
