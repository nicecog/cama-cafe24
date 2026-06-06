import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { actions, getState } from "../lib/coachingSlice";

import ExercisePage from "./Page";
import { useEffect } from "react";
import Calendar from "../component/Layout/Calendar";

export default function ExercisePageIndex() {
  const { stepDayCd, currentStepDayCd } = useSelector(
    (s: RootState) => getState(s).exercise
  );

  const dispatch = useDispatch();

  const onSelect = (selectedDay: string) => {
    dispatch(actions.setExerciseStepDayCd(selectedDay));
  };

  //   component Did mount
  useEffect(() => {
    return () => {
      // 리셋 필수
      dispatch(actions.setExerciseStepDayCd("CAL"));
    };
  }, []);

  return (
    <>
      {currentStepDayCd === "CAL" ? (
        <Calendar onSelect={onSelect} stepDayCd={stepDayCd} type="C" />
      ) : (
        <ExercisePage />
      )}
    </>
  );
}
