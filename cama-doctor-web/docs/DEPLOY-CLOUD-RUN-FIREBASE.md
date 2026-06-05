# Cloud Run + Firebase Hosting 배포 가이드

Spring Boot 앱은 **Firebase Hosting에 직접 올릴 수 없습니다.**  
대신 **Cloud Run**에 컨테이너로 배포하고, Firebase Hosting에서 **모든 요청을 Cloud Run 서비스로 리라이트**합니다.

## 사전 준비

1. **Google Cloud 프로젝트** = **Firebase 프로젝트**와 동일하게 맞춤 (Firebase 콘솔에서 GCP 연동).
2. 로컬에 설치: `gcloud`, `docker`, `firebase-tools` (`npm i -g firebase-tools`).
3. **Artifact Registry**에 Docker 저장소 생성 (예: `cama-docker`, 리전 `asia-northeast3`).
4. **Cloud SQL(PostgreSQL)** 또는 접근 가능한 PostgreSQL — 연결 문자열을 Cloud Run 환경 변수로 설정.

## 1. Docker 이미지 빌드 및 Cloud Run 배포 (수동)

프로젝트 루트(`cama-doctor_web`)에서:

```bash
# 변수 설정 (본인 값으로 변경)
export PROJECT_ID=your-gcp-project-id
export REGION=asia-northeast3
export SERVICE=cama-doctor-web
export AR_REPO=cama-docker
export IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${AR_REPO}/${SERVICE}:$(date +%Y%m%d-%H%M)"

gcloud config set project "${PROJECT_ID}"

docker build -t "${IMAGE}" .
docker push "${IMAGE}"

gcloud run deploy "${SERVICE}" \
  --image="${IMAGE}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --set-env-vars="SPRING_PROFILES_ACTIVE=production" \
  --set-env-vars="SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:5432/DBNAME" \
  --set-env-vars="SPRING_DATASOURCE_USERNAME=postgres" \
  --set-env-vars="SPRING_DATASOURCE_PASSWORD=SECRET" \
  --set-env-vars="CAMA_BILLIVE_BASE_URL=https://api.billive.me" \
  --set-env-vars="CAMA_FIREBASE_ENABLED=true" \
  --set-env-vars="CAMA_FIREBASE_CREDENTIALS_PATH=/secrets/firebase-sa.json"
```

**Firebase Admin JSON**은 이미지에 넣지 말고, Cloud Run **시크릿 마운트** 권장:

```bash
# Secret Manager에 JSON 업로드 후
gcloud run deploy "${SERVICE}" ... \
  --update-secrets=/secrets/firebase-sa.json=firebase-sa:latest
```

`application-cloudrun.yml`의 `cama.firebase.credentials-path`가 위 경로와 일치해야 합니다.

## 2. Firebase Hosting 연동

1. `firebase.json`의 `run.serviceId`·`run.region`을 실제 Cloud Run 서비스 이름·리전과 동일하게 수정합니다.
2. `.firebaserc` 생성: `.firebaserc.example`을 복사해 프로젝트 ID 설정.

```bash
cp .firebaserc.example .firebaserc
# 편집: your-gcp-firebase-project-id
firebase login
firebase deploy --only hosting
```

Firebase CLI가 Cloud Run과 같은 GCP 프로젝트에서 **Hosting → Run 리라이트** 권한을 갖도록 IAM을 확인하세요.

## 3. Thymeleaf / 프록시 / 쿠키

- **HTTPS·도메인**: Cloud Run 기본 URL 또는 커스텀 도메인(Firebase Hosting 도메인) 사용 시 `server.forward-headers-strategy: framework`로 X-Forwarded-* 처리 (`application-cloudrun.yml` 반영).
- **`/proxy/**`**: 브라우저 동일 출처로 Billive 프록시가 동작합니다. Hosting이 전부 Run으로 넘기므로 경로 변경 없음.
- **세션 쿠키**: HTTPS에서 `Secure` 필요 시 `server.servlet.session.cookie.secure=true` 등을 프로파일에 추가 검토.

## 4. Cloud Build (선택)

`cloudbuild.yaml`의 `_REGION`, `_SERVICE`, `_REPO`, 치환 변수를 수정한 뒤:

```bash
gcloud builds submit --config=cloudbuild.yaml .
```

배포 후 Cloud Run 콘솔에서 **DB·Firebase 시크릿·메모리**를 추가로 조정합니다.

## 5. 파일 요약

| 파일 | 설명 |
|------|------|
| `Dockerfile` | Gradle로 `bootJar` 후 JRE 17 이미지 실행, 기본 `SPRING_PROFILES_ACTIVE=production` |
| `.dockerignore` | 빌드 컨텍스트 축소 |
| `application-production.yml` | 운영 공통(DB, Actuator, graceful shutdown 등) |
| `application-cloudrun.yml` | 프로파일 `cloudrun` 사용 시 `production` include (선택) |
| `firebase.json` | Hosting → Cloud Run 전체 리라이트 |
| `.firebaserc.example` | Firebase 프로젝트 ID 템플릿 |
| `public/` | Hosting용 최소 정적 파일 (리라이트가 우선이면 거의 사용 안 함) |
| `cloudbuild.yaml` | Artifact Registry + Cloud Run 배포 예시 |
