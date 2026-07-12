import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createConsultationInquiry,
  deleteConsultationInquiry,
  markConsultationInquiriesTransmitted,
  updateConsultationInquiry,
} from "@/apis/api/webview/consultationInquiry";
import type {
  ApiResponse,
  ConsultationInquiryFormParams,
  WebviewConsultationInquiry,
} from "@/apis/types";
import { queryKeys } from "@/lib/queryClient";

async function refreshConsultationList(
  queryClient: ReturnType<typeof useQueryClient>,
  acSeq: string | number,
) {
  const key = queryKeys.webview.consultationInquiry.list(acSeq);
  await queryClient.invalidateQueries({
    queryKey: queryKeys.webview.consultationInquiry.all,
  });
  await queryClient.refetchQueries({ queryKey: key });
}

export const useCreateConsultationInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConsultationInquiryFormParams) =>
      createConsultationInquiry(data),
    onSuccess: async (result, variables) => {
      const key = queryKeys.webview.consultationInquiry.list(variables.acSeq);
      const created = result.response;
      if (created) {
        queryClient.setQueryData(
          key,
          (old: ApiResponse<WebviewConsultationInquiry[]> | undefined) => {
            const prev = old?.response ?? [];
            return {
              success: true,
              error: null,
              response: [
                created,
                ...prev.filter((item) => item.seq !== created.seq),
              ],
            };
          },
        );
      }
      await refreshConsultationList(queryClient, variables.acSeq);
    },
  });
};

export const useUpdateConsultationInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seq,
      data,
    }: {
      seq: number | string;
      data: ConsultationInquiryFormParams;
    }) => updateConsultationInquiry(seq, data),
    onSuccess: async (_data, variables) => {
      await refreshConsultationList(queryClient, variables.data.acSeq);
    },
  });
};

export const useDeleteConsultationInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      seq,
      acSeq,
    }: {
      seq: number | string;
      acSeq: string | number;
    }) => deleteConsultationInquiry(seq, acSeq),
    onSuccess: async (_data, variables) => {
      await refreshConsultationList(queryClient, variables.acSeq);
    },
  });
};

export const useMarkConsultationInquiriesTransmitted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      acSeq: string | number;
      seqs: Array<number | string>;
    }) => markConsultationInquiriesTransmitted(data),
    onSuccess: async (_data, variables) => {
      await refreshConsultationList(queryClient, variables.acSeq);
    },
  });
};
