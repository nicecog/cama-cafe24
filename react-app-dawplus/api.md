# API 문서

이 문서는 React Native(RN)와 Webview API의 매핑 정보를 포함합니다.

## 📋 목차

- [계정 관련 API](#계정-관련-api)
- [치료정보 관련 API](#치료정보-관련-api)
- [암정보 가이드 여정 관련 API](#암정보-가이드-여정-관련-api)
- [건강코칭 관련 API](#건강코칭-관련-api)
- [병원 관련 API](#병원-관련-api)
- [공통 API](#공통-api)

---

## 계정 관련 API

### 내 병원 정보

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 내 병원 정보 조회 | |
| **RN API** | `GET /api/account/hospital` | |
| **Webview API** | `POST /api/webview/account/hospital` | |
| **Input 예시** | `{"seq": "244"}` | |
| **비고** | seq는 로그인id로 회원정보 조회하면 결과에 seq 값을 사용 | |

### 회원정보

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 회원정보 조회 | |
| **RN API** | `GET /api/account/me` | |
| **Webview API** | `POST /api/webview/account/me` | |
| **Input 예시** | `{"loginId": "5PI47M168902O"}` | |

### 회원 탈퇴

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 회원 탈퇴 처리 | |
| **RN API** | `POST /api/account/withdrawal` | |
| **Webview API** | `POST /api/webview/account/withdrawal` | |
| **Input 예시** | `{"loginId": "5PI47M168902O"}` | |
| **추가일** | 2026.1.2 | |

---

## 치료정보 관련 API

### 치료정보 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 치료정보 리스트 조회 | |
| **RN API** | `GET /api/contents/list?paging=false` | |
| **Webview API** | `POST /api/webview/contents/list` | |
| **Input 예시** | `{"acSeq": "244"}` | |

### 치료정보 리스트 - 검색

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 치료정보 리스트 검색 | |
| **RN API** | `GET /api/contents/list?paging=false&searchText={searchText}&diseaseSeq={cancerSelected}` | |
| **Webview API** | `POST /api/webview/contents/list` | |
| **Input 예시** | `{"acSeq": "244", "searchText": "해조류", "diseaseSeq": "6"}` | |

### 치료정보 상세

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 치료정보 상세 조회 | |
| **RN API** | `GET /api/contents/{seq}/view` | |
| **Webview API** | `GET /api/webview/contents/{seq}/view` | |
| **URL 예시** | `https://camaplus.cafe24.com/api/webview/contents/883/view` | |
| **추가일** | 2026.1.2 | |

### 나의 암정보 가이드 즐겨찾기 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 즐겨찾기 리스트 조회 | |
| **RN API** | `GET /api/contents/favoriteList` | |
| **Webview API** | `GET /api/webview/contents/favoriteList` | |
| **URL 예시** | `https://camaplus.cafe24.com/api/webview/contents/favoriteList?acSeq=542` | |
| **추가일** | 2026.1.2 | |

### 나의 암정보 가이드 즐겨찾기 저장

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 즐겨찾기 추가/삭제 | |
| **RN API** | `PUT /api/contents/favoriteSave` | |
| **Webview API** | `PUT /api/webview/contents/favoriteSave` | |
| **추가 예시** | `{"accountSeq":542, "type":"C", "contentsSeq":888}` | |
| **삭제 예시** | `{"accountSeq":542, "type":"D", "contentsSeq":888}` | |
| **추가일** | 2026.1.2 | |

---

## 암정보 가이드 여정 관련 API

### 암정보 가이드 여정 신청확인

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 신청 여부 확인 | |
| **RN API** | `GET /api/track/service/check` | |
| **Webview API** | `POST /api/webview/track/service/check` | |
| **Input 예시** | `{"seq": "244"}` | |

### 암정보 가이드 여정 정보

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 정보 조회 | |
| **RN API** | `POST /api/track/service/info` | |
| **Webview API** | `POST /api/webview/track/service/info` | |
| **Input 예시** | `{"acSeq": "244", "hospitalSeq":"1", "diseaseSeq":"2", "day":"1"}` | |

### 암정보 가이드 여정 완료확인

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 완료 확인 | |
| **RN API** | `POST /api/track/service/done` | |
| **Webview API** | `POST /api/webview/track/service/done` | |
| **Input 예시** | `{"acSeq": "244", "hospitalSeq":"1", "diseaseSeq":"2", "day":"1"}` | |

### 암정보 가이드 여정 신청정보

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 신청 정보 조회 | |
| **RN API** | `GET /api/track/service` | |
| **Webview API** | `POST /webview/track/service/request/info` | |
| **Input 예시** | `{"acSeq": "244"}` | |

### 일자별 걸음 정보

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 일자별 걸음 정보 조회 | |
| **RN API** | `POST /api/track/service/stepList` | |
| **Webview API** | `POST /api/webview/track/service/stepList` | |
| **Input 예시** | `{"accountSeq": "244"}` | |

### 암정보 가이드 여정 신청

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 신청 | |
| **RN API** | `POST /api/track/service` | |
| **Webview API** | `POST /api/webview/track/service` | |
| **추가일** | 2026.1.2 | |

### 암정보 가이드 여정 취소

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 암정보 가이드 여정 취소 | |
| **RN API** | `POST /api/track/service/cancel` | |
| **Webview API** | `POST /api/webview/track/service/cancel` | |
| **추가일** | 2026.1.2 | |

### 암정보 가이드 여정 진도율 업데이트 (비회원)

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 비회원 진도율 업데이트 | |
| **RN API** | `PUT /api/track/service/guest/progress` | |
| **Webview API** | `PUT /api/webview/track/service/guest/progress` | |
| **추가일** | 2026.1.2 | |

### 암정보 가이드 여정 진도율 업데이트 (서비스 전)

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 서비스 전 진도율 업데이트 | |
| **RN API** | `PUT /api/track/service/off/progress` | |
| **Webview API** | `PUT /api/webview/track/service/off/progress` | |
| **추가일** | 2026.1.2 | |

### 암정보 가이드 여정 진도율 업데이트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 진도율 업데이트 | |
| **RN API** | `PUT /api/track/service/progress` | |
| **Webview API** | `PUT /api/webview/track/service/progress` | |
| **추가일** | 2026.1.2 | |

---

## 건강코칭 관련 API

### 건강코칭 카테고리별 진도율

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 건강코칭 카테고리별 진도율 조회 | |
| **RN API** | `POST /api/coaching/service/getCoachingProgressList` | |
| **Webview API** | `POST /webview/coaching/service/getCoachingProgressList` | |
| **Input 예시** | `{"loginId": "5PI47M168902O"}` | |

---

## 병원 관련 API

### 병원 질병 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 병원별 질병 리스트 조회 | |
| **RN API** | `GET /api/hospital/{hSeq}/disease/list` | |
| **Webview API** | `GET /api/webview/hospital/{hSeq}/disease/list` | |
| **URL 예시** | `https://camaplus.cafe24.com/api/webview/hospital/7/disease/list` | |
| **비고** | 1: 중앙대학교병원, 7: 미국병원 | |
| **추가일** | 2026.1.2 | |

### 병원 의사 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 병원별 의사 리스트 조회 | |
| **RN API** | `GET /api/hospital/{hospitalSeq}/doctor/list` | |
| **Webview API** | `GET /api/webview/hospital/{seq}/doctor/list` | |
| **URL 예시** | `https://camaplus.cafe24.com/api/webview/hospital/1/doctor/list` | |
| **비고** | 1: 중앙대학교병원, 7: 미국병원 | |
| **추가일** | 2026.1.2 | |

### 병원 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 병원 리스트 조회 | |
| **RN API** | `GET /api/hospital/list` | |
| **Webview API** | `GET /api/webview/hospital/list` | |
| **추가일** | 2026.1.2 | |

### 병원 서비스 신청

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 병원 서비스 신청 | |
| **RN API** | `POST /api/hospital/service/apply` | |
| **Webview API** | `POST /api/webview/hospital/service/apply` | |
| **Input 예시** | `{"hospitalSeq": 7, "acSeq": 543}` | |
| **추가일** | 2026.1.2 | |

### 병원 서비스 신청 확인

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 병원 서비스 신청 여부 확인 | |
| **RN API** | `POST /api/hospital/service/check` | |
| **Webview API** | `POST /api/webview/hospital/service/check` | |
| **Input 예시** | `{"seq": 543}` | |
| **추가일** | 2026.1.2 | |

---

## 공통 API

### 질병 리스트

| 항목 | 내용 | 상태 |
|------|------|------|
| **설명** | 질병 리스트 조회 | |
| **RN API** | `GET /api/common/disease/list` | |
| **Webview API** | `GET /api/webview/common/disease/list` | |
| **추가일** | 2026.1.2 | |

---

## 📝 사용 방법

### 상태 컬럼 사용법

각 API의 **상태** 컬럼에 다음과 같이 표시하여 사용 여부를 관리할 수 있습니다:

- **✅ 사용** - 현재 사용 중인 API
- **⏸️ 미사용** - 사용하지 않는 API
- **⚠️ Deprecated** - 더 이상 사용하지 않을 예정인 API
- 빈 칸 - 아직 상태가 결정되지 않은 API

### 예시

```markdown
| **상태** | ✅ 사용 |
| **상태** | ⚠️ Deprecated |
| **상태** | ⏸️ 미사용 |
```

---

## 📌 참고사항

- **RN API**: React Native 앱에서 사용하는 API
- **Webview API**: Webview에서 사용하는 API
- 각 API의 Input 예시는 실제 사용 시 참고용입니다
- **병원 seq**: 1 = 중앙대학교병원, 7 = 미국병원

---

**최종 업데이트**: 2026.1.2
