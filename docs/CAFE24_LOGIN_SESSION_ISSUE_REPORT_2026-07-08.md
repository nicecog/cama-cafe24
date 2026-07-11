# Cafe24 관리자 로그인 세션 유지 불안정 — 기술 문의서

> **작성일:** 2026-07-08  
> **작성 환경:** Windows 10, Google Chrome 150.0.7871.46  
> **공인 IP (당시):** 218.51.52.107  
> **증상 발생 URL:** `https://hosting.cafe24.com/`, `https://eclogin.cafe24.com/`

---

## 1. 문의 요약

Cafe24 호스팅 관리자 페이지에 로그인할 때 **로그인 처리가 매우 느리고**, 로그인 직후에도 **세션이 자주 풀려 로그인 페이지로 되돌아가는** 현상이 반복됩니다.

동일 PC·동일 브라우저에서 다른 사이트에서도 유사한 증상이 있어 로컬 PC 보안 이슈를 의심했으나, **Chrome DevTools Protocol(CDP)로 네트워크·쿠키를 실시간 캡처한 결과, 브라우저는 로그인 쿠키를 정상 저장·전송하고 있으며 서버가 세션을 인정하지 않는 것으로 확인**되었습니다.

**요청 사항:** 호스팅 관리자 SSO/세션 처리(`hosting.cafe24.com` ↔ `user.cafe24.com` ↔ `www.cafe24.com`) 관련 서버 측 점검을 부탁드립니다.

---

## 2. 증상 상세

| 항목 | 내용 |
|------|------|
| 증상 1 | 로그인 버튼 클릭 후 응답이 느림 (다단계 리다이렉트 + 광고/추적 스크립트 다수 로드) |
| 증상 2 | 로그인 성공 후 관리자 페이지 진입, **수 초~수십 초 내** 다시 로그인 페이지로 이동 |
| 증상 3 | 동일 계정으로 **재로그인하면** 당시에는 정상 진입되는 경우가 많음 |
| 영향 URL | `hosting.cafe24.com/?controller=myservice_hosting_main` 등 |
| 재현 빈도 | 반복 재현됨 (2026-07-08 20:13 KST 기준 CDP 로그로 확인) |

---

## 3. 클라이언트 환경 (문제 원인에서 제외된 항목)

아래 항목은 로컬 PC에서 점검하였으며 **정상**으로 확인되었습니다.

| 점검 항목 | 결과 |
|-----------|------|
| 시스템 시계 | 인터넷 표준시와 일치 (NTP 정상) |
| Windows 프록시 | 비활성 (ProxyEnable=0) |
| VPN / 타사 백신 | 미사용 (Windows Defender만 동작) |
| hosts 파일 변조 | 없음 |
| SSL MITM(가로채기) 인증서 | 의심 항목 없음 |
| 크롬 종료 시 쿠키 삭제 | 설정 안 됨 |
| 광고/추적 차단 확장 | uBlock 등 없음 (구글 기본 확장만) |
| 로그인 쿠키 저장 | 정상 (`CIDSESS`, `CUK2Y`, `CUK45`, `PHPSESSID` 등 존재, 만료 2027년) |

---

## 4. 핵심 기술 증거

### 4.1 로그인 쿠키는 서버로 정상 전송됨

`hosting.cafe24.com/?controller=myservice_hosting_main` 요청 시 Chrome이 **연관 쿠키(associatedCookies)** 로 다음을 **전송(SENT)** 했습니다.

```
SENT: CIDSESS, CUK2Y, CUK45, PHPSESSID
```

그럼에도 서버 응답은 **로그인 페이지로 리다이렉트**되었습니다.

```
RESP 200 → hosting.cafe24.com/?controller=member&method=login
RESP 200 → hosting.cafe24.com/?controller=new_member&method=login
```

→ **쿠키 미전송이 아니라, 쿠키를 받은 뒤 서버가 세션을 무효 처리한 것으로 판단됩니다.**

