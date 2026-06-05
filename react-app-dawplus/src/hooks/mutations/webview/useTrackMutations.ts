import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyCareTrackService,
  cancelCareTrackService,
  updateGuestProgress,
  updateOffProgress,
  updateProgress,
} from "@/apis/api/webview/track";
import { queryKeys } from "@/lib/queryClient";

/**
 * 암정보 가이드 여정 신청 Mutation
 * POST /api/webview/track/service
 */
export const useApplyCareTrackService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCareTrackService,
    onSuccess: () => {
      // 여정 신청 확인 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["webview", "track", "check"],
      });
      // 여정 신청 정보 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["webview", "track", "appliedInfo"],
      });
      // 여정 서비스 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["webview", "track", "serviceList"],
      });
      // 여정 완료 정보 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["webview", "track", "done"],
      });
      // 참고: stepList(걸음 정보)는 재조회하지 않음
    },
  });
};

/**
 * 암정보 가이드 여정 취소 Mutation
 */
export const useCancelCareTrackService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      diseaseSeq: number;
      hospitalSeq: number;
      acSeq?: string | number;
    }) => {
      return cancelCareTrackService(params);
    },
    onSuccess: (_, variables) => {
      if (variables.acSeq) {
        const acSeqStr = String(variables.acSeq);
        // 여정 신청 확인 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.track.check(acSeqStr),
        });
        // 여정 신청 정보 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.track.appliedInfo(acSeqStr),
        });
      }
    },
  });
};

/**
 * 진도율 업데이트 (비회원)
 * PUT /api/webview/track/service/guest/progress
 */
export const useUpdateTrackGuestProgress = () => {
  return useMutation({
    mutationFn: (params: { contentsSeq: number; progress: number }) =>
      updateGuestProgress(params),
  });
};

/**
 * 진도율 업데이트 (서비스 전)
 * PUT /api/webview/track/service/off/progress
 */
export const useUpdateTrackOffProgress = () => {
  return useMutation({
    mutationFn: (params: {
      acSeq?: string | number;
      contentsSeq: number;
      progress: number;
    }) => updateOffProgress(params),
  });
};

/**
 * 진도율 업데이트
 * PUT /api/webview/track/service/progress
 */
export const useUpdateTrackProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      acSeq?: string | number;
      contentsSeq: number;
      progress: number;
      trackServiceSeq: number;
    }) => updateProgress(params),
    onSuccess: () => {
      // 진도율 업데이트 후 완료 정보 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["webview", "track", "done"],
      });
    },
  });
};
