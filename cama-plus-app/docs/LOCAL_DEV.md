# cama-plus-app 로컬 개발 (cama-plus-server 연동)

> **세부 인계 문서:** [`F:/cama_pjt/docs/BILLIVE_LOCAL_DEV_HANDOFF.md`](../../docs/BILLIVE_LOCAL_DEV_HANDOFF.md)  
> (dev RDS mig, 테스트 계정, 해결 이슈, Gabia/batch/algo, 스크립트 목록)

Flutter(`foundationstem_fsm_client`)는 **보류**. React Native **cama-plus-app** + 로컬 **cama-plus-server** (Gabia-like `local-gabia`) 기준입니다.

## 1. 사전 준비

| 항목 | 경로 / 명령 |
|------|-------------|
| JDK 17 | `cama-plus-server` scripts 참고 |
| PostgreSQL | Docker `cama-local-postgres` :55432 (서버 스크립트) |
| DB 스키마 | `cama-plus-server/scripts/apply-local-schema.ps1` |
| Node.js | 18+ 권장 |

## 2. 로컬 서버 기동

```powershell
cd F:\cama_pjt\cama-plus-server
# 최초 1회 또는 스키마 오류(500) 시
powershell -ExecutionPolicy Bypass -File .\scripts\patch-local-schema-drift.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\run-local-gabia.ps1
```

확인: http://localhost:8080/ → `cama-back`

## 3. 앱 API 스테이지

`src/config/stage.ts`:

```typescript
export const currentStage: Stage = 'LOCAL';
```

| Stage | API |
|-------|-----|
| LOCAL | Android 에뮬: `http://10.0.2.2:8080/` / iOS: `http://localhost:8080/` |
| DEV | `https://camaplus.cafe24.com/` |
| PROD | `https://camaplus.cafe24.com/` |

실기기(USB): `localApiBaseUrlOverride = 'http://<PC_IP>:8080/'` 또는 `adb reverse tcp:8080 tcp:8080`

WebView(코칭/치료): Cafe24 단일 도메인 `https://camaplus.cafe24.com` 사용.

## 4. API smoke (앱 호출 경로)

```powershell
cd F:\cama_pjt\cama-cafe24\cama-plus-app
powershell -ExecutionPolicy Bypass -File .\scripts\run-local-stack.ps1
```

## 5. React Native 앱 실행

```powershell
cd F:\cama_pjt\cama-cafe24\cama-plus-app
npm install --legacy-peer-deps
npx react-native start
# 다른 터미널 (ANDROID_HOME / platform-tools PATH 필요)
npx react-native run-android
```

**에뮬레이터 (CAMA_API33) 테스트 시 참고**

- `android/local.properties` — SDK 경로 (없으면 생성)
- Flipper: AVD에서 desktop 미연결 시 native crash → debug 빌드에서 에뮬레이터 자동 비활성화 (`ReactNativeFlipper.java`)
- `adb reverse tcp:8081 tcp:8081` — Metro (선택)
- 로그 확인: `adb logcat -s ReactNativeJS:I` → `[cama-api] stage= LOCAL baseURL= http://10.0.2.2:8080/`

현재 버전: **React Native 0.71.1** (업그레이드 전 로컬 연동·기능 테스트 우선)

## 6. 기능 테스트 체크리스트 (수동)

로그인은 현재 **PASS(Iamport)** — id/password 전환은 로컬 테스트 완료 후.

- [ ] PASS 로그인 → `/api/auth/pass`
- [ ] 병원/의사 선택 → `/api/hospital/*`
- [ ] 홈 care-track / schedule / contents
- [ ] 일정 CRUD
- [ ] WebView 코칭·웰빙 (`camaplus.cafe24.com`)
- [ ] 마이페이지 / 알림 / 탈퇴

## 7. React Native 업그레이드 (다음 단계)

0.71 → 최신 정식 버전은 **대규모 작업** (Gradle, Firebase, Navigation, Hermes 등).

권장 순서:

1. **LOCAL + 0.71** 로 전 기능 테스트 (현재 단계)
2. [Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 로 0.71 → 0.76 → 최신 단계적 업그레이드
3. 업그레이드 후 동일 smoke + 수동 체크리스트 재실행
4. **PASS → id/password** UI + 서버 `/api/auth` loginId 지원
5. Gabia 운영 배포 (`api.cama.ai.kr`)

## 8. 알려진 서버 이슈 (id/password 전환 시 수정)

- `POST /api/account/general` 가입: `email=null`
- `POST /api/auth`: **email** 기준 로그인 → loginId 와 불일치
- 앱 `POST /api/hospital/{hSeq}/service/cancel` — 서버 엔드포인트 없을 수 있음
