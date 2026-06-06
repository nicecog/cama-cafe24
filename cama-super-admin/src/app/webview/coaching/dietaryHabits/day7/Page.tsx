import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function Day7Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const { saveCoachingAnswer } = useSaveAnswer("B");
  const [step1, setStep1] = useState("");
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
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [_step1, _step2, _step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [`당분을 과도하게 섭취하고 있지 않으신가요?`, "", ""];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="B" isMission={true}>
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onNext={onNext} onChange={setStep1} />
            )}
            {progress === 2 && (
              <StartDayStep2 onNext={onNext} onPrev={onPrev} step1={step1} />
            )}
            {progress === 3 && (
              <StartDayStep3 onSave={onSave} onPrev={onPrev} />
            )}
          </>
        </ConditionView>
      </Section>
    </>
  );
}
