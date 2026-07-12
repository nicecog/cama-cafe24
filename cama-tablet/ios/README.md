# CAMA Tablet iOS (iPad)

Android `cama-tablet/android` 와 동일한 **오프라인 BLE 수신 태블릿** 앱입니다.

- Bundle ID: `com.cama.tablet.offline`
- min iOS: **15.0**
- 대상: iPhone / **iPad** (가로 고정)
- 웹앱: `Resources/www` (Android assets와 동일 React 번들)

## 구조

```
cama-tablet/ios/
├── CamaTablet.xcodeproj
├── CamaTablet/
│   ├── AppDelegate.swift
│   ├── ViewController.swift      # WKWebView 호스트
│   ├── Bridge/NativeEventEmitter.swift
│   ├── BLE/                      # CBPeripheralManager GATT Peripheral
│   └── Resources/www/            # 번들된 SPA
└── README.md
```

## 빌드

### 1. 웹앱 동기화

```bash
cd cama-tablet
./scripts/build-web.sh
# 또는: cd web && npm run build && cp -R ../android/app/src/main/assets/www/* ../ios/CamaTablet/Resources/www/
```

### 2. Xcode

```bash
open cama-tablet/ios/CamaTablet.xcodeproj
```

또는:

```bash
cd cama-tablet/ios
xcodebuild -scheme CamaTablet -destination 'platform=iOS Simulator,name=iPad Pro 13-inch (M5)' -configuration Debug build
```

실기기: Xcode에서 Team 선택 후 Run (Bluetooth 권한 필요).

## 브릿지 (Android와 동일)

Web → Native: `window.AndroidBridge` / `window.CamaTabletBridge`

| 메서드 | 설명 |
|--------|------|
| `generateQr()` | BLE 세션 시작 |
| `stopBleSession()` | BLE 중지 |
| `clearLastHealthData()` | 캐시 초기화 |
| `getCapabilities()` | 동기 JSON |
| `getLastHealthData()` | 동기 JSON |

Native → Web: `CustomEvent('cama-tablet-native')` — Android와 동일한 `detail.type`.

## BLE

Android와 동일 UUID:

| 항목 | UUID |
|------|------|
| Service | `F47AC10B-58CC-4372-A567-0E02B2C3D479` |
| Health Data (write) | `6BA7B810-9DAD-11D1-80B4-00C04FD29E95` |
| Status (notify) | `6BA7B811-9DAD-11D1-80B4-00C04FD29E95` |

iOS는 `CBPeripheralManager`로 GATT Peripheral을 구현합니다. **시뮬레이터에서는 BLE Peripheral이 동작하지 않습니다** — 실기기(iPad)에서 테스트하세요. UI/WebView는 시뮬레이터에서 `테스트 데이터 수신`으로 확인 가능합니다.
