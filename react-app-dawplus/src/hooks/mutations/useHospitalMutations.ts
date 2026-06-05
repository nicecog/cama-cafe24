import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyHospitalService } from "@/apis/api";
import { queryKeys } from "@/lib/queryClient";

/**
 * 병원 서비스 신청 Mutation
 */
export const useApplyHospitalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hospitalSeq,
      acSeq,
    }: {
      hospitalSeq: number;
      acSeq: number;
    }) => applyHospitalService(hospitalSeq, acSeq),
    onSuccess: (_, variables) => {
      // 병원 서비스 신청 확인 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.hospital.serviceCheck(variables.acSeq),
      });
    },
  });
};
