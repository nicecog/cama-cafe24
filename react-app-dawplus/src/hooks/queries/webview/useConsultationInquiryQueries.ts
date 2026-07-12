import { useQuery } from "@tanstack/react-query";
import { getConsultationInquiries } from "@/apis/api/webview/consultationInquiry";
import { queryKeys } from "@/lib/queryClient";

export const useConsultationInquiries = (
  acSeq: string | number,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.webview.consultationInquiry.list(acSeq),
    queryFn: () => getConsultationInquiries(acSeq),
    enabled: enabled && !!acSeq,
    select: (data) => data.response ?? [],
    staleTime: 0,
    refetchOnMount: "always",
  });
};
