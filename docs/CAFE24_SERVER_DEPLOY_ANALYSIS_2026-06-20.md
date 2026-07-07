# Cafe24 cama-plus-server 배포 분석 (2026-06-20)

> **작성일:** 2026-06-20  
> **워크스페이스:** `F:\cama_pjt\cama-cafe24`  
> **Git:** [nicecog/cama-cafe24](https://github.com/nicecog/cama-cafe24)  
> **목적:** 로컬/Git `cama-plus-server`와 Cafe24 VPS에 배포된 API 서버가 동일한지 분석.

**연관 문서**

- [CAFE24_SESSION_HANDOFF_2026-06-20.md](CAFE24_SESSION_HANDOFF_2026-06-20.md)
- [CAFE24_BATCH_SCHEDULE.md](CAFE24_BATCH_SCHEDULE.md)
- [CAFE24_DEPLOYMENT_GUIDE.md](CAFE24_DEPLOYMENT_GUIDE.md)

---

## 1. 한 줄 요약

| 항목 | 로컬 (Git) | Cafe24 VPS |
|------|------------|------------|
| 최신 커밋 (server 변경) | `0be91a5` (2026-06-20) | 동일 기능 JAR 배포됨 |
| 이후 커밋 (`3251b95`, `145a8df`~`be16641`) | **server 변경 없음** | 재배포 없음 |
| 로컬 미커밋 diff | **없음** | — |
| 배포 JAR | — | `cama-back-1.0-SNAPSHOT.jar` (2026-06-20 **14:01** KST) |

**결론:** 로컬 `cama-plus-server` = GitHub `main` = Cafe24에 올라간 API 서버 (0be91a5 기준).

---

## 2. VPS 실제 배포 상태

| 항목 | 값 |
|------|-----|
| JAR 경로 | `/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar` (~163MB) |
| JAR 빌드 시각 | 2026-06-20 14:01:24 KST |
| 컨테이너 | `cama-plus-server` (`eclipse-temurin:21-jre-jammy`) |
| Spring 프로필 | `cafe24` |
| 컨테이너 기동 | 2026-06-20 14:01 KST (분석 시점 기준 2주 가동) |
| 포트 | 호스트 `127.0.0.1:8080` → nginx `https://camaplus.cafe24.com/api/*` |

### JAR 내 포함 기능 (마커 클래스 확인)

| 기능 | JAR 내 클래스/리소스 |
|------|----------------------|
| FCM 테스트 모드 | `FcmTestModeMapper.xml`, `FcmTestModeServiceImpl` |
| 환자 계정 관리 | `MonitorPatientAccountServiceImpl` |
| Vital API | `VitalRestController` |
| 태블릿 QR | `TabletQrTokenService` |
| APK 관리 | `DoctorApkRestController`, `ApkStorageService` |
| 모니터링 API | `MonitoringRestController` |

점검 스크립트: `deploy/scripts/vps-analyze-server-deploy.py`

---

## 3. Git 이력 vs 배포 시점

`cama-plus-server` 마지막 변경 커밋:

```
0be91a5  feat: 환자계정·FCM·네이티브브릿지·태블릿·배포 안정화  (2026-06-20 14:41)
3fa1c59  fix: Super Admin Cafe24 deploy and monitoring screen bugs
4688602  feat: 신규 관리자/webview 추가
42a2225  fix: resolve 403 on doctor/monitoring APIs and add admin service endpoints
b32e870  Initial commit: Cafe24 VPS 운영 소스 전체
```

| 시각 | 이벤트 |
|------|--------|
| 2026-06-20 **14:01** KST | VPS JAR 빌드·컨테이너 재시작 |
| 2026-06-20 **14:41** KST | Git 커밋 `0be91a5` |

JAR가 커밋보다 약 40분 먼저 올라갔지만, JAR 안에는 `0be91a5` 기능이 모두 포함됨 → **VPS 먼저 배포 후 Git 커밋** 흐름으로 추정.

이후 커밋은 `cama-plus-server`를 변경하지 않음:

- `3251b95` — 일정 피커·FCM 시간 형식 (`react-app-dawplus`만)
- `145a8df`~`be16641` — TTS 브릿지, 코칭 UI 등 (`cama-plus-app`, `react-app-dawplus`)

---

## 4. 배포 아키텍처 (Cafe24)

```text
로컬 cama-plus-server/
    ↓ deploy/scripts/make-server-src-zip.py
deploy/cama-plus-server-src.zip
    ↓ VPS 업로드 (vps-rebuild-server-jar.py / vps-deploy-server-src.py)
    ↓ Docker maven:3.9-eclipse-temurin-21 → mvn package
/opt/cama/jars/cama-back-1.0-SNAPSHOT.jar
    ↓ docker-compose volume mount
cama-plus-server 컨테이너 (:8080, profile=cafe24)
    ↓ nginx reverse proxy
https://camaplus.cafe24.com/api/*
```

**관련 파일**

| 파일 | 용도 |
|------|------|
| `deploy/docker-compose.cafe24.yml` | `cama-plus-server` 서비스 정의 |
| `deploy/scripts/make-server-src-zip.py` | 소스 ZIP 생성 |
| `deploy/scripts/vps-rebuild-server-jar.py` | VPS에서 Maven 빌드 + 재시작 |
| `deploy/scripts/vps-deploy-server-src.py` | 소스 업로드 + 배포 |
| `deploy/scripts/vps-analyze-server-deploy.py` | 배포 JAR·클래스 분석 |

**JAR 마운트 (compose)**

```yaml
volumes:
  - ../jars/cama-back-1.0-SNAPSHOT.jar:/app/app.jar:ro
command: java -Xms512m -Xmx1536m -jar /app/app.jar --spring.profiles.active=cafe24
```

---

## 5. 다른 서비스와 비교

| 서비스 | VPS 배포 시점 | Git 최신 | 비고 |
|--------|---------------|----------|------|
| **cama-plus-server** | 2026-06-20 | `0be91a5` | **로컬·Git·VPS 일치** |
| cama-back-batch | 2026-06-12 | 별도 확인 | batch JAR이 server보다 오래됨 |
| react-app-dawplus | 2026-06-20 | `be16641` | SPA는 GitHub가 더 최신 |
| cama-plus-app | APK 별도 | `be16641` | Git만 최신, APK 재빌드 여부 별도 |
| cama-super-admin | 2026-06 중순 | `0be91a5` 근처 | Docker :8083 |

**정리:** API 서버는 6/20 이후 변경·재배포 없음. 환자 SPA/앱은 GitHub가 더 앞서 있음.

---

## 6. 운영 API 엔드포인트 (0be91a5 기준)

`MonitoringRestController` 등:

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/monitoring/notification/fcm-test-status` | FCM 테스트 모드 상태 |
| POST | `/api/monitoring/notification/restore-fcm-test` | 배치 일정 복원 |
| POST | `/api/monitoring/notification/send` | 관리자 FCM 수동 발송 |
| GET | `/api/monitoring/account/{acSeq}` | 환자 계정 조회 |
| PUT | `/api/monitoring/account/updateEmail` | 이메일 변경 |
| PUT | `/api/monitoring/account/updatePassword` | 비밀번호 변경 |
| — | `/api/track/vital` | Vital 기록 (VitalRestController) |
| — | `/api/doctor/apk/*` | APK 관리 (DoctorApkRestController) |
| — | `/api/tablet/qr/*` | 태블릿 QR (TabletQrRestController) |

일정 FCM 알림은 **이 API가 아니라 `cama-back-batch`** (`account_batch_schedule` + 매분 `batchCheck`)에서 처리.

---

## 7. VPS `/opt/cama/jars/` 현황 (분석 시점)

| 파일 | 수정 시각 | 용도 |
|------|-----------|------|
| `cama-back-1.0-SNAPSHOT.jar` | 2026-06-20 14:01 | API 서버 |
| `cama-batch-1.0-SNAPSHOT.jar` | 2026-06-12 23:26 | 배치·FCM 스케줄 |
| `cama-doctor-web-0.0.1-SNAPSHOT.jar` | 2026-06-06 21:39 | 의사 웹 BFF |

---

## 8. 후속 작업 (필요 시)

| 우선순위 | 항목 |
|----------|------|
| 낮음 | `cama-plus-server` 재배포 — Git과 VPS가 이미 일치 |
| 중간 | `cama-back-batch` JAR 갱신 여부 검토 (6/12 vs server 6/20) |
| 중간 | FCM 테스트 모드 복원 (`restore-fcm-test`) — 일정 알림 파이프라인 |
| 참고 | 로컬 JAR vs VPS JAR 바이트 비교는 `vps-rebuild-server-jar.py` 재실행으로 검증 가능 |

---

## 9. 분석 방법 (재현)

```powershell
cd F:\cama_pjt\cama-cafe24

# Git server 이력
git log --oneline -- cama-plus-server

# VPS JAR·클래스·컨테이너 상태
python deploy/scripts/vps-analyze-server-deploy.py

# FCM·배치 파이프라인
python deploy/scripts/vps-check-fcm-test-mode-now.py
python deploy/scripts/vps-verify-fcm-pipeline.py
```

---

*다음 세션: server 코드 변경 시 `vps-rebuild-server-jar.py`로 재배포. SPA/앱만 변경 시 server 재배포 불필요.*
