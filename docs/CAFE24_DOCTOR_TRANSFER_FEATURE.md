# 의사앱 자료전송 (CAMA Tablet BLE)

> 작성: 2026-07-10  
> 연동 대상: `cama-tablet` (오프라인 BLE 수신 태블릿)

---

## 1. 기능 개요

마이페이지 **나의메뉴** → **의사앱 자료전송** (`/mypage/doctor-transfer`)

1. 태블릿 앱에서 QR 생성 (BLE 광고 시작)
2. 환자 CAMA Plus 앱에서 QR 스캔 (카메라)
3. 환자 건강 자료 JSON을 BLE로 태블릿에 write
4. 태블릿 WebView 대시보드에 표시

---

## 2. 프로토콜 (cama-tablet README 와 동일)

### QR Payload (태블릿 → 폰)

```json
{
  "v": 1,
  "app": "cama-tablet",
  "deviceId": "<android_id>",
  "deviceName": "CAMA-Tablet-XXXX",
  "serviceUuid": "F47AC10B-58CC-4372-A567-0E02B2C3D479",
  "dataCharUuid": "6BA7B810-9DAD-11D1-80B4-00C04FD29E95"
}
```

### 건강 데이터 JSON (폰 → 태블릿)

`cama-tablet/web/src/types/healthData.ts` 와 동일 스키마.

현재 전송 필드 (SPA `buildTabletHealthPayload`):

| 필드 | 출처 |
|------|------|
| `patientName`, `patientId` | `/api/webview/account/me` |
| `steps` | 네이티브 걸음수 또는 최근 stepList |
| `stepsHistory` | `POST /api/webview/track/service/stepList` |
| `inquiries` | `GET /api/webview/notification/recent` |

---

## 3. 구현 위치

### react-app-dawplus (WebView SPA)

| 파일 | 역할 |
|------|------|
| `src/routes/_auth/_layout/mypage/doctor-transfer/index.tsx` | 라우트 |
| `src/components/mypage/DoctorTransferPage.tsx` | UI (스캔 → 확인 → 전송) |
| `src/lib/tablet/tabletTransfer.types.ts` | QR·JSON 타입 |
| `src/lib/tablet/buildTabletHealthPayload.ts` | 전송 JSON 조립 |
| `src/lib/webview/nativeBridgeClient.ts` | `scanTabletQr`, `sendTabletHealthData` |
| `MyPageMainContent.tsx` | 메뉴 항목 추가 |

### cama-plus-app (RN 셸)

| 파일 | 역할 |
|------|------|
| `src/constants/nativeBridge.types.ts` | 브릿지 메시지 타입 |
| `src/utils/bridgeHandlers.ts` | 권한 + 네이티브 호출 |
| `src/native/TabletTransfer.ts` | JS 래퍼 |
| `android/.../tablettransfer/TabletTransferModule.java` | QR Activity 시작, BLE 전송 |
| `android/.../tablettransfer/QrScanActivity.java` | ZXing QR 스캔 |
| `android/.../tablettransfer/TabletBleClient.java` | BLE Central (scan → connect → write) |

---

## 4. 브릿지 API

### SPA → RN

| type | 설명 |
|------|------|
| `scanTabletQr` | 카메라 QR 스캔 → `tabletQrScan.raw` |
| `sendTabletHealthData` | `qrPayload` + `healthData` → BLE write |

### 권한 (Android)

- QR: `CAMERA`
- BLE: `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT` (API 31+) 또는 `ACCESS_FINE_LOCATION` (API 30-)

---

## 5. 테스트 절차

1. `cama-tablet` APK 설치 → 「QR 생성하기」
2. CAMA Plus 앱(WebView) → 마이페이지 → 의사앱 자료전송
3. QR 스캔 → JSON 확인 → 전송
4. 태블릿 대시보드 데이터 표시 확인

**주의:** SPA만 VPS 배포해도 메뉴·UI는 보이지만, **QR·BLE는 새 APK 빌드 후** 동작합니다.

```powershell
cd cama-plus-app\android
.\gradlew assembleRelease
```

---

## 6. 미구현 / 제한

| 항목 | 상태 |
|------|------|
| iOS BLE Central + QR | ❌ `NOT_IMPLEMENTED` |
| QR 세션 인증 (JWT) | ❌ 오프라인 프로토콜은 UUID만 공유 |
| 전송 실패 재시도 UI | 기본 「다시 시도」만 |
| heartRate 등 바이탈 | 추후 `readVital` 연동 가능 |

---

## 7. 관련 문서

- [cama-tablet/README.md](../cama-tablet/README.md)
- [CAFE24_WEBVIEW_MYPAGE_HANDOFF_2026-07-09.md](./CAFE24_WEBVIEW_MYPAGE_HANDOFF_2026-07-09.md)
