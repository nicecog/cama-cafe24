# Exercise Coaching Migration Design

## Goal

`asis` 운동코칭의 평가, 결과 계산, 추천 운동 목록, 영상 재생, 완료 저장 흐름을 `tobe` 프로젝트의 `/coaching/exercise` 아래에 새로 구성한다. 백엔드 API와 payload shape은 `asis`와 동일하게 유지하고, 프론트 구조와 UI만 `tobe` 패턴에 맞게 재구성한다.

## Scope

- 포함
  - 운동평가 진입
  - 암종 선택
  - 문항 진행
  - 결과 계산
  - 운동 평가 저장
  - 추천 운동 answer seed 저장
  - 추천 운동 목록 조회
  - 영상 재생
  - 운동 완료 저장
  - 한국어 i18n json 분리
- 제외
  - exercise를 기존 day-based 공용 코칭 구조로 추상화
  - 새 백엔드 API 설계
  - payload 명세 변경
  - 세션 복구/새로고침 복구

## Constraints

- 백엔드는 변경하지 않는다.
- 기존 `asis`와 동일한 endpoint, request field, response 기대 구조를 유지한다.
- 운동 관련 신규 컴포넌트와 상태는 가능하면 `src/routes/_auth/_coaching/coaching/exercise` 내부에서 해결한다.
- 문구는 새로 창작하지 않고 `asis`의 컨텐츠를 기준으로 가져온다.
- 새로고침 시 평가 중간 상태는 유지하지 않는다.

## Source Mapping

### As-Is source

- 평가 진입: `src/app/webview/coaching/activity/eval/Page.tsx`
- 문항 진행: `src/app/webview/coaching/activity/eval/question/Page.tsx`
- 결과 계산/저장: `src/app/webview/coaching/activity/eval/result/Page.tsx`
- 추천 목록: `src/app/webview/coaching/activity/content/Page.tsx`
- 운동 리스트: `src/app/webview/coaching/activity/content/Workouts.tsx`
- 영상 재생/완료: `src/app/webview/coaching/activity/content/workoutContent/Page.tsx`
- 상태/문항: `src/app/webview/coaching/activity/eval/atoms/*`, `content/atoms/*`
- API 연결: `src/app/webview/coaching/activity/useActivity.ts`

### To-Be target

- 진입 라우트: `src/routes/_auth/_coaching/coaching/exercise/index.tsx`
- 하위 전용 라우트/컴포넌트/상태/유틸: `src/routes/_auth/_coaching/coaching/exercise/**`
- i18n: `src/locales/ko/coaching/exercise/*.json`
- API 타입/훅 확장: 기존 `src/apis/api/webview/coaching.ts`, `src/hooks/queries/webview/useCoachingQueries.ts`, `src/hooks/mutations/webview/useCoachingMutations.ts`, `src/apis/types.ts`

## Route Design

### 1. `/coaching/exercise`

- 운동평가 이력 조회
- 이력이 있으면 `/coaching/exercise/content`로 이동
- 없으면 소개 카드와 시작 버튼 노출
- 역할은 진입/분기만 담당

### 2. `/coaching/exercise/eval`

- 암종 선택 섹션과 질문 진행 화면을 한 흐름으로 구성
- 질문은 한 번에 1개씩 노출
- 답변 완료 후 `/coaching/exercise/result`로 이동
- 상태는 로컬 atom/store 사용

### 3. `/coaching/exercise/result`

- `asis`와 동일한 판정식을 그대로 사용해 `program`, `aerobic`, `therapy` 계산
- 결과 카드 표시
- 완료 시 아래 순서 실행
  1. `saveExerciseUserClass`
  2. `saveExerciseSurveyResult` 포함한 기존 저장 흐름
  3. 추천 운동 answer seed 저장
  4. `/coaching/exercise/content` 이동

### 4. `/coaching/exercise/content`

- 추천 운동 목록 조회
- 저장된 `answerList(categoryCd: "E")` 기준 추천 운동만 노출
- 완료한 운동은 완료 상태 표시
- 아이템 클릭 시 선택 운동 상태 저장 후 `/coaching/exercise/video` 이동

### 5. `/coaching/exercise/video`

- 선택 운동 정보 확인
- 유튜브 영상 재생
- 완료 버튼 클릭 시 기존 `answerList` 중 현재 운동 대응 항목의 `answerChoice`를 `"Y"`로 업데이트 후 저장
- 성공 시 완료 피드백 후 `/coaching/exercise/content` 복귀

## State Design

`exercise` 폴더 내부 전용 상태로 한정한다.

- `selectedCancer`
  - 암종 한글명 저장
- `answers`
  - 문항별 `Y | N | ""`
- `selectedWorkout`
  - 현재 재생 중 운동 객체
- `recommendedSummary`
  - 결과 화면과 저장 시 사용할 `program/aerobic/therapy`

상태 특성:

- 메모리 기반
- 새로고침 시 초기화
- 전역 공용 코칭 atom과 분리

## API Design

### Existing APIs reused as-is

- `POST api/coaching/service/getExerciseUserClassInfo`
- `POST api/coaching/service/userAnswerInfoList`
- `PUT api/coaching/service/answerList`

### APIs to add into tobe client layer

- `POST api/coaching/service/getExerciseContentList`
- `PUT api/coaching/service/saveExerciseUserClass`
- `PUT api/coaching/service/saveExerciseSurveyResult`

### Payload compatibility rule

모든 요청 body는 `asis`에서 보내는 필드와 동일해야 한다.

#### Evaluation save payload

`saveExerciseUserClass` 호출 payload:

- `loginId`
- `cancerTypeCd`
- `exerciseProgramCd`
- `aerobic`
- `therapyCd`
- `surveyResult`

