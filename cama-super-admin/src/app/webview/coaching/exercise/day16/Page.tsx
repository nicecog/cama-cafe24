import Section from "@/app/webview/coaching/component/Layout/Section";
import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
import useSteps from "@/hooks/useSteps";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useState } from "react";

const questions = [
  "프로그램을 시작하기 전과 비교해, 피로감이 줄었나요? ",
  "일주일에 3일 이상 운동을 하게 되었나요?",
  "운동을 하면서 기분이 좋아지거나 스트레스가 줄었나요?",
  "운동을 통해 체중 관리가 쉬워졌다고 느꼈나요? ",
  "운동을 할 때 통증이나 불편함이 감소했나요?",
  "일상 활동을 수행하는 데 있어 더 쉽게 느껴졌나요?",
];

export default function Day16Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);

  const [step1, setStep1] = useState("");

  const [step2, setStep2] = useState([null, null, null, null, null, null]);

  const [step3, setStep3] = useState("");

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = {
      answerChoice: step1,
      progressTypeCd: "A1",
    };

    const _step2 = step2.map((r: any, index: number) => ({
      answerChoice: questions[index] + " : " + (r ? "예" : "아니오"),
      refVal1: r ? "Y" : "N",
      progressTypeCd: "A2",
    }));
    const _step3 = {
      answerChoice: step3,
      progressTypeCd: "A3",
    };

    const result = [_step1, ..._step2, _step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [
    `어제 계획했던대로 운동을 잘 하셨나요?`,
    "구체적인 변화 살펴보기",
    "변화지속을 위한 선언하기",
  ];
  return (
    <>
      <Section progressTypeCd={progress}>
        <ConditionView viewAnswer={viewAnswer} type="C" isMission={true}>
          {progress === 1 && (
            <Step1 data={step1} onNext={onNext} onChange={setStep1} />
          )}
          {progress === 2 && (
            <Step2
              data={step2}
              onNext={onNext}
              onChange={setStep2}
              onPrev={onPrev}
            />
          )}
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
