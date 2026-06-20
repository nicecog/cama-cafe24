# cama-tablet-android

태블릿용 Android 네이티브 앱 — **WebView(React)** + **CameraX/ML Kit QR 스캔**.

## 구조

- `MainActivity` — `BuildConfig.TABLET_WEB_URL` 로드, `AndroidBridge.startQrScan()` 제공
- `QrScanActivity` — 후면 카메라 QR 인식 → WebView로 `cama-tablet-native` 이벤트 전달

## 빌드

1. Android Studio에서 `cama-tablet-android` 폴더 Open
2. Gradle Sync
3. 에뮬레이터/태블릿 실행 (landscape 권장)

**디버그 Web URL:** `http://10.0.2.2:5175` (에뮬레이터 → PC의 Vite)

실기기 테스트 시 `app/build.gradle.kts` 의 `debug` `TABLET_WEB_URL` 을 PC LAN IP로 변경.

## 브릿지

| JS | Native |
|----|--------|
| `AndroidBridge.startQrScan()` | QR 카메라 Activity |
| `cama-tablet-native` CustomEvent | 스캔 결과 `{ type, ok, payload }` |

## 권한

- `INTERNET`, `CAMERA`
