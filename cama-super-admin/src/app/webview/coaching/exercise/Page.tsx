import { useDispatch, useSelector } from "react-redux";
import { FC } from "react";
import { RootState } from "@/store/store";
import StartPage from "./start/Page";
import { actions, getState } from "../lib/coachingSlice";
import NotfoundPage from "../404";
import StepLayout from "../component/Layout/StepLayout";
import Day1 from "./day1/Page";
import Day2 from "./day2/Page";
import Day3 from "./day3/Page";
import Day4 from "./day4/Page";
import Day5 from "./day5/Page";
import Day6 from "./day6/Page";
import Day7 from "./day7/Page";
import Day8 from "./day8/Page";
import Day9 from "./day9/Page";
import Day10 from "./day10/Page";
import Day11 from "./day11/Page";
import Day12 from "./day12/Page";
import Day13 from "./day13/Page";
import Day14 from "./day14/Page";
import Day15 from "./day15/Page";
import Day16 from "./day16/Page";
// 기본 컴포넌트 정의
const DefaultComponent: FC = () => {
  return <NotfoundPage />;
};

const stepComponentMap: Record<string, FC<any>> = {
  "00": () => <StartPage />,
  "01": () => <Day1 />,
  "02": () => <Day2 />,
  "03": () => <Day3 />,
  "04": () => <Day4 />,
  "05": () => <Day5 />,
  "06": () => <Day6 />,
  "07": () => <Day7 />,
  "08": () => <Day8 />,
  "09": () => <Day9 />,
  "10": () => <Day10 />,
  "11": () => <Day11 />,
  "12": () => <Day12 />,
  "13": () => <Day13 />,
  "14": () => <Day14 />,
  "15": () => <Day15 />,
  "16": () => <Day16 />,
};

// Step에 따른 컴포넌트를 렌더링하는 함수 컴포넌트 정의
const StepRenderer: FC<{ currentStep: string }> = ({ currentStep }) => {
  const StepComponent = stepComponentMap[currentStep] || DefaultComponent;
  return <StepComponent />;
};

export default function ExercisePage() {
  const currentStep = useSelector(
    (s: RootState) => getState(s).exercise.currentStepDayCd
  );

  const dispatch = useDispatch();

  const onCalendarClick = () => {
    dispatch(actions.setExerciseStepDayCd("CAL"));
  };

  return (
    <>
      <StepLayout
        currentStep={currentStep}
        maxDay={16}
        title="신체 활동"
        onCalendarClick={onCalendarClick}
      >
        <StepRenderer currentStep={currentStep} />
      </StepLayout>
    </>
  );
}
