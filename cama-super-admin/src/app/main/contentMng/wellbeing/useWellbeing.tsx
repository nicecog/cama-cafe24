import axios from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { wellbeingSearchInfoAtom, type WellbeingType, type WellbeingInsertType } from "./wellbeingAtom";
import { useAtom } from "jotai";

const useWellbeing = () => {
  const searchInfo = useAtom(wellbeingSearchInfoAtom);

  //목록조회
  const getWellbeingResourceList = () =>
    useQuery({
      queryKey: ["wellbing", "list"],
      queryFn: async () => {
        const response = await axios
          .post("/api/doctor/wellbeing/resources/getWellbeingResourceList", {
            ...searchInfo,
          })
          .then((res) => res.data.response);
        return response;
      },
      initialData: [],
    });

  // 상세조회
  const getWellbeingResourceDetail = (seq?: string) =>
    useQuery({
      queryKey: ["wellbing", "detail"],
      queryFn: async () => {
        const response = await axios
          .post(`/api/doctor/wellbeing/${seq}/view/getWellbeingResourceDetail`)
          .then((res) => res.data.response);
        return response;
      },
      enabled: !!seq,
    });

  // 수정
  const updateWellbeingResources = (seq?: string) => {
    return useMutation({
      mutationKey: ["wellbing", "update"],

      // mutationFn을 사용하여 API 호출 수행
      mutationFn: async (params: any) => {
        const response = await axios.put(
          `/api/doctor/wellbeing/resources/${seq}/view/updateWellbeingResources`,
          params
        );
        return response.data.response;
      },
    });
  };
  // 등록
  const insertWellbeingResources = () => {
    return useMutation({
      mutationKey: ["wellbing", "insert"],

      // mutationFn을 사용하여 API 호출 수행
      mutationFn: async (params: any) => {
        const response = await axios.post(
          `/api/doctor/wellbeing/resources/insertWellbeingResources`,
          params
        );
        return response.data.response;
      },
    });
  };

  // 삭제
  const deleteWellbeingResources = (seq?: string) => {
    return useMutation({
      mutationKey: ["wellbing", "insert"],

      // mutationFn을 사용하여 API 호출 수행
      mutationFn: async (params: any) => {
        const response = await axios.delete(
          `/api/doctor/wellbeing/resources/${seq}/view/deleteWellbeingResources`,
          params
        );
        return response.data.response;
      },
    });
  };

  return {
    getWellbeingResourceList,
    getWellbeingResourceDetail,
    updateWellbeingResources,
    insertWellbeingResources,
    deleteWellbeingResources,
  };
};

export default useWellbeing;


type ParamsTypeProps = {page :number, searchText : string, searchType : string, lang : string}
type ResponseType = {
    "success": true,
    "error": null,
    "response": WellbeingType[],
    "pagination": {
        "startNum": number,
        "endNum": number,
        "totalCount": number,
        "currentPage": number,
        "totalPage": number,
        "displayPage": number,
        "displayRow": number,
        "beginPage": number,
        "endPage": number,
        "prevPage": number,
        "nextPage": number
    }
}
 //목록조회
  export const useGetWellbeingResourceList = (params  : ParamsTypeProps) =>
    useQuery<ResponseType, Error >({
      queryKey: ["wellbing", "list", params],
      queryFn: async () => {
        const response = await axios.post<ResponseType>("/api/doctor/wellbeing/resources/getWellbeingResourceList", params);
        return response.data;
      },
     
    });


// ============ Mutations ============

// 신규 등록
export const useInsertWellbeingResourcesMutation = () => {
  return useMutation({
    mutationFn: async (params: WellbeingInsertType) => {
      const response = await axios.post(
        `/api/doctor/wellbeing/resources/insertWellbeingResources`,
        params
      );
      return response.data;
    },
  });
};

