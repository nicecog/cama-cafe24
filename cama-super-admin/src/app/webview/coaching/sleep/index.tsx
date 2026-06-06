import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { actions, getState } from "../lib/coachingSlice";

import SleepPage from "./Page";
import { useEffect } from "react";
import Calendar from "../component/Layout/Calendar";

export default function SleepPageIndex() {
  // 현재 단계
  const currentStep = useSelector(
    (s: RootState) => getState(s).sleep.currentStepDayCd
  );

  const { stepDayCd } = useSelector((s: RootState) => getState(s).sleep);

  const dispatch = useDispatch();

  const onSelect = (selectedDay: string) => {
    dispatch(actions.setSleepStepDayCd(selectedDay));
  };

  //   component Did mount
  useEffect(() => {
    return () => {
      // 리셋 필수
      dispatch(actions.setSleepStepDayCd("CAL"));
    };
  }, []);

  return (
    <>
      {currentStep === "CAL" ? (
        <Calendar onSelect={onSelect} stepDayCd={stepDayCd} type="A" />
      ) : (
        <SleepPage />
      )}
    </>
  );
}
