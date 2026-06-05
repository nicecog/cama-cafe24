# Brevo SMTP + Cafe24 도메인 `camaplus.com` 설정 가이드

> **최종 갱신:** 2026-06-03  
> **발신 도메인:** `camaplus.com` (Cafe24에서 **유료 구매** — Brevo 인증 가능)  
> **API/앱 URL:** `https://camaplus.cafe24.com` (기존 무료 서브도메인, 변경 없음)  
> **진행:** Cafe24 TXT `@` 입력 불가 → 고객센터 문의 후 **내일 DNS 재시도** — [CAFE24_BREVO_RESUME_2026-06-04.md](CAFE24_BREVO_RESUME_2026-06-04.md)

---

## 0. AI/Cursor가 대신 할 수 없는 것

| 작업 | 이유 |
|------|------|
| Brevo 로그인·도메인 추가·SMTP key 발급 | 본인 계정·2FA 필요 |
| Cafe24 도메인 DNS 레코드 입력 | Cafe24 관리자 로그인 필요 |

아래 순서대로 **직접** 진행하면 됩니다. DNS·SMTP key 값을 알려주시면 VPS `.env` 반영·서버 재시작은 이어서 도와드릴 수 있습니다.

---

## 1. 도메인 역할 정리

| 도메인 | 용도 | Brevo |
|--------|------|-------|
| `camaplus.cafe24.com` | VPS HTTPS, API, 앱 | ❌ 무료도메인 — **발신 인증 불가** |
| **`camaplus.com`** | **메일 발신** (`noreply@camaplus.com`) | ✅ **여기서 DKIM/DMARC** |
| `camaplus.me` | (구 계획) | 사용 안 함 → **camaplus.com으로 통일** |

---

## 2. Brevo — 도메인 인증 (약 15~30분)

### 2.1 로그인

1. https://app.brevo.com 접속 (무료 플랜 가능)
2. 없으면 가입: https://www.brevo.com

### 2.2 SMTP key 발급 (API key 아님)

1. **Settings** (톱니) → **SMTP & API**
2. **SMTP** 탭
3. **Generate a new SMTP key** (또는 기존 key — **채팅/Git에 붙여넣지 말 것**)
4. 복사해 안전한 곳에 저장 → VPS `SPRING_MAIL_PASSWORD` 에만 사용

| 항목 | 값 |
|------|-----|
| SMTP server | `smtp-relay.brevo.com` |
| Port | `587` (STARTTLS) |
| Username | Brevo **가입 이메일** |
| Password | **SMTP key** (`xsmtpsib-...`) |

### 2.3 도메인 추가

1. **Settings** → **Senders, Domains & Dedicated IPs** → **Domains**
2. **Add a domain** → `camaplus.com` 입력
3. 인증 방식 선택:
   - **Automatic** — DNS가 Cloudflare 등 지원 호스트면 자동 (Cafe24는 보통 **Manual**)
   - **Manual** — Cafe24 DNS에 직접 레코드 추가 (아래 §3)

### 2.4 Brevo가 보여 주는 DNS 레코드 (Manual 시)

화면에 표시되는 값은 **계정마다 다릅니다.** 아래는 **형태 예시**이며, Brevo 화면 값을 그대로 복사해 넣으세요.

| 용도 | 타입 | 호스트(이름) | 값 |
|------|------|-------------|-----|
| 도메인 소유 확인 (Brevo code) | TXT | `@` 또는 `camaplus.com` | `brevo-code:xxxxx...` (Brevo 표시값) |
| DKIM | TXT 또는 CNAME | `mail._domainkey` | Brevo 표시값 전체 |
| DMARC (권장) | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

- DKIM이 **CNAME 2개**로 나오면 Brevo 안내대로 2개 모두 추가
- 인증 완료까지 **수 분~48시간** (DNS 전파)

### 2.5 발신자(Sender) 등록

1. **Senders, Domains & IPs** → **Senders** → **Add a sender**
2. 예시:
   - Email: `noreply@camaplus.com`
   - Name: `CAMA Plus`
3. 도메인 인증 전이면 이메일 확인 링크가 올 수 있음 → 인증 후 **DKIM ✅ / DMARC ✅** 확인

---

## 3. Cafe24 — DNS 레코드 추가

### 3.1 관리자 진입

1. Cafe24 호스팅/도메인 관리
2. **camaplus.com** → **DNS 설정** / **네임서버·DNS 레코드 관리**

(메뉴명은 상품에 따라 `도메인 연결` / `DNS 관리` 등으로 다를 수 있음)

### 3.2 Cafe24에 넣을 값 (Brevo 화면 그대로 — 4건)

**경로:** 나의 서비스 관리 → 도메인관리 → 도메인 부가서비스 → **DNS 관리** → `camaplus.com` → **설정하기**

#### ① Brevo code (TXT)

메뉴: **TXT 관리** → TXT 추가

| Cafe24 항목 | 입력값 |
|-------------|--------|
| 호스트 / 이름 | `@` 가 안 되면 **비움** 또는 `camaplus.com` (Cafe24 안내 따름) |
| 값 / TXT | `brevo-code:89963c7a5e9391ff22611fbae51929b2` |

#### ② DKIM 1 (CNAME)

메뉴: **별칭(CNAME) 관리** → CNAME 추가

