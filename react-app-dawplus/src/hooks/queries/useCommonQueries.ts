import { useQuery } from "@tanstack/react-query";
import { getCommonDiseaseList } from "@/apis/api";
import { queryKeys } from "@/lib/queryClient";

/**
 * 질병 리스트 조회
 * GET /api/common/disease/list
 */
export const useCommonDiseaseList = () => {
  return useQuery({
    queryKey: queryKeys.common.diseaseList(),
    queryFn: getCommonDiseaseList,
  });
};
