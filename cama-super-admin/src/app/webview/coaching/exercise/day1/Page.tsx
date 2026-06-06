import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";

import useSteps from "@/hooks/useSteps";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";

import useAccountName from "@/hooks/useAccountName";
export default function Day1Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState({
    value: "",
    extra: "",
  });

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: step1,
    };
    const _step2 = {
      answerChoice: step2,
      progressTypeCd: "A2",
    };
    const _step3 = {
      answerChoice: step3.value + " - " + step3.extra,
      progressTypeCd: "A3",
    };

    const result = [_step1, _step2, _step3];

    saveCoachingAnswer(result);
  };

  const accountName = useAccountName();
  const viewAnswer = [
    `${accountName} 님 꾸준히 운동을 하고 있나요? `,
    ``,
    ` ${accountName} 님의 운동 습관이 개선된다면 어떤 점이 가장 좋을까요?`,
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onNext={onNext} onChange={setStep1} />
            )}
            {progress === 2 && (
              <StartDayStep2
                data={step2}
                step1={step1}
                onNext={onNext}
                onChange={setStep2}
                onPrev={onPrev}
              />
            )}
            {progress === 3 && (
              <StartDayStep3
                data={step3}
                onSave={onSave}
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