| Cafe24 항목 | 입력값 |
|-------------|--------|
| 도메인 별칭 (호스트) | `brevo1._domainkey` |
| 실제 도메인명 (가리킬 대상) | `b1.camaplus-com.dkim.brevo.com` |

#### ③ DKIM 2 (CNAME)

| Cafe24 항목 | 입력값 |
|-------------|--------|
| 도메인 별칭 (호스트) | `brevo2._domainkey` |
| 실제 도메인명 (가리킬 대상) | `b2.camaplus-com.dkim.brevo.com` |

- 값 끝에 **마침표(.)** 가 붙어 있으면 Cafe24에서는 **마침표 제거** 후 저장 (Cafe24 SSL/CNAME FAQ 기준)
- 호스트에 `camaplus.com` 이 **자동으로 붙는 UI**면 `brevo1._domainkey` 만 입력 (전체 FQDN 중복 입력 금지)

#### ④ DMARC (TXT)

메뉴: **TXT 관리** → TXT 추가

| Cafe24 항목 | 입력값 |
|-------------|--------|
| 호스트 / 이름 | `_dmarc` |
| 값 / TXT | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

- **TTL:** 기본(3600) 또는 300
- 저장 후 Brevo **Domains** → `camaplus.com` → **Verify** / 새로고침 (반영 30분~48시간)

### 3.3 (선택) 웹/API용 — 나중에

메일만 쓸 때는 **MX 레코드는 Brevo가 요구하지 않음** (SMTP 발신만).  
나중에 `https://camaplus.com` 으로 API를 옮길 때만 A/CNAME 추가.

---

## 4. VPS — 서버 환경 변수

파일: `/opt/cama/deploy/.env.cafe24` (Git 커밋 금지)

```env
CAMA_MAIL_ENABLED=true
CAMA_MAIL_FROM=noreply@camaplus.com

SPRING_MAIL_HOST=smtp-relay.brevo.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=<Brevo 로그인 이메일>
SPRING_MAIL_PASSWORD=<SMTP key>
```

적용:

```bash
ssh camaplus-vps
cd /opt/cama/deploy
# .env.cafe24 수정 후
docker restart cama-plus-server
```

확인:

```bash
docker exec cama-plus-server env | grep -E 'CAMA_MAIL|SPRING_MAIL'
```

`CAMA_MAIL_ENABLED=true` 이어야 실제 발송 (`SmtpEmailService`).

---

## 5. 동작 확인

### 5.1 Brevo 대시보드

- **Domains** → `camaplus.com` — **Authenticated** ✅
- **Senders** → `noreply@camaplus.com` — DKIM ✅, DMARC ✅

### 5.2 서버 (이메일 있는 계정만)

`POST /api/public/patient/recover/password` — DB에 `email` 이 있는 계정

로그:

```bash
docker logs cama-plus-server --tail 50 | grep -i mail
```

`CAMA_MAIL_ENABLED=false` 이면 로그에만 출력 (`LoggingEmailService`).

### 5.3 현실적 한계

| 계정 유형 | 비밀번호 초기화 |
|-----------|----------------|
| email 있음 | SMTP로 발송 가능 (연동 후) |
| email 없음 (PASS, happycog 등) | **앱 응답에 임시 PW** — SMS 별도 검토 |

---

## 6. 체크리스트 (인쇄용)

```text
[ ] Brevo 가입 / 로그인
[ ] SMTP key 발급 (xsmtpsib-...)
[ ] Domains → camaplus.com 추가
[ ] Cafe24 DNS에 Brevo code + DKIM (+ DMARC) 입력
[ ] Brevo에서 도메인 Authenticated ✅
[ ] Sender noreply@camaplus.com + DKIM/DMARC ✅
[ ] VPS .env.cafe24 CAMA_MAIL_ENABLED=true, FROM=noreply@camaplus.com
[ ] docker restart cama-plus-server
[ ] 테스트 발송 또는 recover/password API
```

---

## 7. 문제 해결

| 증상 | 조치 |
|------|------|
| DKIM 실패 | 호스트명 `mail._domainkey` 중복/누락 확인, 24h 대기 |
| SMTP 535 / auth fail | SMTP **key** 사용 여부, username=로그인 이메일 |
| 메일 안 감 | `CAMA_MAIL_ENABLED` 확인, 수신 계정 스팸함 |
| `@camaplus.cafe24.com` 발신 시도 | 불가 — **@camaplus.com** 만 |

---

## 8. 프로젝트 코드 기본값 (반영됨)

- `deploy/env.cafe24.example` → `noreply@camaplus.com`
- `application-cafe24.yml` → `CAMA_MAIL_FROM` 기본값 `noreply@camaplus.com`

구 문서의 `camaplus.me` 는 **폐기**, 신규는 **camaplus.com** 기준.

---

## 9. 다음에 Cursor에게 요청할 때

다음 정보를 주시면 VPS 반영까지 진행 가능:

1. Brevo 도메인 인증 완료 여부 (스크린샷 또는 Authenticated ✅)
2. `CAMA_MAIL_ENABLED=true` 로 넣을지 여부
3. SMTP username(이메일) — **password는 채팅에 붙이지 말고** “VPS에 직접 넣음”만 알려주기

---

*관련: [CAFE24_PROGRESS_HANDOFF.md](CAFE24_PROGRESS_HANDOFF.md) §5 (구 camaplus.me → 본 문서로 대체)*
