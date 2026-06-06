import { useSelector } from "react-redux";

import { getState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

// useSelector를 사용하여 accountName을 반환하는 custom hook
const useMentalType = () => {
  const answerList = useSelector(
    (s: RootState) => getState(s).mental.answerList
  );
  return (
    answerList.find((r) => r.stepDayCd === "Q1" && r.progressTypeCd === "D2")
      .answerChoice || ""
  );
};

export default useMentalType;
