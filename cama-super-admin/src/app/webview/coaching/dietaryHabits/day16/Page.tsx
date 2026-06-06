import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";

const answerList = [
  "습관 개선을 위해 최선을 다 했고, 실제로 식사습관이 좋아졌다.",
  "습관 개선을 위해 노력했지만, 생각만큼 습관이 바뀌지 않았다.",
  "충분히 노력하지 못 한 것 같다.",
  "잘 모르겠다.",
];

export default function Day7Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const { saveCoachingAnswer } = useSaveAnswer("B");
  const [step1, setStep1] = useState(null);
  // 등록
  const onSave = () => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: step1 ? answerList[step1] : "",
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
    `지난 15일간 건강한 식사 습관 만들기 위해 노력한 결과가 어떤가요? 스스로의 실천에 대해서 평가해 보세요.`,
    "",
    "",
  ];

  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="B" isMission={true}>
          <>
            {progress === 1 && (
              <StartDayStep1
                answerList={answerList}
                data={step1}
                onNext={onNext}
                onChange={setStep1}
              />
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