### 4.2 ECSESSID DomainMismatch (정상 동작, 원인 아님)

```
BLOCKED: ECSESSID (이유: DomainMismatch)
```

`ECSESSID`는 도메인 `.www.cafe24.com`에 귀속되어 `hosting.cafe24.com` 요청에는 **원래 전송되지 않는 것이 표준 동작**입니다. 모든 브라우저에서 동일하며, 본 증상의 직접 원인은 아닙니다.

### 4.3 PHPSESSID 반복 재발급

로그인 직후 약 2초 내 `PHPSESSID`가 연속으로 새 값으로 교체되었습니다.

| 시각 (KST) | PHPSESSID (앞 8자) |
|------------|-------------------|
| 20:13:22 | `4d8f30b4` |
| 20:13:24 | `da5ee085` |
| 20:13:24 | `4af77da8` |
| 20:13:55 | `b6cc3cdf` |

→ 서버(또는 로드밸런서)가 **기존 세션을 이어받지 못하고 매번 새 PHP 세션을 생성**하는 패턴으로 보입니다.

### 4.4 재현된 로그인 타임라인 (2026-07-08)

#### 1차 로그인 — 성공 후 13초 뒤 세션 풀림

| 시각 | 이벤트 |
|------|--------|
| 20:13:21 | `POST hosting.cafe24.com/?controller=new_member&method=doLoginAuth` → 200 |
| 20:13:21 | `POST user.cafe24.com/comLogin/?action=comLogin` → 200 |
| 20:13:22 | `SET-COOKIE CIDSESS=...` (로그인 세션 발급) |
| 20:13:22 | `hosting.cafe24.com/main/login.php?EncData=...` → 리다이렉트 체인 |
| 20:13:23 | `hosting.cafe24.com/?controller=myservice_hosting_main` → **관리자 진입 성공** |
| 20:13:37 | `hosting.cafe24.com/` 루트 접근 |
| 20:13:39 | `?controller=new_member&method=login` → **로그인 페이지로 되돌아감** |

#### 2차 로그인 — 재시도 후 진입

| 시각 | 이벤트 |
|------|--------|
| 20:13:54 | 동일 로그인 흐름 재실행 |
| 20:13:55 | `SET-COOKIE CIDSESS=...`, `PHPSESSID=b6cc3cdf...` |
| 20:14:00 | `?controller=myservice_hosting_main` → **재진입 성공** |

→ **"로그인하면 됐다가 곧 풀리고, 다시 로그인하면 된다"** 는 사용자 체감과 일치합니다.

### 4.5 로그인 느림 관련 관찰

로그인 과정에서 다음 외부 리소스가 대량 호출되었습니다.

- `googleads.g.doubleclick.net`, `www.google.com/rmkt/collect`, `analytics.google.com`
- `www.facebook.com/tr`, `bc.ad.daum.net`, `t1.kakaocdn.net`
- `ad.cafe24.com`, `macomt.cafe24.com`, `mp.cafe24.com`

SSO 다단계 리다이렉트(`doLoginAuth` → `user.cafe24.com/comLogin` → `hosting.cafe24.com/main/login.php` → `EncData` 콜백)와 광고 스크립트가 겹쳐 체감 지연이 큽니다.

---

## 5. 로그인 흐름 다이어그램

```text
[사용자] 로그인 폼 제출
    │
    ▼
hosting.cafe24.com  POST ?controller=new_member&method=doLoginAuth
    │
    ▼
user.cafe24.com     POST /comLogin/?action=comLogin
    │               SET-COOKIE: CIDSESS (도메인 .cafe24.com)
    ▼
hosting.cafe24.com  GET /main/login.php?EncData=...
    │               SET-COOKIE: PHPSESSID (도메인 .cafe24.com)
    ▼
hosting.cafe24.com  GET ?controller=myservice_hosting_main
    │               ← CIDSESSID, PHPSESSID, CUK2Y, CUK45 전송됨
    │
    ├─ (성공) 관리자 페이지 표시
    │
    └─ (실패) ?controller=member&method=login 으로 리다이렉트
              ← 쿠키 전송 후에도 발생 (본 문의의 핵심)
```

