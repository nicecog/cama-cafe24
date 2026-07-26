import { useMemo, useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useAccountName } from "@/hooks/useAccountInfo";
import { DayStepFlow } from "../../-components/layout/DayStepFlow";
import { MentalCoachIntroStep } from "./-MentalCoachIntroStep";
import { MentalChecklistStep } from "./-MentalChecklistStep";
import { MentalProgramGuideStep } from "./-MentalProgramGuideStep";
import { MentalIntroStep } from "./-MentalIntroStep";
import { MentalResultStep } from "./-MentalResultStep";
import { MentalTypeAdviceStep } from "./-MentalTypeAdviceStep";
import { MentalTypeInterpretStep } from "./-MentalTypeInterpretStep";
import { MentalTypeSummaryStep } from "./-MentalTypeSummaryStep";
import {
  defaultMentalTrainingPlan,
  mentalQuestions,
} from "./-constants";
import { isDuplicateMentalTrainingPlan } from "./-save";
import type { MentalAnswerValue, MentalTrainingPlan } from "./-types";
import { useMentalSection1SaveMutation } from "./-useMentalSection1SaveMutation";
import {
  evaluateMentalType,
  hasCompletedMentalChecklist,
} from "./-utils";

export function MentalSection1Page() {
  const { alert, confirm } = useDialog();
  const accountName = useAccountName();
  const saveMutation = useMentalSection1SaveMutation();
  const [answers, setAnswers] = useState<MentalAnswerValue[]>(
    mentalQuestions.map(() => null),
  );
  const [showValidation, setShowValidation] = useState(false);
  const [trainingPlans, setTrainingPlans] = useState<
    [MentalTrainingPlan, MentalTrainingPlan]
  >([
    defaultMentalTrainingPlan,
    { ...defaultMentalTrainingPlan, wday: "화요일" },
  ]);

  const canEvaluate = hasCompletedMentalChecklist(answers);
  const result = useMemo(() => {
    const normalizedAnswers = answers.map((value) => value ?? 0);
    return evaluateMentalType(normalizedAnswers);
  }, [answers]);

  const handleAnswerChange = (index: number, value: number) => {
    setAnswers((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );

    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleBeforeNext = async (step: number) => {
    if (step !== 2 || canEvaluate) {
      return true;
    }

    setShowValidation(true);
    await alert("답변을 모두 선택해주세요.");
    return false;
  };

  const handleTrainingPlanChange = (
    index: 0 | 1,
    key: keyof MentalTrainingPlan,
    value: string,
  ) => {
    setTrainingPlans((prev) =>
      prev.map((plan, planIndex) =>
        planIndex === index ? { ...plan, [key]: value } : plan,
      ) as [MentalTrainingPlan, MentalTrainingPlan],
    );
  };

  const handleSave = async () => {
    if (isDuplicateMentalTrainingPlan(trainingPlans[0], trainingPlans[1])) {
      await alert("동일한 일정은 선택하실수 없어요");
      return;
    }

    await confirm(
      {
        title: "안내",
        body: `선택하신 마음근육 훈련 일정은 ${trainingPlans[0].wday} ${trainingPlans[0].time}시, ${trainingPlans[1].wday} ${trainingPlans[1].time}시입니다.`,
      },
      async () => {
        await saveMutation.mutateAsync({
          answers: answers.map((value) => value ?? 0),
          result,
          trainingPlans,
        });
      },
    );
  };

  return (
    <DayStepFlow
      title="심리코칭"
      totalSteps={8}
      stepIndicatorVariant="fraction"
      onSave={handleSave}
      onBeforeNext={handleBeforeNext}
      nextButtonContent={{
        1: "진단 시작하기 →",
        2: "결과 보기 →",
      }}
    >
      <MentalIntroStep />
      <MentalChecklistStep
        answers={answers}
        onAnswerChange={handleAnswerChange}
        showValidation={showValidation}
      />
      <MentalResultStep result={result} />
      <MentalTypeSummaryStep result={result} />
      <MentalTypeInterpretStep result={result} accountName={accountName} />
      <MentalCoachIntroStep accountName={accountName} />
      <MentalTypeAdviceStep result={result} accountName={accountName} />
      <MentalProgramGuideStep
        result={result}
        trainingPlans={trainingPlans}
        onTrainingPlanChange={handleTrainingPlanChange}
      />
    </DayStepFlow>
  );
}
