import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { getMentalTypeCode as compatGetMentalTypeCode } from "@/routes/_auth/_coaching/coaching/mental/-component/-mentalCompat";

export function getMentalTypeCode(type: string) {
  return compatGetMentalTypeCode(type);
}

export default function useGetAnswer(
  category: "mental" | string,
  stepDayCd: string,
  progressTypeCds: string[],
) {
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const categoryCd = category === "mental" ? "D" : category;
  const { data: answerList = [] } = useUserAnswerInfoList({
    categoryCd,
    loginId,
  });

  return useMemo(
    () =>
      answerList.filter(
        (item) =>
          item.stepDayCd === stepDayCd &&
          !!item.progressTypeCd &&
          progressTypeCds.includes(item.progressTypeCd),
      ),
    [answerList, progressTypeCds, stepDayCd],
  );
}
