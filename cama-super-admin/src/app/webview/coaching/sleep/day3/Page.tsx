import { useState } from "react";
import ConditionView from "../../component/Layout/ConditionView";
import Section from "../../component/Layout/Section";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import useSteps from "@/hooks/useSteps";

export default function Day3Page() {
  const { saveCoachingAnswer } = useSaveAnswer("A");

  const { progress, onNext, onPrev } = useSteps(1, 3);

  const [step1, setStep1] = useState({
    sleep: {
      hour: "",
      minutes: "",
    },
    wakeup: {
      hour: "",
      minutes: "",
    },
  });
  const [step2, setStep2] = useState({
    totalTime: "00", //총 수면
    diffTime: "00", //이전시관가 다른 시간
  });

  const formatTimeString = (timeString: string) => {
    return timeString
      .split(":")
      .map((part) => part.padStart(2, "0"))
      .join("");
  };

  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice:
        "취침시간 : " + step1.sleep.hour + "/" + step1.sleep.minutes,
      refVal1: step1.sleep.hour + step1.sleep.minutes,
    };
    const _step1_2 = {
      progressTypeCd: "A1",
      answerChoice:
        "기상시간 : " + step1.wakeup.hour + "/" + step1.wakeup.minutes,
      refVal1: step1.wakeup.hour + step1.wakeup.minutes,
    };
    const _step2 = {
      answerChoice: "총수면 시간 : " + step2.totalTime,
      progressTypeCd: "A2",
      refVal1: formatTimeString(step2.totalTime),
    };
    const _step2_2 = {
      answerChoice: "이전선택과 차이 : " + step2.diffTime,
      progressTypeCd: "A2",
      refVal1: formatTimeString(step2.diffTime),
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [_step1, _step1_2, _step2, _step2_2, _step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = ["목표 수면 시간", "총수면 시간 과 이전 목표의 차이 ", ""];

  return (
    <Section progressTypeCd={progress}>
      <ConditionView viewAnswer={viewAnswer} type="A" isMission={true}>
        <>
          {progress === 1 && (
            <Step1 data={step1} onChange={setStep1} onNext={onNext} />
          )}
          {progress === 2 && (
            <Step2
              data={step1}
              step2Data={step2}
              onChange={setStep2}
              onPrev={onPrev}
              onNext={onNext}
            />
          )}
          {progress === 3 && (
            <Step3 data={step1} onSave={onSave} onPrev={onPrev} />
          )}
        </>
      </ConditionView>
    </Section>
  );
}
