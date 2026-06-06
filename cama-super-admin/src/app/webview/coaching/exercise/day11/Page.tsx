import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
export default function Day11Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState("");

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = {
      answerChoice: step1,
      progressTypeCd: "A1",
    };

    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [_step1, _step2, _step3];

    saveCoachingAnswer(result);
  };
  const viewAnswer = ["어제 계획했던대로 운동을 잘 하셨나요? ", "", ""];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          {progress === 1 && (
            <Step1 data={step1} onNext={onNext} onChange={setStep1} />
          )}
          {progress === 2 && (
            <Step2 data={step1} onNext={onNext} onPrev={onPrev} />
          )}
          {progress === 3 && (
            <Step3
              data={step3}
              onChange={setStep3}
              onSave={onSave}
              onPrev={onPrev}
            />
          )}
        </ConditionView>
      </Section>
    </>
  );
}
