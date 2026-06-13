import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useCoachingProgressList } from "@/hooks/queries";

export default function useDiseaseName() {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: progressList = [] } = useCoachingProgressList(loginId);

  return progressList.find((item) => item.categoryCd === "D")?.diseaseName ?? "";
}
