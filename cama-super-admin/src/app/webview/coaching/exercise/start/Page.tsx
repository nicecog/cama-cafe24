import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import useSteps from "@/hooks/useSteps";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function StartDayPage() {
  const { progress, onNext, onPrev } = useSteps(1, 3);

  const [step1, setStep1] = useState({
    value: "",
    extra: "",
  });
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState({
    value1: "0",
    value2: "",
  });

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: step1.extra ? step1.value + "/" + step1.extra : step1.value,
      refVal1: step1.extra ? step1.extra : "",
    };

    const _step2 = {
      answerChoice: step2,
      progressTypeCd: "A2",
    };
    const _step3 = {
      answerChoice: "운동 습관 중요도 : " + step3.value1,
      progressTypeCd: "A3",
      refVal1: step3.value1,
    };
    const _step3_2 = {
      answerChoice: "운동 습관을 위해 할수 있는것 : " + step3.value2,
      progressTypeCd: "A3",
      refVal1: step3.value2,
    };

    const result = [_step1, _step2, _step3, _step3_2];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [
    "당신의 삶에서 가장 중요한 것은 무엇입니까? ",
    "",
    "운동의중요도 및 운동의중요도를 높이기 위해 오늘 할 수 있는것",
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C">
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onChange={setStep1} onNext={onNext} />
            )}
            {progress === 2 && (
              <StartDayStep2
                data={step2}
                step1={step1}
                onNext={onNext}
                onPrev={onPrev}
                onChange={setStep2}
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
