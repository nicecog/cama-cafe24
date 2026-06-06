import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// useSelector를 사용하여 accountName을 반환하는 custom hook
const useGetAnswer = (
  type: "sleep" | "mental" | "exercise" | "dietaryHabits" | "activity",
  stepDayCd: string,
  progressTypeCd: string[]
) => {
  //  사용자 답변 목록
  const answerList = useSelector(
    (s: RootState) => s.COACHING.coaching[type]?.answerList || []
  );

  const result = answerList.filter(
    (i: any) =>
      i.stepDayCd === stepDayCd && progressTypeCd.includes(i.progressTypeCd)
  );

  return result;
};

const mapping: {
  [key: string]: string;
} = {
  ["전투형"]: "E",
  ["순응형"]: "F",
  ["억압형"]: "G",
  ["자포자기형"]: "H",
  ["걱정형"]: "J",
};
export const getMentalTypeCode = (type: string) => {
  return mapping[type];
};

export default useGetAnswer;
