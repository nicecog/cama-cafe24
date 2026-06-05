# cama-cafe24 — Cafe24 호스팅용 서버 소스

Gabia(`nicecog/cama-billive`)·원본 `F:\cama_pjt\cama-plus-server` 등과 **분리**된 디렉터리입니다.

| 프로젝트 | 설명 | 포트(로컬) |
|----------|------|------------|
| `cama-plus-server` | REST API (환자·의사 Billive API) | **8080** |
| `cama-back-batch` | 스케줄·FCM 배치 | **8082** |
| `cama-doctor-web` | 의사 웹 BFF (Thymeleaf + `/proxy` → API) | **8081** |
| `react-app-dawplus` | 신규 환자 Web SPA ([DawPlus/React-App](https://github.com/DawPlus/React-App) 클론, **별도 Git**) | dev **5173** |

신규 React 앱 분석: [docs/REACT_APP_DAWPLUS_ANALYSIS.md](docs/REACT_APP_DAWPLUS_ANALYSIS.md)  
**Cafe24 SPA 배포:** [docs/CAFE24_REACT_APP_DEPLOY.md](docs/CAFE24_REACT_APP_DEPLOY.md) · `deploy/scripts/deploy-react-app-cafe24.ps1`

## 스택

- Spring Boot **3.5.0**
- Java **21**
- PostgreSQL **17** (로컬: `docker-compose.local.yml`, 포트 **55432**)
  - `cama` — API·배치 공용
  - `cama_doctor` — 의사 웹 세션/로컬 JPA 전용

## 빌드

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"

cd cama-plus-server
mvn package -DskipTests

cd ..\cama-back-batch
mvn package -DskipTests

cd ..\cama-doctor-web
.\gradlew.bat bootJar -x test
```

## 로컬 실행

```powershell
cd F:\cama_pjt\cama-cafe24
docker compose -f docker-compose.local.yml up -d

# 터미널 1 — API :8080
cd cama-plus-server
.\scripts\run-local-cafe24.ps1

# 터미널 2 — batch :8082
cd ..\cama-back-batch
.\scripts\run-local-cafe24.ps1

# 터미널 3 — 의사 웹 :8081 (API 기동 후)
cd ..\cama-doctor-web
.\scripts\ensure-doctor-db.ps1
.\scripts\run-local-cafe24.ps1
# 다른 터미널: .\scripts\smoke-test-local.ps1
```

**운영(Cafe24) 환자 앱:** `stage.ts` → `PROD`, API `https://camaplus.cafe24.com/`  
**테스트 APK:** `dist/cama-plus-cafe24-1.2.4-release.apk` (JDK 17 빌드)  
**재시작 시 진행 상황:** [docs/CAFE24_PROGRESS_HANDOFF.md](docs/CAFE24_PROGRESS_HANDOFF.md)

로컬 스택만 쓸 때: `cama-plus-app` `LOCAL` + `scripts/run-local-cafe24.ps1` (localhost:8080).

## 문서

- **[Cursor AI 핸드오프 (재시작 시 첫 문서)](docs/CAFE24_CURSOR_HANDOFF.md)** ← 완료 내역·APK 테스트·TO-BE
- **[작업 현황 · 주의사항 · TO-BE](docs/CAFE24_WORK_STATUS_AND_TODO.md)**
- **[링크 · 테스트 가이드 (TC)](docs/CAFE24_TEST_GUIDE.md)** ← APK 실접속·curl·adb
- **[배치 스케줄 (cama-back-batch)](docs/CAFE24_BATCH_SCHEDULE.md)**
- **[Cafe24 VPS 배포 가이드](docs/CAFE24_DEPLOYMENT_GUIDE.md)** ← 최초 배포 시
- [API·라이브러리 변경 목록](docs/CAFE24_API_MIGRATION.md)
- 운영 템플릿: [`deploy/`](deploy/) (`docker-compose.cafe24.yml`, `env.cafe24.example`, Nginx 예시)
- [호스팅 의사결정](../nicecog/cama-billive/docs/BILLIVE_HOSTING_DECISION_20260530.md) *(nicecog 경로)*

## Gabia / 원본

- API·배치 Gabia: `F:\cama_pjt\nicecog\cama-billive`
- 의사 웹 원본: `F:\cama_pjt\cama-doctor_web` (Boot 3.2 / JDK 17)
- 본 디렉터리 변경은 위 원본에 자동 반영되지 않습니다.
