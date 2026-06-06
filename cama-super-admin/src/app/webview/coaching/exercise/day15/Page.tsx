import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
export default function Day15Page() {
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
    "몸을 움직이기 싫은 날에는 무엇을 해 볼 수 있을까요?",
    "",
    "내가 운동을 꾸준히 계속한다면 ()가 좋아질 것이다. ",
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          {progress === 1 && (
            <Step1 data={step1} onNext={onNext} onChange={setStep1} />
          )}
          {progress === 2 && <Step2 onNext={onNext} onPrev={onPrev} />}
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
