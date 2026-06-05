# Cafe24 DNS 설정 — Brevo `camaplus.com` (클릭 순서)

> Brevo 도메인 인증 화면에 나온 4개 레코드를 Cafe24에 등록하는 **클릭 가이드**  
> AI/Cursor는 Cafe24 로그인을 대신할 수 없음 → 아래 순서대로 직접 입력

**대상 도메인:** `camaplus.com`

**2026-06-03 일시 중단:** TXT 호스트에 `@` 입력이 UI에서 불가 → **Cafe24 고객센터 문의** 후 내일 재개. 진행 상황·VPS 메일 env는 [CAFE24_BREVO_RESUME_2026-06-04.md](CAFE24_BREVO_RESUME_2026-06-04.md).

---

## 0. 들어가기

1. https://hosting.cafe24.com (또는 https://www.cafe24.com) 로그인
2. **나의 서비스 관리**
3. **도메인관리** (또는 도메인 관리)
4. **도메인 부가서비스** → **DNS 관리**  
   - 또는: **도메인 연결 관리** → **도메인 네임서버(DNS) 관리** → **DNS 관리**
5. 목록에서 **`camaplus.com`** 선택 → **DNS 관리** / **설정하기**

네임서버가 Cafe24가 아니면 이 메뉴에 레코드가 없을 수 있음 → **도메인관리 > 네임서버 변경**에서 Cafe24 NS인지 먼저 확인.

---

## 1. TXT — Brevo code (1건) ⚠️ Cafe24 입력 실수 주의

Cafe24 TXT 추가 창은 보통 **칸이 2개**입니다.

| 칸 이름 (예시) | 넣을 것 | 넣으면 안 되는 것 |
|----------------|---------|-------------------|
| **1번: 호스트명** | **비움** (아무것도 안 씀) 또는 `@` | ❌ `camaplus.com` ❌ Value 전체 |
| **2번: TXT / 값** | `brevo-code:89963c7a5e9391ff22611fbae51929b2` 만 | ❌ 도메인 이름 |

### 왜 `camaplus.com` 넣으면 다음으로 안 넘어가나?

- Cafe24는 호스트 칸에 **`camaplus.com`을 또 쓰면** `camaplus.com.camaplus.com` 처럼 잘못 인식하거나 **“도메인명이 올바르지 않습니다”** 가 납니다.
- Brevo의 `@` = **루트 도메인** = Cafe24에서는 **호스트를 비우거나 `@` 한 글자**만 넣습니다.
- **Value(brevo-code:...)는 반드시 2번 칸( TXT )** 에만 넣습니다. 1번 칸에 같이 넣지 마세요.

### 시도 순서 (막히면 이 순서대로)

1. **호스트명: 완전 비움** + TXT: `brevo-code:89963c7a5e9391ff22611fbae51929b2` → 확인  
2. 안 되면 **호스트명: `@`** + TXT: 위와 동일 → 확인  
3. 둘 다 안 되면 **호스트명: `www` 말고** `@` 또는 비움만 — `camaplus.com` 문자열은 사용하지 않음  
4. 그래도 안 되면 Cafe24 1:1 문의: “Brevo 도메인 인증 TXT 등록 요청” (호스트 @, TXT 값 전달)

### `@` 문자를 입력할 수 없는 경우 (2026-06-03)

- 일부 Cafe24 DNS 화면은 호스트 칸에 **`@` 특수문자 입력·저장이 안 됨**.
- **호스트 완전 비움**도 시도했는데 다음 단계로 안 넘어가면 → **고객센터에 등록 대행 요청** (이미 문의한 경우, 답변 올 때까지 Brevo 인증 대기).
- 센터에 보낼 때: “루트 도메인(`camaplus.com`)용 TXT, 호스트 `@` 또는 공백, 값은 `brevo-code:…` 만” 이라고 명시.

1. **TXT 관리** → **TXT 추가**
2. 위 표대로 **2칸만** 입력 → **확인**

---

## 2. CNAME — DKIM 1 (1건)

1. **별칭(CNAME) 관리** 메뉴 클릭
2. **CNAME 추가**
3. 입력:

| Cafe24 항목 (이름 예시) | 넣을 값 |
|-------------------------|---------|
| **도메인 별칭** / 호스트 | `brevo1._domainkey` |
| **실제 도메인명** / 가리킬 대상 | `b1.camaplus-com.dkim.brevo.com` |

4. **확인** / **저장**

> 값 끝에 `.` 이 자동으로 붙거나 붙어 있으면: `b1.camaplus-com.dkim.brevo.com` 만 (끝 마침표 제거)  
> 호스트에 `camaplus.com` 이 자동으로 붙는 UI면 `brevo1._domainkey` 만 입력

---

## 3. CNAME — DKIM 2 (1건)

1. **별칭(CNAME) 관리** → **CNAME 추가**
2. 입력:

| Cafe24 항목 | 넣을 값 |
|-------------|---------|
| 도메인 별칭 | `brevo2._domainkey` |
| 실제 도메인명 | `b2.camaplus-com.dkim.brevo.com` |

3. **확인** / **저장**

---

## 4. TXT — DMARC (1건)

1. **TXT 관리** → **TXT 추가**
2. 입력:

| 화면 항목 | 넣을 값 |
|-----------|---------|
| 호스트 | `_dmarc` |
| TXT / 값 | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` |

3. **확인** / **저장**

---

## 5. 등록 후 확인

| 단계 | 할 일 |
|------|--------|
| 1 | Cafe24 DNS 목록에 **TXT 2개 + CNAME 2개** 보이는지 확인 |
| 2 | **30분~1시간** 대기 |
| 3 | Brevo → Domains → `camaplus.com` → **Verify** / 새로고침 |
| 4 | **Authenticated** ✅ 나오면 Senders에 `noreply@camaplus.com` 추가 |

---

## 6. 자주 하는 실수

| 실수 | 올바른 처리 |
|------|-------------|
| CNAME 호스트에 `brevo1._domainkey.camaplus.com.camaplus.com` | `brevo1._domainkey` 만 |
| Brevo code를 CNAME에 넣음 | 반드시 **TXT** |
| DKIM을 TXT로 넣음 | Brevo 안내가 **CNAME**이면 CNAME 메뉴 사용 |
| `@` 필드 오류 | 호스트 **비움** 또는 Cafe24 안내 문구대로 `camaplus.com` |

---

## 7. 체크리스트

```text
[ ] TXT  brevo-code:89963c7a5e9391ff22611fbae51929b2  (호스트 @ 또는 비움)
[ ] CNAME brevo1._domainkey → b1.camaplus-com.dkim.brevo.com
[ ] CNAME brevo2._domainkey → b2.camaplus-com.dkim.brevo.com
[ ] TXT  _dmarc → v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com
[ ] Brevo Domains Authenticated ✅
```

---

*관련: [BREVO_CAMAPLUS_COM_SETUP.md](BREVO_CAMAPLUS_COM_SETUP.md)*
