import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "@/app/webview/coaching/lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function StartDayPage() {
  const [step1, setStep1] = useState({
    value: "",
    extra: "",
  });

  const [step3, setStep3] = useState({
    value1: "0",
    value2: "",
  });

  const { progress, onNext, onPrev } = useSteps(1, 3);

  const { saveCoachingAnswer } = useSaveAnswer("B");

  // 등록
  const onSave = () => {
    const result = [
      {
        progressTypeCd: "A1",
        answerChoice: step1.extra
          ? `${step1.value}/${step1.extra}`
          : step1.value,
        refVal1: step1.extra || "",
      },
      { answerChoice: "", progressTypeCd: "A2" },
      {
        answerChoice: `식습관 중요도 : ${step3.value1}`,
        refVal1: step3.value1,
        progressTypeCd: "A3",
      },
      {
        answerChoice: `식습관 중요도를 높이기 위해 오늘 할 수 있는것 : ${step3.value2}`,
        refVal1: step3.value2,
        progressTypeCd: "A3",
      },
    ];
    saveCoachingAnswer(result);
  };

  const viewAnswer = [
    "삶을 풍요롭게 살아가기 위해 당신에게 중요한 것은 무엇입니까?",
    "",
    "식습관의 중요도 및 식습관의 중요도를 높이기 위해 오늘 할 수 있는것",
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="B">
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onChange={setStep1} onNext={onNext} />
            )}
            {progress === 2 && (
              <StartDayStep2 step1={step1} onNext={onNext} onPrev={onPrev} />
            )}
            {progress === 3 && (
              <StartDayStep3
                step1={step1}
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
