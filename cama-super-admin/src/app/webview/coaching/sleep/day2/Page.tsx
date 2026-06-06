import useSteps from "@/hooks/useSteps";
import ConditionView from "../../component/Layout/ConditionView";
import Section from "../../component/Layout/Section";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";

export default function Day2Page() {
  const [step1, setStep1] = useState("");
  const [step3, setStep3] = useState("");

  const { saveCoachingAnswer } = useSaveAnswer("A");

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
      answerChoice: "수면 시간 목표 : " + step3 + "시간",
      refVal1: step3,
      progressTypeCd: "A3",
    };

    const result = [_step1, _step2, _step3];

    saveCoachingAnswer(result);
  };

  const { progress, onNext, onPrev } = useSteps(1, 3);

  const viewAnswer = [
    "최근 1주일간 하루 평균 몇 시간 정도를 주무셨나요?",
    "",
    `나는 평균 (　　)시간 정도 잠을 자겠다.`,
  ];

  return (
    <Section progressTypeCd={progress}>
      <ConditionView viewAnswer={viewAnswer} type="A" isMission={true}>
        <>
          {progress === 1 && (
            <Step1 data={step1} onChange={setStep1} onNext={onNext} />
          )}
          {progress === 2 && (
            <Step2 data={step1} onPrev={onPrev} onNext={onNext} />
          )}
          {progress === 3 && (
            <Step3
              data={step3}
              onChange={setStep3}
              onSave={onSave}
              onPrev={onPrev}
            />
          )}
        </>
      </ConditionView>
    </Section>
  );
}
