import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import type { SaveCoachingAnswerInput } from "@/hooks/mutations";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { useSaveCoachingAndNavigate } from "@/hooks/useSaveCoachingAndNavigate";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { Day3Step1 } from "./step1";
import { Day3Step2 } from "./step2";
import { Day3Step3 } from "./step3";
import {
  calculateSleepDurationAndOutput,
  type Day3Step1Data,
  type Day3Step2Data,
  formatTimeString,
} from "./utils";

export const Route = createFileRoute("/_auth/_coaching/coaching/sleep/day3/")({
  component: RouteComponent,
});

const stepDayCd = "03";

function RouteComponent() {
  const { toast } = useToast();
  const { pt } = usePageTranslation("coaching/sleep/day3");
  const { saveAndNavigate } = useSaveCoachingAndNavigate({
    redirectTo: "/coaching/sleep",
    successMessage: "오늘 미션이 저장되었어요.\n메인 화면으로 돌아갈게요.",
    errorMessage: "저장 중 오류가 발생했습니다.",
  });
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName =
    accountMe.data?.name || accountMe.data?.nickName || "회원";

  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "A",
  });

  const [step1, setStep1] = useState<Day3Step1Data>({
    sleep: {
      hour: "",
      minutes: "",
    },
    wakeup: {
      hour: "",
      minutes: "",
    },
  });

  const getSelectedTime = () => {
    const result = answerList.find(
      (item) => item.stepDayCd === "02" && item.progressTypeCd === "A3",
    );
    const numbers = result?.answerChoice?.match(/\d+/g)?.map(Number) ?? [];

    return numbers.length > 0 ? Math.max(...numbers) : 0;
  };

  const onBeforeNext = (currentStep: number) => {
    if (currentStep === 1) {
      const hasMissingTime = ["sleep", "wakeup"].some((key) => {
        const time = step1[key as keyof Day3Step1Data];

        return time.hour === "" || time.minutes === "";
      });

      if (hasMissingTime) {
        toast({
          description: pt("step1.msg_007"),
        });
        return false;
      }
    }

    return true;
  };

  const buildPayload = (
    resolvedStep2: Day3Step2Data,
  ): SaveCoachingAnswerInput[] => {
    const _step1 = {
      progressTypeCd: "A1",
      answerChoice: `취침시간 : ${step1.sleep.hour}/${step1.sleep.minutes}`,
      refVal1: step1.sleep.hour + step1.sleep.minutes,
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step1_2 = {
      progressTypeCd: "A1",
      answerChoice: `기상시간 : ${step1.wakeup.hour}/${step1.wakeup.minutes}`,
      refVal1: step1.wakeup.hour + step1.wakeup.minutes,
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step2 = {
      answerChoice: `총수면 시간 : ${resolvedStep2.totalTime}`,
      progressTypeCd: "A2",
      refVal1: formatTimeString(resolvedStep2.totalTime),
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step2_2 = {
      answerChoice: `이전선택과 차이 : ${resolvedStep2.diffTime}`,
      progressTypeCd: "A2",
      refVal1: formatTimeString(resolvedStep2.diffTime),
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };
    const _step3 = {
      answerChoice: "",
      progressTypeCd: "A3",
      categoryCd: "A",
      stepDayCd,
      answerChoiceSeq: 0,
    };

    return [_step1, _step1_2, _step2, _step2_2, _step3];
  };

  const saveAnswer = async () => {
    const selectedTime = getSelectedTime();
    const { sleepDuration, differenceInHours, remainingMinutes } =
      calculateSleepDurationAndOutput(step1, selectedTime);
    const resolvedStep2 = {
      totalTime:
        String(sleepDuration.hours).padStart(2, "0") +
        ":" +
        String(sleepDuration.minutes).padStart(2, "0"),
      diffTime:
        String(differenceInHours).padStart(2, "0") +
        ":" +
        String(remainingMinutes).padStart(2, "0"),
    };

    await saveAndNavigate(buildPayload(resolvedStep2));
  };

  return (
    <DayStepFlow
      title={pt("msg_001")}
      onBeforeNext={onBeforeNext}
      onSave={saveAnswer}
    >
      <Day3Step1 data={step1} onChange={setStep1} />
      <Day3Step2 data={step1} />
      <Day3Step3
        accountName={accountName}
        sleepHour={step1.sleep.hour}
        sleepMinutes={step1.sleep.minutes}
        wakeupHour={step1.wakeup.hour}
        wakeupMinutes={step1.wakeup.minutes}
      />
    </DayStepFlow>
  );
}
