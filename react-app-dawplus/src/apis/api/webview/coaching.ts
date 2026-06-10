import { api } from "../../client";
import type {
  ApiResponse,
  CoachingCodeItem,
  CoachingCodeListParams,
  SaveCoachingAnswerParams,
  SaveCoachingStepParams,
  SaveExerciseUserClassParams,
  WebviewCoachingProgress,
  WebviewExerciseContentItem,
  WebviewExerciseUserClassInfo,
  WebviewUserAnswerInfo,
  WebviewUserAnswerInfoListParams,
} from "../../types";

/**
 * 코칭 답변 리스트 저장
 * PUT /api/coaching/service/answerList
 */
export const saveCoachingAnswerList = async (
  params: SaveCoachingAnswerParams[],
): Promise<ApiResponse<void>> => {
  return api
    .put("api/coaching/service/answerList", {
      json: params,
    })
    .json();
};

/**
 * 걸음수 저장
 * PUT /api/coaching/service/step
 */
export const saveCoachingStep = async (
  params: SaveCoachingStepParams,
): Promise<ApiResponse<void>> => {
  return api
    .put("api/coaching/service/step", {
      json: params,
    })
    .json();
};

/**
 * 건강코칭 카테고리별 진도율 조회
 * POST /api/coaching/service/getCoachingProgressList
 */
export const fetchCoachingProgressList = async (
  loginId: string,
): Promise<ApiResponse<WebviewCoachingProgress[]>> => {
  return api
    .post("api/coaching/service/getCoachingProgressList", {
      json: { loginId },
    })
    .json();
};

/**
 * 코칭 답변 정보 리스트 조회
 * POST /api/coaching/service/userAnswerInfoList
 */
export const fetchUserAnswerInfoList = async (
  params: WebviewUserAnswerInfoListParams,
): Promise<ApiResponse<WebviewUserAnswerInfo[]>> => {
  return api
    .post("api/coaching/service/userAnswerInfoList", {
      json: params,
    })
    .json();
};

/**
 * 운동 사용자 클래스 정보 조회
 * POST /api/coaching/service/getExerciseUserClassInfo
 */
export const fetchExerciseUserClassInfo = async (
  loginId: string,
): Promise<ApiResponse<WebviewExerciseUserClassInfo>> => {
  return api
    .post("api/coaching/service/getExerciseUserClassInfo", {
      json: { loginId },
    })
    .json();
};

/**
 * 운동 콘텐츠 리스트 조회
 * POST /api/coaching/service/getExerciseContentList
 */
export const fetchExerciseContentList = async (
  loginId: string,
): Promise<ApiResponse<WebviewExerciseContentItem[]>> => {
  return api
    .post("api/coaching/service/getExerciseContentList", {
      json: { loginId },
    })
    .json();
};

/**
 * 운동 평가 결과 저장
 * PUT /api/coaching/service/saveExerciseUserClass
 */
export const saveExerciseUserClass = async (
  params: SaveExerciseUserClassParams,
): Promise<ApiResponse<void>> => {
  return api
    .put("api/coaching/service/saveExerciseUserClass", {
      json: params,
    })
    .json();
};

/**
 * 운동 평가 설문 이력 저장
 * PUT /api/coaching/service/saveExerciseSurveyResult
 */
export const saveExerciseSurveyResult = async (
  params: SaveExerciseUserClassParams,
): Promise<ApiResponse<void>> => {
  return api
    .put("api/coaching/service/saveExerciseSurveyResult", {
      json: {
        ...params,
        difficultyCd: params.exerciseProgramCd,
      },
    })
    .json();
};

/**
 * 코칭 서비스 코드 리스트 조회
 * POST /api/coaching/service/codeList
 */
export const fetchCoachingCodeList = async (
  params: CoachingCodeListParams,
): Promise<ApiResponse<CoachingCodeItem[]>> => {
  return api
    .post("api/coaching/service/codeList", {
      json: params,
    })
    .json();
};
