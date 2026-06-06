import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
export default function Day16Page() {
  // Progresss
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState({
    time: "0",
    rating: "0",
    answer: "",
  });
  const { saveCoachingAnswer } = useSaveAnswer("A");

  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: "수면 시간 총합 : " + step1.time,
      refVal1: step1.time,
    };
    const _step1_2 = {
      progressTypeCd: "A1",
      answerChoice: "수면점수 평균 : " + step1.rating,
      refVal1: step1.rating,
    };
    const _step1_3 = {
      progressTypeCd: "A1",
      answerChoice: step1.answer,
    };
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [_step1, _step1_2, _step1_3, _step2, _step3];
    saveCoachingAnswer(result);
  };
  const viewAnswer = ["수면 시간의 총합, 수면점수 평균", "", ""];

  return (
    <Section progressTypeCd={progress}>
      <ConditionView viewAnswer={viewAnswer} type="A" isMission={true}>
        {progress === 1 && (
          <Step1 data={step1} onChange={setStep1} onNext={onNext} />
        )}
        {progress === 2 && <Step2 onNext={onNext} onPrev={onPrev} />}
        {progress === 3 && <Step3 onSave={onSave} onPrev={onPrev} />}
      </ConditionView>
    </Section>
  );
}
