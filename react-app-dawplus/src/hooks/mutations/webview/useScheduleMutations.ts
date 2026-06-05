import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  updateSchedule,
  updateScheduleDone,
  updateScheduleUnDone,
} from "@/apis/api/webview/schedule";
import { queryKeys } from "@/lib/queryClient";

/**
 * 일정 완료 처리 Mutation
 * POST /api/webview/schedule/{batchSeq}/done/{acSeq}
 */
export const useUpdateScheduleDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchSeq,
      acSeq,
    }: {
      batchSeq: number | string;
      acSeq: number | string;
    }) => updateScheduleDone(batchSeq, acSeq),
    onSuccess: () => {
      // 일정 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.schedule.all,
      });
    },
  });
};

/**
 * 일정 미완료 처리 Mutation
 * POST /api/webview/schedule/{batchSeq}/unDone/{acSeq}
 */
export const useUpdateScheduleUnDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      batchSeq,
      acSeq,
    }: {
      batchSeq: number | string;
      acSeq: number | string;
    }) => updateScheduleUnDone(batchSeq, acSeq),
    onSuccess: () => {
      // 일정 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.schedule.all,
      });
    },
  });
};

/**
 * 일정 삭제 Mutation
 * DELETE /api/webview/schedule/{seq}/view/{acSeq}
 */
export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seq,
      acSeq,
    }: {
      seq: number | string;
      acSeq: number | string;
    }) => deleteSchedule(seq, acSeq),
    onSuccess: () => {
      // 일정 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.schedule.all,
      });
    },
  });
};

/**
 * 일정 등록 Mutation
 * POST /api/webview/schedule
 */
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createSchedule>[0]) =>
      createSchedule(data),
    onSuccess: () => {
      // 일정 관련 쿼리 무효화 (일별, 월별 모두 최신화)
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.schedule.all,
      });
    },
  });
};

/**
 * 일정 수정 Mutation
 * PUT /api/webview/schedule/{seq}/view
 */
export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seq,
      data,
    }: {
      seq: number | string;
      data: Parameters<typeof updateSchedule>[1];
    }) => updateSchedule(seq, data),
    onSuccess: () => {
      // 일정 관련 쿼리 무효화 (일별, 월별 모두 최신화)
      queryClient.invalidateQueries({
        queryKey: queryKeys.webview.schedule.all,
      });
    },
  });
};
