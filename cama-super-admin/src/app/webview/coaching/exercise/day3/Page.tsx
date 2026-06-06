import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import useSteps from "@/hooks/useSteps";
import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";

export default function Day2Page() {
  // State
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState([]);

  const { saveCoachingAnswer } = useSaveAnswer("C");

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
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [..._step1, _step2, _step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [`도전하고 싶은 운동 습관은 무엇인가요?`, ``, ""];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          <>
            {progress === 1 && (
              <StartDayStep1 data={step1} onNext={onNext} onChange={setStep1} />
            )}
            {progress === 2 && (
              <StartDayStep2 step1={step1} onNext={onNext} onPrev={onPrev} />
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
