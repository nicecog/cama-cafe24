import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function Day3Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const { saveCoachingAnswer } = useSaveAnswer("B");
  const [step1, setStep1] = useState([]);
  const [step3, setStep3] = useState([]);
  // 등록
  const onSave = () => {
    const _step1 = step1.map((i: string) => ({
      answerChoice: i,
      progressTypeCd: "A1",
    }));
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
    };

    const _step3 = step3.map((i: string) => ({
      answerChoice: i,
      progressTypeCd: "A3",
    }));

    const result = [..._step1, _step2, ..._step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [
    `식사와 관련해서 경험하는 어려움은 무엇인가요? `,
    "",
    "선택한 어려움 중에서 개선해 보고 싶은 것이 있나요?",
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="B" isMission={true}>
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onNext={onNext} onChange={setStep1} />
            )}
            {progress === 2 && (
              <StartDayStep2
                step1Data={step1}
                onNext={onNext}
                onPrev={onPrev}
              />
            )}
            {progress === 3 && (
              <StartDayStep3
                step3={step3}
                step1={step1}
                onPrev={onPrev}
                onChange={setStep3}
                onSave={onSave}
              />
            )}
          </>
        </ConditionView>
      </Section>
    </>
  );
}
