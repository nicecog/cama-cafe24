# Billive API 정합성: React(cama-doctor) ↔ Spring Web(cama-doctor_web)

본 문서는 React 앱의 `mainApiClient`(baseURL: `https://api.billive.me`) 호출과, Spring 프로젝트의 **동일 경로 프록시**(`/proxy` + `/api/...`) 및 **`cama-api.js` 래퍼**를 대조합니다.  
서버는 모든 Billive REST 경로를 `BilliveProxyController`로 전달할 수 있으며, 실제 호출은 브라우저에서 `CamaApi`를 통해 이루어집니다.

---

## 1. 공통 규칙

| 항목 | React | Spring Web |
|------|--------|------------|
| Base URL | `mainApiClient` 설정값 | `application.yml` → `cama.billive.base-url` (프록시가 Billive로 전달) |
| 클라이언트 경로 | `https://api.billive.me/api/...` | 동일 출처 `/proxy/api/...` (`CamaApi`가 조립) |
| 인증 헤더 | `api_key: Bearer <token>` | 동일 |
| 응답 형식 | `{ success, response, pagination, error }` 래퍼 언랩 | `cama-api.js`의 `unwrapEnvelope`와 동일 |

---

## 2. API 대조표 (React 서비스 모듈 기준)

### 2.1 인증 — `src/services/apis/auth/index.ts`

| React 메서드 | HTTP | 경로 | Spring `CamaApi` 래퍼 | 호출 위치 |
|----------------|------|------|-------------------------|-----------|
| `login(dto)` | POST | `/api/auth` | `postAuth(dto)` | (의사 전용 앱에서는 미사용 가능) |
| `loginDoctor(dto)` | POST | `/api/auth/doctor` | `postAuthDoctor(dto)` | `login.js` |

### 2.2 의사·치료·서비스 — `src/services/apis/doctorContents/index.ts`

| React 메서드 | HTTP | 경로 | Spring `CamaApi` 래퍼 | 호출 위치 |
|----------------|------|------|-------------------------|-----------|
| `fetchDoctorContentsList` | GET | `/api/doctor/contents?page=&searchType=&searchText=` | `getDoctorContentsList(page, searchType, searchText)` | `treatment-list.js` |
| `fetchDoctorContentsDisabledList` | GET | `/api/doctor/disable/contents?...` | `getDoctorContentsDisabledList(page, searchType, searchText)` | `treatment-disabled-list.js` |
| `addDoctorContents` | POST | `/api/doctor/contents` | `postDoctorContents(dto)` | `treatment-form.js` |
| `getDoctorContentsDetail` | GET | `/api/doctor/contents/{seq}/view` | `getDoctorContentsView(seq)` | `treatment-form.js` |
| `updateDoctorContents` | PUT | `/api/doctor/contents/{seq}/view` | `putDoctorContentsView(seq, dto)` | `treatment-form.js` |
| `deleteDoctorContents` | DELETE | `/api/doctor/contents/{seq}/view` | `deleteDoctorContentsView(seq)` | `treatment-form.js` |
| `getDoctorInfoCount` | GET | `/api/doctor/count/info` | `getDoctorCountInfo()` | `refreshSidebarCountsFromApi()` 내부 |
| `getDoctorMe` | GET | `/api/doctor/me` | `getDoctorMe()` | `app-shell.js`, `treatment-form.js`, `approve-service.js` |
| `fetchDoctorServiceList` | GET | `/api/doctor/service` (선택 `?page=`) | `getDoctorServiceList(page)` | `service-list.js` |
| `getDoctorServiceDetail` | GET | `/api/doctor/service/{seq}/view` | `getDoctorServiceView(seq)` | `approve-service.js` |
| `updateDoctorServiceStatus` | PUT | `/api/doctor/service/{seq}/view` | `putDoctorServiceView(seq, dto)` | `approve-service.js` |

**React `Navigation` / 치료 목록**과 동일하게, 완료·작성중 건수는 `GET /api/doctor/count/info`로 갱신합니다.

