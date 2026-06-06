import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "@/app/webview/coaching/lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function Day1Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState("");

  const { saveCoachingAnswer } = useSaveAnswer("B");

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

  const viewAnswer = [
    `15일 이내에 수술일정이 잡혀있다면 수술이후에 시작하는것이 좋습니다! 시작하시겠습니까? `,
    "",
    "",
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
              <StartDayStep2 onNext={onNext} onPrev={onPrev} />
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
