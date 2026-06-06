import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { actions, getState } from "../lib/coachingSlice";

import DietaryHabitsPage from "./Page";
import { useEffect } from "react";
import Calendar from "../component/Layout/Calendar";

export const checkAnswerList = [
  "입맛이 없고 식욕이 떨어진다.",
  "속이 메스껍고 토할 것 같다.",
  "입안이 쓰리고 아프다.",
  "입안이 너무 건조하다.",
  "체중이 계속 줄고 있다.",
  "설사를 너무 자주 한다.",
  "변비가 생겼다.",
  "삼키는 것이 어렵다.",
];

export default function ExercisePageIndex() {
  const { stepDayCd, currentStepDayCd } = useSelector(
    (s: RootState) => getState(s).dietaryHabits
  );

  const dispatch = useDispatch();

  const onSelect = (selectedDay: string) => {
    dispatch(actions.setDietaryHabitsStepDayCd(selectedDay));
  };

  //   component Did mount
  useEffect(() => {
    return () => {
      // 리셋 필수
      dispatch(actions.setDietaryHabitsStepDayCd("CAL"));
    };
  }, []);

  return (
    <>
      {currentStepDayCd === "CAL" ? (
        <Calendar onSelect={onSelect} stepDayCd={stepDayCd} type="B" />
      ) : (
        <DietaryHabitsPage />
      )}
    </>
  );
}
