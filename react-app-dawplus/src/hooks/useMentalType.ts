import { useAtomValue } from "jotai";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { getMentalTypeFromAnswerList } from "@/routes/_auth/_coaching/coaching/mental/-component/-mentalCompat";

export default function useMentalType() {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: answerList = [] } = useUserAnswerInfoList({
    categoryCd: "D",
    loginId,
  });

  return getMentalTypeFromAnswerList(answerList);
}
