import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import useSaveAnswer from "@/app/webview/coaching/lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
export default function Day5Page() {
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
      answerChoice: step3,
      progressTypeCd: "A3",
    };

    const result = [_step1, _step2, _step3];

    saveCoachingAnswer(result);
  };
  const viewAnswer = [
    " 신체 활동을 하기 어려운 이유는 다음 중 무엇인가요?",
    "",
    "내가 운동을 할때 방해가 되었던 요인",
  ];
  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          {progress === 1 && (
            <Step1 data={step1} onChange={setStep1} onNext={onNext} />
          )}
          {progress === 2 && (
            <Step2 onNext={onNext} onPrev={onPrev} data={step1} />
          )}
          {progress === 3 && (
            <Step3
              onSave={onSave}
              data={step3}
              onChange={setStep3}
              onPrev={onPrev}
            />
          )}
        </ConditionView>
      </Section>
    </>
  );
}
