/**
 * Webview API 타입 정의
 */

/**
 * 계정 정보 (Account Me)
 */
export interface WebviewAccount {
  seq: number;
  loginId: string;
  email: string | null;
  nickName: string | null;
  name: string;
  phone: string;
  birth: string; // "1972-02-12" 형식
  gender: "MALE" | "FEMALE";
  signType: string; // "DEFAULT" 등
  profileImage: string | null;
  impUid: string;
  roles: string[]; // ["USER"]
  droppedOutDate: string | null;
  dropReason: string | null;
  userTypeCd: string; // "20" 등
  createdAt: string; // "2024-12-01 23:19:56" 형식
  updatedAt: string; // "2024-12-01 23:54:47" 형식
  passwordMustChange?: boolean;
  biometricLoginEnabled?: boolean;
  biometricPromptDeclined?: boolean;
}

/**
 * 병원 정보
 */
export interface WebviewHospitalInfo {
  seq: number; // 병원 시퀀스
  hospitalSeq: number;
  hospitalName: string;
}

/**
 * 치료정보 아이템
 */
export interface WebviewContentItem {
  seq: number;
  doctorSeq: number;
  trackServiceSeq: number | null;
  diseaseSeq: number;
  diseaseName: string;
  doctorName: string;
  departmentName: string;
  title: string;
  image: string;
  contents: string;
  viewCount: number;
  enabled: boolean;
  viewed: boolean;
  removed: boolean;
  interest: string; // JSON string: "[\"부작용과 대처\"]"
  createdAt: string;
  updatedAt: string;
  contentsUpdatedAt: string;
  progress: number | null;
  disease: string; // JSON string
  favoriteYn: "Y" | "N";
  priority: number | null;
}

/**
 * 암정보 가이드 여정 정보
 */
export interface WebviewCareTrackInfo {
  seq: number;
  title: string;
  image: string;
  progress: number | null; // 진행률 (0-100)
}

/**
 * 암정보 가이드 완료 정보
 */
export interface WebviewCareTrackDone {
  day: number; // 일차
  progress: number; // 진행률 (0-100)
}

/**
 * 암정보 가이드 신청 정보
 */
export interface WebviewCareTrackAppliedInfo {
  seq: number; // 신청 정보 시퀀스
  diseaseSeq: number; // 질병 시퀀스
  diseaseName: string; // 질병명 (예: "유방암")
  process: number; // 진행률 (예: 1.79)
  days: number; // 여정 총 기간 (일수)
  interest: string; // 관심사 JSON string (예: "[\"증상 알아보기\"]")
  data: string; // 일자별 컨텐츠 데이터 JSON string (예: "{\"1\": [508, 506, 874, 512], ...}")
  disease: string; // 질병 상세 정보 JSON string
  trackCreatedAt: string; // 여정 시작 날짜 (YYYY-MM-DD HH:mm:ss 형식)
}

/**
 * 걸음 정보
 */
export interface WebviewStepInfo {
  seq: number;
  loginId: string | null;
  executionDate: string; // "2025-12-04" 형식
  accountSeq: number;
  accountName: string;
  stepNum: number;
}

/**
 * 건강코칭 진도율 정보
 */
export interface WebviewCoachingProgress {
  categoryCd: string;
  categoryNm: string;
  stepDayCd: string | null;
  progressTypeCd: string | null;
  answerChoiceSeq: number;
  answerAddChoieYn: string | null;
  answerChoice: string | null;
  loginId: string | null;
  accountName: string;
  answerCnt: number;
  progress: number;
  diseaseSeq: number;
  diseaseName: string;
  diseaseTreatment: string;
  disease: string; // JSON string
  refVal1: string | null;
  refVal2: string | null;
  refVal3: string | null;
  refVal4: string | null;
  refVal5: string | null;
}

/**
 * 코칭 서비스 코드 리스트 요청 파라미터
 */
export interface CoachingCodeListParams {
  code: string;
  cd: string;
}

/**
 * 코칭 서비스 코드 아이템
 */
export interface CoachingCodeItem {
  code: string; // "ANSWER_TYPE_CD"
  name: string; // "건강코칭 답변 방식 코드"
  cd: string; // "Q4"
  val: string; // "메시지"
}

/**
 * 코칭 답변 정보 리스트 요청 파라미터
 */
export interface WebviewUserAnswerInfoListParams {
  loginId: string;
  categoryCd?: string; // "A", "B", "C", "D", "E" 등
}

/**
 * 코칭 답변 정보 아이템
 */
