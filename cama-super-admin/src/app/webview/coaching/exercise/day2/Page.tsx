import { useState } from "react";
import StartDayStep1 from "./Step1";
import StartDayStep2 from "./Step2";
import StartDayStep3 from "./Step3";
import useSaveAnswer from "../../lib/useSaveAnswer";
import Section from "@/app/webview/coaching/component/Layout/Section";
import useSteps from "@/hooks/useSteps";

import ConditionView from "@/app/webview/coaching/component/Layout/ConditionView";
export default function Day2Page() {
  const { progress, onNext, onPrev } = useSteps(1, 3);
  const [step1, setStep1] = useState([
    { label: "일주일에 3일 이상 운동을 한다.", value: null },
    { label: "하루에 30분 이상 운동을 한다.", value: null },
    {
      label:
        "심박수를 높이는 유산소 운동 (예: 걷기, 달리기, 자전거 타기)을 한다.",
      value: null,
    },
    { label: "운동을 할 때 중량 훈련 (웨이트 트레이닝)을 한다.", value: null },
    { label: "운동 전후로 스트레칭이나 근육 이완을 실시한다.", value: null },
    { label: "매일 운동 목표를 설정하고 그 목표를 지킨다.", value: null },
    {
      label:
        "특별한 이유(예: 부상, 건강 문제) 없이  2주 이상 운동을 중단한 적이 없다.",
      value: null,
    },
  ]);

  const { saveCoachingAnswer } = useSaveAnswer("C");

  // 등록
  const onSave = () => {
    const _step1 = step1.map((item: any) => {
      return {
        progressTypeCd: "A1",
        answerChoice: item.label + " : " + (item.value ? "[예]" : "[아니요]"),
        refVal1: item.value ? "Y" : "N",
        answerAddChoiceYn: "N",
      };
    });

    const _step2 = {
      answerChoice: step1.filter((i) => i.value).length + "점",
      progressTypeCd: "A2",
      refVal1: step1.filter((i) => i.value).length,
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
    };

    const result = [..._step1, _step2, _step3];

    saveCoachingAnswer(result);
  };

  const viewAnswer = [`오늘은 현재의 운동 습관을 확인해볼게요`, ``, ""];

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
