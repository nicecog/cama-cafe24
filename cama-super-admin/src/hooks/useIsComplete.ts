import { useSelector } from "react-redux";

import { getState } from "@/app/webview/coaching/lib/coachingSlice";
import { RootState } from "@/store/store";

const useComplete = (props: "A" | "B" | "C" | "D" | "E") => {
  const { sleep, dietaryHabits, exercise, mental, activity } = useSelector(
    (r: RootState) => getState(r)
  );

  const typesMap = {
    A: { stepDayCd: sleep.currentStepDayCd, answerList: sleep.answerList },
    B: {
      stepDayCd: dietaryHabits.currentStepDayCd,
      answerList: dietaryHabits.answerList,
    },
    C: {
      stepDayCd: activity.currentStepDayCd,
      answerList: activity.answerList,
    },
    D: { stepDayCd: mental.currentStepDayCd, answerList: mental.answerList },
    E: {
      stepDayCd: exercise.currentStepDayCd,
      answerList: exercise.answerList,
    },
  };

  const { stepDayCd, answerList } = typesMap[props];

  const filteredAnswerList = answerList.filter(
    (r: any) => r.stepDayCd === stepDayCd
  );

  // 답이 있는지 여부
  const isComplete = filteredAnswerList.length > 0;

  return [isComplete, filteredAnswerList, stepDayCd];
};

export default useComplete;
