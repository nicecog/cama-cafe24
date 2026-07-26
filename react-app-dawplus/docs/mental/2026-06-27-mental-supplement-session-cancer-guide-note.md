# 심리코칭 암종별 보충세션 확인 메모

작성일: 2026-06-27

## 결론

- 현재 동작은 as-is와 동일하며, 이번 이관/개발로 새로 발생한 회귀 이슈로 보이지 않습니다.
- 다만 암정보가이드 미설정 또는 암종값 미확인 상황에서 보충세션 fallback 항목에 `수술 후 호흡 불편함`이 포함되어 있어, 사용자 입장에서는 폐암 기본설정처럼 보일 수 있습니다.

## 확인 내용

- 심리코칭 보충세션(Section6)의 암종 분기는 암정보가이드 설정 여부를 직접 참조하지 않습니다.
- as-is와 to-be 모두 코칭 진행정보의 `diseaseName` 값을 기준으로 분기합니다.
- `diseaseName`이 정상적으로 있으면 암종별로 아래처럼 버튼이 노출됩니다.
  - 갑상선암: `피로감`, `암 재발 불안`, `우울감`
  - 대장암: `장루`, `암 재발 불안`, `우울감`
  - 유방암: `신체이미지`, `성생활의 불편함`, `암 재발 불안`, `우울감`
  - 폐암: `수술 후 호흡 불편함`, `신체기능 저하`, `암 재발 불안`, `우울감`
- `diseaseName`이 없거나 매핑되지 않으면 fallback으로 아래 3개가 노출됩니다.
  - `암 재발 불안`
  - `우울감`
  - `수술 후 호흡 불편함`

## 해석

- 따라서 "암정보가이드 설정을 안 하면 폐암 기본설정으로 나온다"는 표현은 완전히 정확하지는 않습니다.
- 정확히는 "암종 미확인 fallback 항목에 폐암성 문구(`수술 후 호흡 불편함`)가 포함되어 있어 폐암 기본처럼 보일 수 있다"가 맞습니다.
- 즉, 현재 동작은 as-is 동일 정책이며, 별도 결함이라기보다 기존 fallback 설계에 가까운 상태입니다.

## 확인 파일

- as-is
  - `/Users/doh/workspace/cama-doctor/src/hooks/useDiseaseName.ts`
  - `/Users/doh/workspace/cama-doctor/src/app/webview/coaching/mental/session_6/Step2.tsx`
- to-be
  - `/Users/doh/workspace/cama-cafe24/react-app-dawplus/src/hooks/useDiseaseName.ts`
  - `/Users/doh/workspace/cama-cafe24/react-app-dawplus/src/routes/_auth/_coaching/coaching/mental/Section6/-Step2.tsx`

## 메일용 짧은 문구

심리코칭 암종별 보충세션 노출 로직을 확인한 결과, 해당 동작은 as-is와 동일합니다. 보충세션은 암정보가이드 설정 여부를 직접 참조하지 않고 코칭 진행정보의 `diseaseName` 기준으로 분기하며, 암종값이 없을 경우 fallback 항목으로 `암 재발 불안`, `우울감`, `수술 후 호흡 불편함`이 노출됩니다. 이 때문에 사용자 입장에서는 폐암 기본설정처럼 보일 수 있으나, 실제로는 기존 as-is와 동일한 fallback 동작으로 확인되었습니다.
