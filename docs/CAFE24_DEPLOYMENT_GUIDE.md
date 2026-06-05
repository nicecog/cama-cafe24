# Cafe24 가상서버 배포 가이드 (Billive / CAMA Plus)

> **작성 목적:** 자이언트 플러스 VPS 구매 후, `cama-cafe24` 스택을 **Docker 4서비스 + 무료도메인(경로 분기)** 로 올리고 FCM까지 검증하는 **실행 순서**를 정리합니다.  
> **대상 경로:** `F:\cama_pjt\cama-cafe24`  
> **관련:** [API 마이그레이션](CAFE24_API_MIGRATION.md) · [작업 현황·TO-BE](CAFE24_WORK_STATUS_AND_TODO.md) · [테스트 가이드](CAFE24_TEST_GUIDE.md) · [배치 스케줄](CAFE24_BATCH_SCHEDULE.md) · [환자 React SPA](CAFE24_REACT_APP_DEPLOY.md) · [README](../README.md)

---

## 1. 한 줄 요약

| 항목 | 결정 |
|------|------|
| 호스팅 | 카페24 **가상서버호스팅 · 리눅스 자이언트 플러스** (6GB RAM, 150GB SSD) |
| RAM 권장 | 운영 안정성 → **+1GB 옵션(7GB)** 권장 (월 약 6,600원, [상품 페이지](https://hosting.cafe24.com/?controller=new_product_page&page=virtual)) |
| 앱 3 + DB | **컨테이너 4개** (postgres, plus-server, back-batch, doctor-web) |
| 도메인 | **무료도메인** `아이디.cafe24.com` 또는 `아이디.mycafe24.com` (신규는 후자가 많음) |
| API 주소 | **`api.` 서브도메인 불가** → **같은 호스트 + 경로** (`/api/...`) |
| HTTPS | 무료도메인은 **기본 HTTPS** ([공식 FAQ](https://help.cafe24.com/faq/special-hosting/homepage-hosting/setup-management/https-setup-homepage-builder-ssl)) |
| 빌드 | **PC에서 JAR 빌드 후 업로드** (VPS에서 Maven/Gradle 컴파일 지양) |
| 환자 앱 | `cama-plus-app` → PROD base URL을 무료도메인 HTTPS로 변경 |
| 브랜드 | 사용자 앱 이름 **CAMA Plus** / 백엔드 이관명 **Billive** (동일 스택) |

---

## 2. 아키텍처

```text
[인터넷]
    │  https://{HOSTING_ID}.mycafe24.com  (또는 .cafe24.com)
    ▼
[Nginx @ VPS :443/:80]  ← 직접 설정 (카페24 자동 아님)
    ├─ /api/*     ──► cama-plus-server:8080
    ├─ /files/*   ──► cama-plus-server:8080  (이미지 CDN 경로)
    ├─ /proxy/*   ──► cama-doctor-web:8081
    ├─ /login, /patient-management/*, ... ──► cama-doctor-web:8081
    └─ (batch :8082 는 외부 노출 금지)

[Docker network]
    postgres:5432
      ├─ DB cama          ← API + batch
      └─ DB cama_doctor   ← doctor-web

cama-doctor-web ──(내부 HTTP)──► http://cama-plus-server:8080
cama-back-batch ──(FCM HTTPS)──► fcm.googleapis.com
```

**환자 앱(`cama-plus-app`)** 은 `mainApiClient` 하나만 사용하며, 모든 경로가 `/api/...` 로 시작합니다.  
따라서 base URL은 **호스트만** 맞추면 됩니다.

```text
https://{HOSTING_ID}.mycafe24.com/
```

---

## 3. 공식 문서에서 확인한 제약 (도메인·SSL)

| 내용 | 출처 |
|------|------|
| 무료도메인 형태: `ID.cafe24.com`, `ID.mycafe24.com` | [무료도메인 연결](https://help.cafe24.com/faq/domain/connection-delete/connect_cafe24_free_domain) |
| **`api.ID.cafe24.com` 등 3차(무료 하위) 서브도메인 불가** | [멀티사이트 FAQ](https://help.cafe24.com/faq/wordpress/managed-wordpress/ftp-db/wordpress_multisite_setup_guide) |
| 보유 도메인의 `blog.mydomain.com` 형태 2차 도메인은 **도메인 연결관리**에서 가능 | [도메인 설정](https://help.cafe24.com/docs/console/console/domain-setup) |
| 가상서버는 **OS만 제공**, 웹서버·DB·Java **직접 설치** | [가상서버 운영 가이드](https://help.cafe24.com/docs/server-hosting/virtual-server-hosting/virtual-server-hosting-management-guide) |
| 무료도메인 **기본 HTTPS**, 별도 SSL 상품 신청 대상 아님 | [HTTPS FAQ](https://help.cafe24.com/faq/special-hosting/homepage-hosting/setup-management/https-setup-homepage-builder-ssl) |
| FCM `https://fcm.googleapis.com` 아웃바운드 **가능**(가상서버 1:1 답변) | `nicecog/cama-billive/docs/BILLIVE_HOSTING_DECISION_20260530.md` |
| Docker MTU **1450** 설정 권장 | [Cafe24 Docker 가이드](https://docs.cafe24cloud.com/home/server/server/config/docker) |

---

## 4. 사전 준비 (구매 전·당일 PC에서)

### 4.1 로컬에서 빌드 산출물 만들기

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
cd F:\cama_pjt\cama-cafe24

cd cama-plus-server
mvn clean package -DskipTests
# → target\cama-back-1.0-SNAPSHOT.jar

cd ..\cama-back-batch
mvn clean package -DskipTests
# → target\cama-batch-1.0-SNAPSHOT.jar

cd ..\cama-doctor-web
.\gradlew.bat clean bootJar -x test
# → build\libs\cama-doctor-web-0.0.1-SNAPSHOT.jar
```

### 4.2 시크릿·파일 (Git 제외, VPS에만 둠)

| 파일 | 용도 |
|------|------|
| Firebase Admin JSON | batch FCM (`camaplus-1de96` — 앱 `google-services.json`과 **동일 프로젝트**) |
| `deploy/.env.cafe24` | DB 비밀번호, JWT secret, DB URL 등 (예시: `deploy/env.cafe24.example`) |
| (선택) 기존 운영 DB 덤프 | `pg_dump` → VPS postgres 복원 (실사용자·FCM 토큰 테스트용) |

### 4.3 환자 앱 URL 변경 (배포 전에 코드 준비)

파일: `F:\cama_pjt\cama-plus-app\src\config\stage.ts`

- `currentStage` → `'PROD'` (스토어/운영 빌드 시)
- `resolveApiBaseUrl('PROD')` → `https://{HOSTING_ID}.mycafe24.com/`  
  (실제 발급 도메인이 `.cafe24.com` 이면 그에 맞게)

하드코딩 1곳 추가 수정:

- `src/screens/MyPage/MyPhoto/index.tsx` — `api.camaplus.me` → 위와 동일 호스트 또는 `mainApiClient` 사용으로 통일

### 4.4 로컬 스모크 (선택, 권장)

```powershell
cd F:\cama_pjt\cama-cafe24
docker compose -f docker-compose.local.yml up -d

cd cama-plus-server; .\scripts\run-local-cafe24.ps1
cd ..\cama-back-batch; .\scripts\run-local-cafe24.ps1
cd ..\cama-doctor-web; .\scripts\ensure-doctor-db.ps1; .\scripts\run-local-cafe24.ps1
```

---

## 5. Day 1 — 카페24 구매·콘솔 설정

### 5.1 상품 신청

1. [가상서버호스팅](https://hosting.cafe24.com/?controller=new_product_page&page=virtual) → **자이언트 플러스**
2. OS: **Ubuntu 22.04** 권장 (Docker 문서·예제 많음)
3. (권장) **RAM +1GB** 추가 옵션 신청
4. **보안 설정:** Java/Docker 막는 옵션이 있으면 **미사용** 또는 VPS에서 `java` 실행 계정 확인 ([상품 페이지 보안 설정 안내](https://hosting.cafe24.com/?controller=new_product_page&page=virtual))
5. APM(Apache/PHP/MariaDB) 옵션은 **사용 안 함** — RAM 절약

### 5.2 무료도메인

1. 나의 서비스 관리 → 호스팅관리 → **도메인 연결관리**
2. 무료도메인 연결 ([가이드](https://help.cafe24.com/faq/domain/connection-delete/connect_cafe24_free_domain))
3. 발급 주소 기록 (아래 `{PUBLIC_HOST}`):

```text
예: happycog.mycafe24.com
또는: happycog.cafe24.com
```

4. 약 30분 후 브라우저에서 `https://{PUBLIC_HOST}/` 접속 확인 (빈 페이지여도 HTTPS 자물쇠 확인)

### 5.3 VPS 접속 정보

- 공인 IP
- root 또는 제공된 SSH 계정
- (Windows) PowerShell `ssh root@{IP}` 또는 PuTTY

---

## 6. Day 1 — VPS 초기 설정 (SSH)

### 6.1 패키지

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin nginx curl
sudo systemctl enable docker nginx
```

### 6.2 Docker MTU (Cafe24 필수)

`/etc/docker/daemon.json`:

```json
{
  "mtu": 1450
}
```

```bash
sudo systemctl restart docker
```

### 6.3 (권장) swap 2GB

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 6.4 방화벽

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 7. Day 1 — 배포 디렉터리·환경변수

### 7.1 서버 디렉터리 구조 (예)

```text
/opt/cama/
  deploy/
    docker-compose.cafe24.yml
    .env.cafe24
    nginx/cama.conf
  jars/
    cama-back-1.0-SNAPSHOT.jar
    cama-batch-1.0-SNAPSHOT.jar
    cama-doctor-web-0.0.1-SNAPSHOT.jar
  secrets/
    firebase-adminsdk.json
  data/
    cama-files/          # API 로컬 파일 저장
    postgres/            # PG 볼륨 (compose에서 지정)
```

PC에서 업로드 예:

```powershell
scp F:\cama_pjt\cama-cafe24\deploy\* root@{IP}:/opt/cama/deploy/
scp F:\cama_pjt\cama-cafe24\cama-plus-server\target\cama-back-1.0-SNAPSHOT.jar root@{IP}:/opt/cama/jars/
# ... batch, doctor-web JAR 동일
scp {firebase-json} root@{IP}:/opt/cama/secrets/firebase-adminsdk.json
```

### 7.2 환경변수 (`deploy/.env.cafe24`)

`deploy/env.cafe24.example` 를 복사해 값을 채웁니다.

| 변수 | 설명 | 예 |
|------|------|-----|
| `PUBLIC_HOST` | 무료도메인 FQDN | `happycog.mycafe24.com` |
| `POSTGRES_PASSWORD` | PG 비밀번호 | 강한 랜덤 |
| `JWT_CLIENT_SECRET` | API JWT | 강한 랜덤 |
| `IMAGE_CDN_BASE_URL` | 이미지 URL prefix | `https://${PUBLIC_HOST}/files` |
| `CAMA_CORS_ORIGINS` | CORS | `https://${PUBLIC_HOST}` |
| `FIREBASE_CREDENTIALS_PATH` | batch | `/secrets/firebase-adminsdk.json` |
| `CAMA_BATCH_FCM_DRY_RUN` | FCM | 처음 `true`, 검증 후 `false` |
| `IAMPORT_KEY` / `IAMPORT_SECRET` | 본인인증 | 운영 키 |

**의사 웹 — Docker 내부 API 주소 (중요):**

```text
CAMA_BILLIVE_BASE_URL=http://cama-plus-server:8080
```

공개 `https://{PUBLIC_HOST}` 를 넣지 않습니다 (불필요한 외부 왕복 방지).

---

## 8. Day 1 — Docker Compose 4서비스 (6GB 튜닝)

서버 디렉터리 예: `/opt/cama/deploy` 에 `docker-compose.cafe24.yml`, `postgres-init/`, `.env.cafe24` 배치.  
JAR는 `/opt/cama/jars/`, Firebase JSON은 `/opt/cama/secrets/` (compose의 `../jars`, `../secrets` 경로와 맞출 것).

```bash
cd /opt/cama/deploy
cp env.cafe24.example .env.cafe24   # 최초 1회, 편집
docker compose -f docker-compose.cafe24.yml --env-file .env.cafe24 up -d
docker compose -f docker-compose.cafe24.yml ps
docker compose -f docker-compose.cafe24.yml logs -f --tail=100
```

메모리 limit 요약 (6GB VPS, `deploy/docker-compose.cafe24.yml`):

| 서비스 | memory limit |
|--------|----------------|
| postgres | 1024m |
| cama-plus-server | 1536m |
| cama-back-batch | 512m |
| cama-doctor-web | 512m |

**batch는 외부 포트 publish 하지 않음.**

DB 초기화:

- 최초 기동 시 `cama`, `cama_doctor` DB 생성 스크립트는 compose `postgres` init 참고
- 기존 데이터 있으면 `pg_restore` 별도 수행

---

## 9. Day 1 — Nginx 경로 분기 (단일 무료도메인)

템플릿: `deploy/nginx/cama-single-host.conf.example`

핵심 location:

| location | upstream |
|----------|----------|
| `/api/` | `http://127.0.0.1:8080` |
| `/files/` | `http://127.0.0.1:8080` |
| `/proxy/` | `http://127.0.0.1:8081` |
| `/actuator/` (doctor) | `http://127.0.0.1:8081` (필요 시) |
| `/assets/`, `/webview/*`, `/coaching/*`, `/wellbeing`, `/help`, `/content/*` | **정적** `/opt/cama/www/react-app` (react-app-dawplus) |
| `/` (나머지) | `http://127.0.0.1:8081` (의사 웹) |

환자 WebView SPA 배포 절차: **[CAFE24_REACT_APP_DEPLOY.md](CAFE24_REACT_APP_DEPLOY.md)** (`deploy-react-app-cafe24.ps1 -Build -ApplyNginx`).

적용:

```bash
sudo cp /opt/cama/deploy/nginx/cama-single-host.conf.example /etc/nginx/sites-available/cama
# server_name 을 실제 PUBLIC_HOST 로 수정
sudo ln -sf /etc/nginx/sites-available/cama /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**HTTPS:** 무료도메인은 카페24 측 기본 HTTPS가 있을 수 있습니다.  
`curl -v https://{PUBLIC_HOST}/api/` 로 확인 후, 인증서가 VPS까지 필요하면 Let's Encrypt(`certbot`)를 Nginx에 추가합니다.

---

## 10. Day 2 — 검증 체크리스트

### 10.1 인프라

- [ ] `https://{PUBLIC_HOST}/` — 의사 로그인 페이지
- [ ] `https://{PUBLIC_HOST}/actuator/health` (doctor-web, 노출한 경우)
- [ ] `https://{PUBLIC_HOST}/api/` — 401 또는 health (인증 없이 protected면 401 정상)
- [ ] batch `:8082` — 외부에서 접근 **불가** 확인

### 10.2 API (PowerShell 또는 curl)

```bash
# 로그인 (DB에 계정 있을 때)
curl -s -X POST "https://{PUBLIC_HOST}/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"principal":"localpatient","credentials":"Test1234!","firebase":null}'
```

- [ ] `POST /api/auth` 성공
- [ ] `GET /api/account/me` (Bearer)
- [ ] `GET /api/notification/recent`

### 10.3 의사 웹

- [ ] 브라우저 `https://{PUBLIC_HOST}/login`
- [ ] 로그인 후 목록 — Network 탭에서 `/proxy/api/...` → 200

### 10.4 환자 앱

- [ ] `stage.ts` PROD URL 반영 빌드
- [ ] 실기기/에뮬레이터 로그인
- [ ] 트랙·일정·이미지 업로드

### 10.5 FCM (3단계)

1. `CAMA_BATCH_FCM_DRY_RUN=true` 로 batch 기동 → job 로그에 targets 확인  
2. 앱 로그인 후 `firebase_token` DB 반영 확인  
3. `CAMA_BATCH_FCM_DRY_RUN=false` → check1 등 job 실행  
4. 실기기 푸시 수신  
5. 실패 시: Firebase 프로젝트 일치, `UNREGISTERED` 토큰, [FCM curl 테스트](https://help.cafe24.com) (가상서버 아웃바운드)

---

## 11. 프로필·포트 참고

| 컴포넌트 | Spring profile | 컨테이너 포트 |
|----------|----------------|---------------|
| cama-plus-server | `cafe24` | 8080 |
| cama-back-batch | `cafe24` | 8082 |
| cama-doctor-web | `cafe24` | 8081 |

로컬 개발: `local-cafe24` ([README](../README.md))

---

## 12. 하지 말아야 할 것

| 항목 | 이유 |
|------|------|
| `api.{ID}.cafe24.com` 가정 | 공식적으로 무료 3차 서브도메인 불가 |
| VPS에서 `mvn package` / `gradle build` | 6GB OOM 위험 |
| batch 포트 공인 개방 | 보안·불필요 |
| `CAMA_BILLIVE_BASE_URL`에 공개 URL | Docker 내부 서비스명 사용 |
| Firebase JSON을 Git에 커밋 | 유출 위험 |
| Gabia 원본(`nicecog/cama-billive`)에 Cafe24 전용 변경 혼입 | 디렉터리 분리 유지 |

---

## 13. 문제 해결 빠른 표

| 증상 | 확인 |
|------|------|
| Docker에서 외부 API 실패 | MTU 1450, `daemon.json` |
| 502 Bad Gateway | 컨테이너 기동 여부, `docker ps`, Nginx upstream 포트 |
| CORS 오류 | `CAMA_CORS_ORIGINS`에 `https://{PUBLIC_HOST}` |
| 이미지 깨짐 | `IMAGE_CDN_BASE_URL` = `https://{PUBLIC_HOST}/files` |
| FCM targets=0 | DB `firebase_token`, 앱 로그인·토큰 등록 |
| Java 실행 permission denied | 카페24 보안 설정 `chmod 700 java` |

---

## 14. Cursor AI로 내일 진행하는 방법

1. 이 문서 경로를 열어 둔 채: `F:\cama_pjt\cama-cafe24\docs\CAFE24_DEPLOYMENT_GUIDE.md`
2. 구매 후 **`{PUBLIC_HOST}`**, **`{VPS_IP}`** 를 채워 달라고 요청
3. SSH 출력·`docker logs`·`nginx -t` 결과를 붙여넣으면 단계별 디버깅
4. `deploy/` 템플릿 수정·추가도 같은 repo에서 진행

---

## 15. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-05-30 | 최초 작성 (자이언트 플러스, 4컨테이너, 무료도메인 경로 분기, FCM 포함) |
