# CAMA Plus WebView Shell

`cama-plus-app` 는 React Native 환자 앱이 아니라, 환자 웹앱을 감싸는 최소 WebView 셸입니다.

## URL rules

- Dev (`__DEV__ = true`): `http://localhost:5173/`
- Release APK / AAB: `https://camaplus.cafe24.com/webview`

릴리즈 빌드에서는 React Native의 `__DEV__` 가 `false` 이므로 Cafe24 URL 을 사용합니다.

## Local Android dev

실기기에서 `localhost:5173` 를 열기 위해 `adb reverse` 를 사용합니다.

```bash
cd /Users/doh/workspace/cama-cafe24/react-app-dawplus
npm run dev -- --host 0.0.0.0
```

```bash
cd /Users/doh/workspace/cama-cafe24/cama-plus-app
npm run android
```

`npm run android` 는 내부에서 아래를 실행합니다.

```bash
adb reverse tcp:5173 tcp:5173
react-native run-android
```

## Other commands

```bash
npm test -- --runInBand
npm run android-build:apk:dev
npm run android-build:apk
```
