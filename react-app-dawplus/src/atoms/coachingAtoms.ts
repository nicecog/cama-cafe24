import { atom } from "jotai";
import { atomFamily } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { fetchCoachingCodeList } from "@/apis/api/webview/coaching";
import { queryKeys } from "@/lib/queryClient";

/**
 * 코칭 서비스 코드 리스트 Atom
 * 전체 코드 리스트를 전역 상태로 관리
 */
export const coachingCodeListAtom = atomWithQuery(() => ({
  queryKey: queryKeys.webview.coaching.codeList("", ""),
  queryFn: () => fetchCoachingCodeList({ code: "", cd: "" }),
  select: (data) => data.response ?? [],
  staleTime: 1000 * 60 * 30, // 30분
  gcTime: 1000 * 60 * 60, // 1시간
}));

// const answerTypes = useAtomValue(coachingCodeByTypeAtom("ANSWER_TYPE_CD"));
export const coachingCodeByTypeAtom = atomFamily((code: string) =>
  atom((get) => {
    const result = get(coachingCodeListAtom);
    return (result.data ?? []).filter((item) => item.code === code);
  }),
);
