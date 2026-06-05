# 서버 배포 전 점검 체크리스트 (React → Spring 이관 프로젝트)

## 1. 빌드·실행 환경

| 항목 | 기본값 | 배포 시 |
|------|--------|---------|
| JDK | 17 | 서버/Docker 이미지에 17 이상 |
| 빌드 | `./gradlew bootJar` | CI에서 산출물 `build/libs/*.jar` |
| 운영 프로파일 | — | **`SPRING_PROFILES_ACTIVE=production`** (Dockerfile에 기본 설정됨) |
| 레거시 호환 | — | `cloudrun`만 쓰는 경우에도 `application-cloudrun.yml`이 `production`을 include |

## 2. 데이터베이스 (PostgreSQL)

| 항목 | 설명 |
|------|------|
| 필수 환경 변수 | `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` |
| DDL | 운영 기본 `validate` — 스키마는 마이그레이션(Flyway 등) 또는 사전 DDL로 맞출 것 |
| 로컬 기본 `application.yml` | `ddl-auto: update`, localhost DB — **운영에 그대로 쓰지 말 것** |

## 3. 외부 API (Billive)

| 항목 | 설명 |
|------|------|
| `CAMA_BILLIVE_BASE_URL` | 미설정 시 `https://api.billive.me` |
| 프록시 | 브라우저는 `/proxy/**` → 동일 도메인으로 접속해야 동작 (Nginx에서 루트만 프록시하면 됨) |

## 4. Firebase

| 항목 | 설명 |
|------|------|
| `CAMA_FIREBASE_ENABLED` | `true`로 켠 경우에만 Admin 초기화 |
| `CAMA_FIREBASE_CREDENTIALS_PATH` | **클래스패스** `firebase/xxx.json` 또는 **절대경로** `/opt/cama/sa.json` (배포 시 절대경로 권장) |
| 주의 | JAR 안에 비밀 JSON 넣지 말고, 서버 파일 또는 Secret 마운트 사용 |

## 5. HTTPS·리버스 프록시 (Nginx 등)

| 항목 | 설명 |
|------|------|
| 헤더 | `X-Forwarded-Proto`, `X-Forwarded-For` 전달 — `forward-headers-strategy: framework` 적용됨 |
| 세션 쿠키 | HTTPS만 쓸 때 `SERVER_SESSION_COOKIE_SECURE=true` 권장 |

## 6. 헬스체크 (Actuator)

| 경로 | 용도 |
|------|------|
| `GET /actuator/health` | 로드밸런서·오케스트레이터 헬스 |
| `GET /actuator/health/liveness` | K8s/Cloud Run 프로브 (production 프로파일) |

Security에서 `/actuator/health/**` 는 허용됨.

## 7. Docker

| 항목 | 설명 |
|------|------|
| `Dockerfile` | `SPRING_PROFILES_ACTIVE=production` 기본 |
| `.dockerignore` | `docs`, `public` 등 제외 — 이미지 슬림화 |

## 8. 정적·페이지 기능 점검

| 영역 | 상태 |
|------|------|
| 로그인 | Billive `POST /api/auth/doctor` (프록시) |
| 치료정보 CRUD·목록·건수 | `cama-api.js` 래퍼 + Billive 동일 경로 |
| 환자 모니터링·서비스 승인 | 동일 |
| 공개 웹뷰 | `/webview/treatment/{seq}` |
| 볼거리 | API 미정 — UI만 존재 |

## 9. 보안 참고

- CSRF는 현재 비활성(기존 SPA/프록시 패턴). 서버 측 폼 POST를 추가하면 검토 필요.
- 관리 페이지는 Billive `api_key` 토큰 + (선택) Firebase Bearer 검증 구조.

## 10. 배포 후 스모크 테스트

1. `GET /actuator/health` → `UP`
2. `GET /login` → 200
3. 로그인 후 치료정보 목록·`/proxy` 요청 정상
4. DB 연결·Billive 타임아웃 로그 없음

자세한 Cloud Run + Firebase Hosting 절차는 `DEPLOY-CLOUD-RUN-FIREBASE.md`, 일반 서버는 이전 안내(systemd + Nginx)와 함께 본 문서를 따르면 됩니다.