| 동작 | React | Spring Web |
|------|--------|------------|
| 사이드바 `(건수)` | `Navigation` → `getDoctorInfoCount` | `app-shell.js` → `refreshSidebarCountsFromApi()` |
| 목록 진입 시 갱신 | `TreatmentList` / `TreatmentDisabledList` → `initCountData` | 동일 목록 JS에서 `refreshSidebarCountsFromApi()` |
| 저장·수정·삭제 후 | (React는 Recoil 전역 갱신) | `treatment-form.js` 성공 시 `refreshSidebarCountsFromApi()` |

사이드바 마크업: `fragments/sidebar.html`의 `#navCountDone`, `#navCountIng`.

### 2.3 모니터링 — `src/services/apis/monitoring/index.ts`

| React 메서드 | HTTP | 경로 | Spring `CamaApi` 래퍼 | 호출 위치 |
|----------------|------|------|-------------------------|-----------|
| `fetchPatientMonitoringList` | GET | `/api/monitoring/patient?page=&searchType=&searchText=` | `getMonitoringPatientList(page, searchType, searchText)` | `patient-list.js` |

### 2.4 공개 웹뷰 — `src/services/apis/contents/index.tsx`

| React 메서드 | HTTP | 경로 | Spring 호출 | 비고 |
|----------------|------|------|---------------|------|
| `getContentsDetailForWebview` | GET | `/api/contents/{seq}/webview` | `getContentsDetailForWebview(seq)` | `public-care-track.js` (토큰 없이 호출 가능) |

### 2.5 공통 — `src/services/apis/common/index.ts`

| React 메서드 | HTTP | 경로 | Spring `CamaApi` 래퍼 | 호출 위치 |
|----------------|------|------|-------------------------|-----------|
| `uploadImage` | POST | `/api/common/images/upload` (multipart, 필드 `img`) | `postCommonImagesUpload(formData)` | `treatment-form.js` |
| `uploadBase64Image` | POST | `/api/common/images/base64/upload` | `postCommonImagesBase64Upload(dto)` | `treatment-form.js`, `article-add.js` |
| `fetchCancerStepList` | POST | `/api/common/care/time/type` | `postCommonCareTimeType()` | React 화면에서 미호출; 래퍼만 동일 제공 |
| `fetchHospitalDiseaseList` | GET | `/api/common/disease/{hospitalSeq}/detail/list` | `getCommonDiseaseDetailList(hospitalSeq)` | `approve-service.js` |
| `fetchDiseaseList` | GET | `/api/common/disease/list` | `getCommonDiseaseList()` | `approve-service.js` |
| `fetchNewHospitalDiseaseList` | GET | `/api/common/hospital/{hSeq}/disease/list` | `getCommonHospitalDiseaseList(hospitalSeq)` | `treatment-form.js` |

---

## 3. 누락 여부 요약

| 구분 | 결과 |
|------|------|
| Billive REST 경로 | React `services/apis`에 정의된 경로와 **동일한 URL**을 Spring 클라이언트에서 호출 |
| 래퍼 | `static/js/cama-api.js`에 React 모듈과 **1:1 대응하는 메서드명**으로 정리 |
| 이전 대비 보완 | `GET /api/doctor/count/info` → `refreshSidebarCountsFromApi()` 및 목록/폼 성공 후 갱신으로 **React와 동일한 UX** |
| 미연동 화면 | **볼거리(Articles)** — React에도 전용 Billive API 없음 (`docs` 범위 외) |
| `POST /api/auth` | 일반 로그인용; 현재 로그인 화면은 **`postAuthDoctor`만** 사용 (React와 동일한 의사 플로우) |

---

## 4. 파일 참조

| 파일 | 역할 |
|------|------|
| `src/main/resources/static/js/cama-api.js` | Billive API 래퍼·프록시·사이드바 건수 갱신 |
| `src/main/java/.../BilliveProxyController.java` | 임의 `/proxy/**` → `cama.billive.base-url` 전달 |
| `src/main/resources/static/js/*.js` | 화면별 호출 (위 표 참조) |

---

## 5. 변경 이력

- React API 목록과 동일하도록 `CamaApi`에 래퍼 메서드 추가 및 각 페이지에서 사용.
- `GET /api/doctor/count/info` 호출 및 사이드 배지 반영으로 Navigation·치료 목록과 동작 정합.

문서 버전: Spring Web 저장소 기준 동기화 완료 시점에 맞춤.
