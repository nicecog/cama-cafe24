import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";
export default function Day12Page() {
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
      answerChoice: step1.type + " : " + step1.time,
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
            <Step1 data={step1} onNext={onNext} onChange={setStep1} />
          )}
          {progress === 2 && (
            <Step2 data={step1} onNext={onNext} onPrev={onPrev} />
          )}
          {progress === 3 && <Step3 onSave={onSave} onPrev={onPrev} />}
        </ConditionView>
      </Section>
    </>
  );
}
