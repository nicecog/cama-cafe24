import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";

export default function Day13Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState("");

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
  const viewAnswer = [
    "지난 번에 알려드린 운동 시 주의사항을 기억하시나요? ",
    "",
    "",
  ];

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
          {progress === 3 && <Step3 onSave={onSave} onPrev={onPrev} />}
        </ConditionView>
      </Section>
    </>
  );
}
