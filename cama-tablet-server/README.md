# cama-tablet-server

태블릿 QR 대시보드 전용 Spring Boot API (JDK 21).

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/tablet/health` | 헬스체크 |
| POST | `/api/tablet/scan` | `{ "payload": "<QR raw>" }` → 대시보드 집계 |
| POST | `/api/tablet/qr/issue` | 로컬 개발용 v2 QR 발급 (`allow-dev-issue=true`) |
| GET | `/api/tablet/dashboard/{accountSeq}` | 환자 대시보드 재조회 |

## 실행

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

`application-local.yml` — 기존 `cama` PostgreSQL 연결.

## QR 테스트 페이로드

```json
{"v":1,"loginId":"cama","accountSeq":121}
```