`surveyResult` 배열 원소 shape:

- `seq`
- `question`
- `answer`

#### Recommended answer seed payload

`PUT /api/coaching/service/answerList`

배열 원소 필드:

- `accountName`
- `answerChoice`
- `answerChoiceSeq`
- `categoryCd`
- `loginId`
- `progressTypeCd`
- `stepDayCd`
- `refVal1`

초기 seed 저장 시:

- `categoryCd = "E"`
- `progressTypeCd = "A1"`
- `stepDayCd = "00"`
- `answerChoice = "N"`
- `answerChoiceSeq = 0`
- `refVal1 = indexNum + exerciseTypeCd + difficultyCd`

#### Video complete payload

기존 `answerList` 조회 결과 배열을 기반으로 현재 운동 대응 row만 `answerChoice = "Y"`로 바꿔 `PUT /api/coaching/service/answerList` 호출한다.

## Recommendation Logic

`asis` 로직을 변경 없이 함수로 분리한다.

### Program evaluation

- 기본값: `program = "A2"`, `aerobic = "N"`, `therapy = ""`
- 고급 판정
  - 공통 핵심 문항 집합이 모두 `Y`
  - 암종별 추가 조건 충족 시 `A3`
- 초급 판정
  - 특정 문항 `Y`일 경우 `A1`
  - 갑상선암/폐암 보조 조건 포함
- 유산소 판정
  - 공통 문항 + 암종별 보조 조건
- 특수치료 판정
  - 갑상선암 → `T1`
  - 폐암 → `T2`
  - 유방암 → `T3`

### Recommended content composition

1. 전체 운동 목록에서 `difficultyCd === program` 필터
2. 암종 전용 운동 추가
3. 공통 코어 `E5` 추가
4. 유산소 필요 시 `E6` 추가
5. 치료 필요 시 매핑된 운동 추가
   - `T1 -> E8`
   - `T2 -> E7`
   - `T3 -> E9`
6. 결과를 answer seed payload로 변환 후 저장

## Question Content Design

문항은 `asis` 질문 텍스트를 유지한다.

- 공통 13문항
- 갑상선암 4문항
- 대장암 3문항
- 폐암 3문항
- 유방암 3문항

질문 표시는 번역 문자열 기반으로 렌더링하고, 저장용 `question` 값도 동일 문자열을 사용한다.

## UI Design

`tobe`의 카드형, 라운드형, 밝은 코칭 UI를 유지한다.

- 진입: 소개 카드 + 시작 CTA
- 암종 선택: 2열 또는 1열 카드 버튼
- 문항: 현재 문항 카드 + 예/아니오 버튼
- 결과: 추천 수준/추가 처방 카드
- 목록: 추천 운동 리스트 카드
- 영상: 운동 정보 카드 + 플레이어 + 완료 CTA

주의:

- `asis` 레이아웃 직접 복붙하지 않는다.
- 기능은 동일, 스타일은 `tobe` 기준.

## File Structure

- Create: `src/routes/_auth/_coaching/coaching/exercise/-constants/exerciseQuestions.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/evaluateExerciseProgram.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-lib/buildExerciseRecommendations.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-state/exerciseAtoms.ts`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseIntro.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseCancerSelect.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseQuestionCard.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseResultCard.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseWorkoutList.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/-components/ExerciseVideoPlayer.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/eval.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/result.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/content.tsx`
- Create: `src/routes/_auth/_coaching/coaching/exercise/video.tsx`
- Modify: `src/routes/_auth/_coaching/coaching/exercise/index.tsx`
- Modify: `src/apis/api/webview/coaching.ts`
- Modify: `src/hooks/queries/webview/useCoachingQueries.ts`
- Modify: `src/hooks/mutations/webview/useCoachingMutations.ts`
- Modify: `src/apis/types.ts`
- Create: `src/locales/ko/coaching/exercise/index.json`
- Create: `src/locales/ko/coaching/exercise/eval.json`
- Create: `src/locales/ko/coaching/exercise/result.json`
- Create: `src/locales/ko/coaching/exercise/content.json`
- Create: `src/locales/ko/coaching/exercise/video.json`

## Error Handling

- 평가 상태 없이 결과/영상 진입 시 `index` 또는 `content`로 복귀
- 선택 운동 정보 없이 영상 진입 시 목록 복귀
- exercise class info 없음 + content 강제 진입 시 eval 유도
- answer 저장 실패 시 토스트/다이얼로그로 실패 안내 후 현재 화면 유지
- content list 조회 실패 시 재시도 UI 또는 기본 에러 UI

## Testing Strategy

- 판정 함수 단위 테스트
  - 암종별 `program/aerobic/therapy` 결과 검증
- 추천 목록 조합 함수 단위 테스트
  - 난이도/암종/유산소/치료 조합 검증
- payload 생성 단위 테스트
  - `saveExerciseUserClass` input
  - answer seed payload
  - video complete payload
- 라우트 흐름 컴포넌트 테스트
  - 무이력 진입 → eval
  - 이력 있음 → content
  - 질문 완료 → result
  - 결과 완료 → content
  - 영상 완료 → content

## Risks

- `tobe`에 아직 없는 API 타입이 실제 응답 shape와 어긋날 수 있다.
- `asis` 질문 텍스트를 i18n으로 옮길 때 줄바꿈 표현이 달라질 수 있다.
- `answerList` 전체 row 재저장 방식은 필드 누락 시 회귀 위험이 있다.

## Decisions

- exercise는 기존 day-based 코칭 공용 구조와 분리한다.
- 상태는 메모리 기반만 지원한다.
- 백엔드 payload는 `asis`와 동일하게 유지한다.
- 신규 문구 창작 없이 `asis` 컨텐츠를 i18n으로 옮긴다.
