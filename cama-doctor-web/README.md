# cama-doctor-web (Cafe24)

`F:\cama_pjt\cama-doctor_web` 를 복사·업그레이드한 의사용 웹 BFF입니다.

| 항목 | 원본 (`cama-doctor_web`) | 본 프로젝트 |
|------|--------------------------|-------------|
| Spring Boot | 3.2.5 | **3.5.0** |
| Java | 17 | **21** |
| 로컬 DB | `localhost:5432/cama_doctor` (postgres/postgres) | **55432/cama_doctor** (cama/cama_local_dev) |
| Billive API | `https://api.billive.me` | 로컬 **`http://127.0.0.1:8080`** (`local-cafe24`) |

## 로컬 실행

```powershell
# 선행: cama-plus-server :8080
.\scripts\ensure-doctor-db.ps1
.\scripts\run-local-cafe24.ps1
```

브라우저: http://localhost:8081/login

## 프로필

| 프로필 | 용도 |
|--------|------|
| `local-cafe24` | PC 개발 |
| `cafe24` | VPS 운영 (`DOCTOR_DB_*`, `CAMA_BILLIVE_BASE_URL`) |
| `production` | 공통 운영 설정 |
| `cloudrun` | `production` 그룹 포함 |
