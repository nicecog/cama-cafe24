# 환자 앱 ID/PW 인증 (cama-plus-app ↔ cama-plus-server)

PASS(Iamport) 대신 **로그인 ID + 비밀번호** 기반 인증입니다.

## 앱 화면

| 화면 | 경로 |
|------|------|
| 웰컴 | `LoginScreen` → 로그인 버튼 |
| ID/PW 로그인 | `LoginCredentialsScreen` |
| 회원가입 | `SignUpPatientScreen` |
| ID/PW 찾기 | `FindAccountScreen` (ID 찾기 / PW 찾기 탭) |

## 서버 API

Base: `{API}/api/account/patient`

| Method | Path | 설명 |
|--------|------|------|
| POST | `/check/login-id` | ID 중복 확인 |
| POST | `/check/email` | 이메일 중복 확인 |
| POST | `/check/phone` | 전화번호 중복 확인 |
| POST | `/check/patient-number` | 환자번호 중복 확인 (선택) |
| POST | `/register` | 회원가입 (서버 검증 포함) |
| POST | `/find/login-id` | 이름 + 전화번호 → loginId |
| POST | `/find/password` | 이름 + 전화번호 + 이메일 → 임시 비밀번호 이메일 발송 |

로그인 JWT: `POST /api/auth` — `{ principal: loginId, credentials: password, firebase }`

## DB

`account.patient_management_number` (varchar 50, optional, unique when set)

로컬 적용:

```powershell
cd F:\cama_pjt\cama-plus-server
powershell -ExecutionPolicy Bypass -File .\scripts\patch-local-schema-drift.ps1
```

## 이메일 (Gabia 운영)

`application-*.yml`:

```yaml
cama:
  mail:
    enabled: true
    from: noreply@your-domain.kr
spring:
  mail:
    host: smtp.gabia.com
    port: 587
    username: ...
    password: ...
```

로컬(`local-gabia`)은 `cama.mail.enabled=false` → 서버 로그에 메일 내용 출력.

## 비밀번호 규칙

- 8~12자 (서버 `JhUtil.checkPassword`)
- 영문, 숫자, 특수문자(`~!@#$%^&*()+|=`) 각 1개 이상

## 레거시 PASS

`/api/auth/pass` 및 Iamport 연동 코드는 서버에 유지되나 앱 로그인 UI에서는 제거했습니다.
