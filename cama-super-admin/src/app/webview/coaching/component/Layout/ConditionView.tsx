import { actions, getState } from "../../lib/coachingSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ReactNode } from "react";
import MainCard from "./MainCard";

import useFontSize from "@/hooks/useFontSize";
import MissionComplete from "./MissionComplete";

type ConditionViewType = {
  viewAnswer: any[];
  type: "A" | "B" | "C" | "D" | "E";
  children: ReactNode;
  isMission?: boolean;
};

export default function ConditionView(props: ConditionViewType) {
  const { viewAnswer, type, isMission } = props;

  const dispatch = useDispatch();

  const { sleep, dietaryHabits, exercise, mental, activity } = useSelector(
    (r: RootState) => getState(r)
  );

  const typesMap = {
    A: {
      stepDayCd: sleep.currentStepDayCd,
      answerList: sleep.answerList,
    },
    B: {
      stepDayCd: dietaryHabits.currentStepDayCd,
      answerList: dietaryHabits.answerList,
    },
    C: {
      stepDayCd: exercise.currentStepDayCd,
      answerList: exercise.answerList,
    },
    E: {
      stepDayCd: activity.currentStepDayCd,
      answerList: activity.answerList,
    },
    D: { stepDayCd: mental.currentStepDayCd, answerList: mental.answerList },
  };

  const { stepDayCd, answerList } = typesMap[type];

  const filteredAnswerList = answerList.filter(
    (r: any) => r.stepDayCd === stepDayCd
  );

  // 답이 있는지 여부
  const isComplete = filteredAnswerList.length > 0;

  // 캘린더 이동
  const onCalendarClick = () => {
    const actionsMap = {
      A: actions.setSleepStepDayCd("CAL"),
      B: actions.setDietaryHabitsStepDayCd("CAL"),
      C: actions.setExerciseStepDayCd("CAL"),
      D: actions.setMentalStepDayCd("CAL"),
      E: actions.setActivityStepDayCd("CAL"),
    };
    if (type in actionsMap) {
      dispatch(actionsMap[type]);
    }
  };

  const answerResults: any[] = Object.values(
    filteredAnswerList.reduce(
      (acc, curr) => {
        acc[curr.progressTypeCd] = acc[curr.progressTypeCd] || [];
        acc[curr.progressTypeCd].push(curr);
        return acc;
      },
      { A1: [], A2: [], A3: [] }
    ) // A1, A2, A3에 해당하는 목록이 없는 경우 빈 배열로 초기화
  );

  const [fontSize] = useFontSize([-2]);

  return (
    <>
      {isComplete ? (
        <>
          <MainCard>
            {viewAnswer.map(
              (ans: any, idx: number) =>
                ans && (
                  <div
                    className={`my-2  mb-8 text-text`}
                    style={{ fontSize }}
                    key={idx}
                  >
                    {ans}
                    <div
                      className="py-3.5 px-4 bg-white rounded-md text-camaColor1 font-bold mt-3"
                      style={{ fontSize }}
                    >
                      {answerResults[idx]?.map((r: any, idx: number) => (
                        <p key={idx} className="">
                          {r.answerChoice}
                        </p>
                      ))}
                    </div>
                  </div>
                )
            )}
          </MainCard>

          <div className="fixed bottom-0 w-full h-[60px]  border-t">
            <button
              className={`w-full h-full bg-camaColor1 text-white font-bold text-xl`}
              onClick={onCalendarClick}
            >
              확인
            </button>
          </div>
        </>
      ) : (
        <>
          {props.children}
          {isMission && <MissionComplete />}
        </>
      )}
    </>
  );
}