---

## 6. Cafe24 측 점검 요청 사항

아래 항목에 대한 확인을 요청드립니다.

1. **호스팅 관리자 SSO 세션 동기화**
   - `CIDSESSID` / `PHPSESSID` / `CUK2Y` / `CUK45` 간 세션 연동이 `hosting.cafe24.com`에서 안정적으로 유지되는지
   - 로그인 직후 `myservice_hosting_main` 접근 시 세션 검증 실패 원인

2. **PHPSESSID 반복 재발급**
   - 동일 브라우저·동일 탭에서 로그인 직후 `PHPSESSID`가 연속 변경되는 원인
   - 로드밸런서/세션 스티키 설정(sticky session) 또는 세션 저장소(Redis/DB) 이슈 여부

3. **EncData 기반 콜백 로그인**
   - `hosting.cafe24.com/main/login.php?EncData=...` → `/?sec=on&EncData=...` 리다이렉트 체인에서 세션 유실 가능성

4. **IP/세션 바인딩 정책**
   - 유동 IP 환경에서 세션이 즉시 무효화되는 정책이 있는지 (공인 IP: 218.51.52.107)

5. **TSPD(봇/보안) 모듈**
   - `hosting.cafe24.com/TSPD/?type=19`, `type=22` 호출 후 세션 상태 변화 여부

---

## 7. 임시 회피 방법 (사용자 측)

서버 점검 전까지 아래 방법으로 증상 완화가 가능할 수 있습니다.

- `https://eclogin.cafe24.com/` 또는 `https://hosting.cafe24.com/` **직접 URL**로 로그인 (북마크 URL 통일)
- 로그인 후 **여러 탭·서브도메인 간 이동 최소화**
- 로그인 페이지 **완전 로드 후** 로그인 버튼 클릭
- 동일 증상이 Edge/Firefox에서도 재현되는지 확인 (재현 시 서버 측 이슈 가능성 더 높음)

---

## 8. 첨부·참고 정보

| 항목 | 값 |
|------|-----|
| 브라우저 | Google Chrome 150.0.7871.46 |
| OS | Windows 10 (10.0.19045) |
| 시간대 | KST (UTC+9), 시스템 시계 정상 |
| Cafe24 서버 IP (hosting) | 14.128.128.216 |
| Cafe24 서버 IP (user) | 112.175.254.209 |
| 진단 방법 | Chrome DevTools Protocol — Network.requestWillBeSentExtraInfo (associatedCookies), Set-Cookie, Page.frameNavigated |
| 진단 일시 | 2026-07-08 20:12~20:18 KST |

---

## 9. 문의 시 붙여넣기용 요약 (1문단)

> Chrome 150 / Windows 10 환경에서 hosting.cafe24.com 관리자 로그인 시, 로그인 쿠키(CIDSESSID, PHPSESSID, CUK2Y, CUK45)가 서버로 정상 전송되는 것을 CDP 네트워크 로그로 확인했으나, 서버가 myservice_hosting_main 접근 시 member/login으로 리다이렉트하여 세션이 풀립니다. 로그인 직후 PHPSESSID가 2초 내 3회 연속 재발급되며, 1차 로그인 성공 13초 후 세션 만료, 2차 로그인 시 재진입되는 패턴이 반복 재현됩니다. PC 프록시/백신/시계/쿠키 차단은 모두 정상으로, SSO 세션 처리 또는 서버 세션 저장소 이슈로 추정되어 점검을 요청합니다.

---

*본 문서는 사용자 PC에서 수집한 기술 진단 결과이며, Cafe24 고객센터(1:1 문의 / 기술지원) 전달용입니다.*
