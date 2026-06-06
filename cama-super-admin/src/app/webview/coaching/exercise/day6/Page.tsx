import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";

// 6일차
export default function Day6Page() {
  // State
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState({
    type: "",
    time: "10",
  });

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = {
      answerChoice: step1.type,
      progressTypeCd: "A1",
    };
    const _step1_2 = {
      answerChoice: step1.time + " 분",
      progressTypeCd: "A1",
    };
    const _step2 = {
      answerChoice: "",
      progressTypeCd: "A2",
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [_step1, _step1_2, _step2, _step3];

    saveCoachingAnswer(result);
  };
  const viewAnswer = ["진행할 운동과 운동 시간  ", "", ""];
  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          {progress === 1 && (
            <Step1 data={step1} onChange={setStep1} onNext={onNext} />
          )}
          {progress === 2 && (
            <Step2 onNext={onNext} data={step1} onPrev={onPrev} />
          )}
          {progress === 3 && <Step3 onSave={onSave} onPrev={onPrev} />}
        </ConditionView>
      </Section>
    </>
  );
}