export interface WebviewUserAnswerInfo {
  seq: number;
  loginId: string;
  categoryCd: string;
  categoryNm: string;
  stepDayCd: string;
  progressTypeCd: string | null;
  answerChoiceSeq: number;
  answerChoice: string | null;
  refVal1: string | null;
  refVal2: string | null;
  questionCd: string;
  questionNm: string;
  answerCd: string;
  answerNm: string;
  answerVal: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 운동 사용자 클래스 정보
 */
export interface WebviewExerciseUserClassInfo {
  seq: number;
  loginId: string;
  exerciseTypeCd: string;
  exerciseTypeNm: string;
  exerciseProgramCd: string;
  exerciseProgramNm: string;
  difficultyCd: string;
  difficultyNm: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 운동 콘텐츠 아이템
 */
export interface WebviewExerciseContentItem {
  difficultyCd: string;
  engName: string;
  exerciseTypeCd: string;
  indexNum: number;
  korName: string;
  loginId: string | null;
  url: string;
}

/**
 * 건강코칭 명상 영상 정보
 */
export interface WebviewMentalVideoItem {
  seq: number;
  loginId: string | null;
  priority: number;
  url: string;
  useYn: string;
  videoTypeCd: string;
  detailDesc: string;
  createdAt: string;
  updatedAt: string;
  lang: string | null;
}

/**
 * 운동 평가 결과 문답 항목
 */
export interface ExerciseSurveyResultItem {
  seq: number;
  question: string;
  answer: string;
}

/**
 * 운동 평가 저장 요청 파라미터
 */
export interface SaveExerciseUserClassParams {
  loginId: string;
  cancerTypeCd: string;
  exerciseProgramCd: string;
  aerobic: string;
  therapyCd: string;
  surveyResult: ExerciseSurveyResultItem[];
}

/**
 * 웰빙 리소스 리스트 요청 파라미터
 */
export interface WellbeingResourceListParams {
  searchType: "title";
  searchText: string;
  wellbeingCategoryCd: string;
  page: number;
}

/**
 * 웰빙 리소스 아이템
 */
export interface WellbeingResourceItem {
  seq: number;
  wellbeingCategoryCd: string;
  wellbeingCategoryNm: string;
  companyName: string;
  companyDescription: string;
  title: string;
  contents: string;
  thumbnail: string;
  address: string;
  phoneNumber: string;
  homepage: string;
  sns: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
  lang: string | null;
  enabled: boolean;
}

/**
 * 웰빙 Pagination 정보
 */
export interface WellbeingPagination {
  startNum: number;
  endNum: number;
  totalCount: number;
  currentPage: number;
  totalPage: number;
  displayPage: number;
  displayRow: number;
  beginPage: number;
  endPage: number;
  prevPage: number;
  nextPage: number;
}

/**
 * 알림 정보
 */
export interface WebviewNotification {
  seq: number;
  accountSeq: number | null;
  message: string;
  createdAt: string; // "2026-01-11 15:55:33" 형식
}
/**
 * 일정 정보
 */
export interface WebviewSchedule {
  scheduleSeq: number;
  batchSeq: number;
  scheduleName: string;
  diseaseSeq: number | null;
  scheduleType: "HOSPITAL" | "MEDICINE" | "ETC";
  scStartDate: string; // "2026-01-11" 형식
  scEndDate: string; // "2026-01-11" 형식
  startDate: string; // "2026-01-11" 형식
  endDate: string; // "2026-01-11" 형식
  time: string; // "08:00:00" 형식
  days: string; // JSON string "[]"
  memo: string;
  repeat: boolean;
  alarm: boolean;
  done: boolean;
  createdAt: string; // "2026-01-11 11:48:47" 형식
}

/**
 * 코칭 답변 저장 요청 파라미터
 */
export interface SaveCoachingAnswerParams {
  progressTypeCd: string; // 단계/항목 구분 코드 (예: A1, A2, A3)
  answerChoice: string; // 답변 요약 텍스트
  refVal1?: string | number; // 참조/순수 값 (추가 입력값이나 수치 데이터)
  answerAddChoiceYn?: string;
  categoryCd: string; // 서비스 카테고리 (예: 수면=A, 운동=C)
  stepDayCd: string; // 코칭 진행 회차 (일차/회차 코드)
  loginId: string; // 사용자 식별자
  accountName: string; // 사용자명
  answerChoiceSeq: number; // 답변 시퀀스 (기본값 0)
}

/**
 * 걸음수 저장 요청 파라미터
 */
export interface SaveCoachingStepParams {
  loginId: string; // 사용자 식별자
  executionDate: string; // "2026-01-11" 형식
  stepNum: number; // 걸음수
}

/**
 * 걸음수 저장 요청 (WebView track API)
 */
export interface WebviewStepSaveParams {
  accountSeq: number;
  executionDate: string; // "2026-01-11" 형식
  stepNum: number;
}

/**
 * 진찰시 문의사항
 */
export interface WebviewConsultationInquiry {
  seq: number;
  accountSeq: number;
  title: string;
  content: string;
  transmitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationInquiryFormParams {
  acSeq: string | number;
  title: string;
  content: string;
}
