# Brevo 메일 · Cafe24 DNS — 재개 (DNS 등록 완료)

> **작성:** 2026-06-03 · **갱신:** 2026-06-04  
> **상태:** Cafe24 DNS **TXT·CNAME·DMARC 등록 완료** (사용자 확인) · 공개 DNS 조회 OK  
> **다음:** Brevo **SMTP key 재발급** → VPS `SPRING_MAIL_PASSWORD` 갱신 → 발송 테스트  
> **2026-06-04 저녁:** `SPRING_MAIL_USERNAME=happycog@gmail.com` 반영·DB `happycog` 이메일 동기화 완료. SMTP 로그인 **535 Authentication failed** — 키 재발급 필요.

> **관련:** [CAFE24_DNS_BREVO_CLICK_GUIDE.md](CAFE24_DNS_BREVO_CLICK_GUIDE.md), [BREVO_CAMAPLUS_COM_SETUP.md](BREVO_CAMAPLUS_COM_SETUP.md)

---

## 1. 오늘까지 완료된 것

| 영역 | 상태 |
|------|------|
| 발신 도메인 방향 | `camaplus.com` (`.me` 아님) — 코드·예시 env 반영 |
| Brevo SMTP key | VPS `/opt/cama/deploy/.env.cafe24`에 `SPRING_MAIL_PASSWORD` 저장 (`chmod 600`) |
| 메일 스위치 | `CAMA_MAIL_ENABLED=true`, `CAMA_MAIL_FROM=noreply@camaplus.com` |
| SMTP 호스트 | `smtp-relay.brevo.com:587` |
| API 서버 | `cama-plus-server` 기동 중 (메일 env 로드됨) |
| 앱·API·WebView·로그인 ID 등 | 이전 세션 완료 — [CAFE24_SESSION_HANDOFF_2026-06-03.md](CAFE24_SESSION_HANDOFF_2026-06-03.md) |

---

## 2. DNS 등록 완료 (2026-06-04)

Cafe24 `camaplus.com` DNS — **4건 반영·전파 확인** (로컬 `nslookup`):

| 레코드 | 조회 결과 |
|--------|-----------|
| TXT `camaplus.com` | `brevo-code:89963c7a5e9391ff22611fbae51929b2` ✅ |
| CNAME `brevo1._domainkey` | → `b1.camaplus-com.dkim.brevo.com` ✅ |
| CNAME `brevo2._domainkey` | → `b2.camaplus-com.dkim.brevo.com` ✅ |
| TXT `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` ✅ |

> Brevo 화면의 brevo-code 값이 위와 **다르면** Brevo 표시값 기준으로 TXT만 재확인.

---

## 3. 아직 할 것 (다음 단계)

| # | 작업 | 담당 |
|---|------|------|
| 1 | Brevo → **Domains** → `camaplus.com` → **Authenticate** / Verified | Brevo UI |
| 2 | Brevo → **Senders** → `noreply@camaplus.com` DKIM·DMARC ✅ | Brevo UI |
| 3 | VPS `SPRING_MAIL_USERNAME` = **Brevo 가입 이메일** (`happycog@gmail.com`) | VPS ✅ |
| 4 | `cama-plus-server` 컨테이너 재시작 (env 반영) | VPS ✅ |
| 5 | Brevo → SMTP & API → **새 SMTP key** → VPS `SPRING_MAIL_PASSWORD` 갱신 | Brevo + VPS |
| 6 | `POST /api/public/patient/recover/password` 로 **발송 1통** 테스트 | 앱/API |

---

## 4. 다음 10분 체크리스트

```text
[x] 1. Cafe24 DNS TXT·CNAME·DMARC 등록 (완료)
[x] 2. 공개 DNS 조회 (brevo-code, DKIM×2, _dmarc)
[ ] 3. Brevo Domains → camaplus.com Authenticated
[ ] 4. Brevo Senders → noreply@camaplus.com (DKIM/DMARC 녹색)
[x] 5. VPS SPRING_MAIL_USERNAME = happycog@gmail.com
[x] 6. VPS cama-plus-server 재기동
[ ] 7. Brevo SMTP key 재발급 → VPS SPRING_MAIL_PASSWORD 갱신
[ ] 8. recover/password 로 메일 1통 테스트 (happycog@gmail.com)
```

### VPS 메일 env만 다시 넣을 때

```bash
# VPS — SMTP_USER는 Brevo 로그인 이메일
SMTP_USER='happycog@gmail.com' SMTP_PASS='(Brevo에서 새로 발급한 xsmtpsib-... 키)' python deploy/scripts/vps-update-mail-env.py
chmod 600 /opt/cama/deploy/.env.cafe24
# docker-compose ContainerConfig 오류 시: cama-plus-server는 docker run으로 재기동 (대화 기록·스크립트 참고)
```

로컬 스크립트: `deploy/scripts/vps-update-mail-env.py` (VPS `/tmp`에 업로드 후 실행).

---

## 5. VPS 참고 (비밀값 없음)

| 항목 | 값 |
|------|-----|
| env 파일 | `/opt/cama/deploy/.env.cafe24` |
| SSH | `camaplus-vps` |
| API 컨테이너 | `cama-plus-server` (`127.0.0.1:8080`) |
| Postgres | `c6fdf0e55844_cama-cafe24-postgres` (이름은 `docker ps`로 확인) |

**주의:** `docker-compose up` 시 `ContainerConfig` 오류가 나면 postgres를 건드리지 말고, **서버 컨테이너만** `docker run`으로 재기동 (이전 세션과 동일).

---

## 6. 보안

- SMTP key는 채팅에 여러 번 노출됨 → DNS·메일 설정 완료 후 Brevo에서 **키 재발급** 권장.
- `.env.cafe24`는 **Git에 커밋하지 않음**.

---

## 7. Cursor 재개 시 한 줄

> “DNS 등록 완료 — Brevo Authenticate + VPS `SPRING_MAIL_USERNAME` + 메일 발송 테스트.”

---

## 8. 신규 앱 소스 (2026-06-04)

- **SMTP:** 위 §1~§5 상태 유지 — 추가 작업 없음(일시 중단).
- **신규 React 앱:** [DawPlus/React-App](https://github.com/DawPlus/React-App) → 로컬 `cama-cafe24/react-app-dawplus/` (기존 `cama-plus-app` 등 Git **수정 안 함**).
- 분석 문서: [REACT_APP_DAWPLUS_ANALYSIS.md](REACT_APP_DAWPLUS_ANALYSIS.md)
