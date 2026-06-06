import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function Day7Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const { saveCoachingAnswer } = useSaveAnswer("B");
  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState([]);
  // 등록
  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: step1,
    };
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
    };

    const _step3 = step3.map((i: string) => ({
      answerChoice: i,
      progressTypeCd: "A3",
    }));

    const result = [_step1, _step2, ..._step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [
    `외식 때 자신만의 주의사항이 있으신가요?`,
    "",
    "내가 새롭게 실천해야겠다고 생각한 것이 있으면 모두 선택해 보세요.",
  ];
  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="B" isMission={true}>
          <>
            {progress === 1 && (
              <Step1 data={step1} onNext={onNext} onChange={setStep1} />
            )}
            {progress === 2 && (
              <Step2 step1={step1} onNext={onNext} onPrev={onPrev} />
            )}
            {progress === 3 && (
              <Step3
                onSave={onSave}
                step3={step3}
                onChange={setStep3}
                onPrev={onPrev}
              />
            )}
          </>
        </ConditionView>
      </Section>
    </>
  );
}
