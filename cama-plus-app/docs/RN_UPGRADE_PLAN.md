# React Native 업그레이드 계획 (0.71.1 → 최신)

## 현재

- react-native **0.71.1**, react **18.2.0**
- JDK/Android Gradle 구버전 잠금

## 원칙

1. **로컬 서버 연동·기능 테스트를 0.71에서 먼저 완료** (baseline)
2. 단계적 업그레이드 (한 번에 latest 점프 금지)
3. 각 단계마다 `run-local-stack.ps1` + 수동 체크리스트

## 권장 단계

| 단계 | RN 버전 | 비고 |
|------|---------|------|
| Baseline | 0.71.1 | LOCAL stage, smoke PASS |
| 1 | 0.73.x | Gradle 7.5+, AGP 7.4 |
| 2 | 0.76.x | New Architecture 옵션, JDK 17 |
| 3 | latest stable | Firebase, Navigation, iamport 호환 확인 |

## Upgrade Helper

```bash
npx react-native upgrade 0.76.9
# 또는 https://react-native-community.github.io/upgrade-helper/?from=0.71.1&to=0.76.9
```

## 주요 호환성 점검

- `@react-native-firebase/*` — RN 버전 매트릭스
- `iamport-react-native` — 최신 RN 지원 여부
- `react-native-screens`, `@react-navigation/*`
- `metro-react-native-babel-preset`
- Android `minSdkVersion`, iOS deployment target
- Hermes 기본 활성화

## 완료 기준

- [ ] `npm install` / `pod install` 성공
- [ ] Android debug 빌드·실행
- [ ] LOCAL stage → localhost:8080 API 호출
- [ ] smoke-test-mobile-api.ps1 PASS
- [ ] PASS 로그인 + 주요 탭 수동 테스트
