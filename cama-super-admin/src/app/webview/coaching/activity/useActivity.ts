import axios from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const codeData = [
  { code: "A1", codeName: "초급" },
  { code: "A2", codeName: "중급" },
  { code: "A3", codeName: "고급" },
  { code: "T1", codeName: "음성치료" },
  { code: "T2", codeName: "객담배출/호흡근운동" },
  { code: "T3", codeName: "림프부종 마사지" },
  { code: "Y", codeName: "유산소 운동" },

  { code: "E1", codeName: "대장암" },
  { code: "E2", codeName: "폐암" },
  { code: "E3", codeName: "유방암" },
  { code: "E4", codeName: "갑상선암" },

  { code: "E5", codeName: "코어" },
  { code: "E6", codeName: "유산소" },

  { code: "E7", codeName: "호흡운동" },
  { code: "E8", codeName: "음성치료" },
  { code: "E9", codeName: "림프부종마사지" },
];

export const getCodeName = (code?: string) =>
  (codeData.find((item) => item.code === code) || {}).codeName || "";
export const getCode = (codeName?: string) =>
  (codeData.find((item) => item.codeName === codeName) || {}).code || "";

const useActivityApi = (loginId?: string) => {
  //  운동평가정보 조회
  const getExerciseUserClassInfo = () =>
    useQuery({
      queryKey: ["activity", "info"],
      queryFn: async () => {
        const response = await axios
          .post("api/coaching/service/getExerciseUserClassInfo", {
            loginId,
          })
          .then((res) => res.data.response);
        return response;
      },
      initialData: [],
    });

  // 운동 콘텐츠 등록 Mutation 선언
  const saveExerciseUserClass = () => {
    return useMutation({
      mutationKey: ["activity", "save"],

      // mutationFn을 사용하여 API 호출 수행
      mutationFn: async (params: any) => {
        const response = await axios.put(
          "api/coaching/service/saveExerciseUserClass",
          params
        );
        // 이력등록
        await axios.put("api/coaching/service/saveExerciseSurveyResult", {
          ...params,
          difficultyCd: params.exerciseProgramCd,
        });

        return response.data.response;
      },
    });
  };

  //  운동콘텐츠 조회
  const getExerciseContentList = () =>
    useQuery({
      queryKey: ["activity", "list"],
      queryFn: async () => {
        const response = await axios
          .post("api/coaching/service/getExerciseContentList", {
            loginId,
          })
          .then((res) => res.data.response);
        return response;
      },
      initialData: [],
    });
  //  운동콘텐츠 조회
  const getAnswerList = () =>
    useQuery({
      queryKey: ["activity", "answerList"],
      queryFn: async () => {
        const response = await axios
          .post("api/coaching/service/userAnswerInfoList", {
            loginId,
            categoryCd: "E",
          })
          .then((res) => res.data.response);
        return response;
      },
      initialData: null,
    });

  return {
    getExerciseUserClassInfo,
    getExerciseContentList,
    saveExerciseUserClass,
    getAnswerList,
  };
};

export default useActivityApi;
