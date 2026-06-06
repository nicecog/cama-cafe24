import Question from "@/assets/images/character/question.png";
import useFontSize from "@/hooks/useFontSize";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { getState } from "../../lib/coachingSlice";
import { useMemo } from "react";

export default function QuestionHeader({
  type,
}: {
  type: "A" | "B" | "C" | "D" | "E";
}) {
  const sleep = useSelector(
    (s: RootState) => getState(s).sleep.currentStepDayCd
  );
  const mental = useSelector(
    (s: RootState) => getState(s).mental.currentStepDayCd
  );
  const exercise = useSelector(
    (s: RootState) => getState(s).exercise.currentStepDayCd
  );
  const dietaryHabits = useSelector(
    (s: RootState) => getState(s).dietaryHabits.currentStepDayCd
  );
  const activity = useSelector(
    (s: RootState) => getState(s).activity.currentStepDayCd
  );

  const currentDay = useMemo(() => {
    const typeMap = {
      A: { max: 16, current: sleep },
      B: { max: 16, current: dietaryHabits },
      C: { max: 16, current: exercise },
      D: { max: 16, current: mental },
      E: { max: 16, current: activity },
    };

    return typeMap[type] || { max: 0, current: 0 };
  }, [type]);

  const [xl] = useFontSize([2]);

  return (
    <>
      <div className="flex justify-center items-center gap-2 bg-white py-4 font-bold  border-[#E8E8E8]  rounded-2xl border-[3px]">
        <img src={Question} alt="mission" className="h-[60px]" />
        <div className="">
          <p style={{ fontSize: xl }}>{currentDay.max}일차의 도전 중</p>
          <p className="-mt-1 " style={{ fontSize: xl }}>
            <span className="text-camaColorLight  mr-1">
              {+currentDay.current}일차
            </span>
            입니다!
          </p>
        </div>
      </div>
    </>
  );
}
