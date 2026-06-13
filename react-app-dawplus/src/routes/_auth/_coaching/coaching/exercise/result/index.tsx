import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { saveCoachingAnswerList } from "@/apis/api/webview/coaching";
import { accountMeAtom } from "@/atoms/accountAtoms";
import {
  useSaveExerciseSurveyResult,
  useSaveExerciseUserClass,
} from "@/hooks/mutations";
import { useExerciseContentList } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { queryKeys } from "@/lib/queryClient";
import { ExerciseResultSummary } from "../-components/ExerciseResultSummary";
import { ExerciseShell } from "../-components/ExerciseShell";
import {
  type CancerTypeName,
  getCancerTypeCode,
} from "../-constants/exerciseCodeMap";
import { getQuestionSet } from "../-constants/exerciseQuestions";
import {
  buildExerciseSeedPayload,
  buildExerciseSurveyResult,
  buildExerciseUserClassPayload,
} from "../-lib/buildExercisePayloads";
import { buildExerciseRecommendationRefs } from "../-lib/buildExerciseRecommendations";
import { evaluateExerciseProgram } from "../-lib/evaluateExerciseProgram";
import { canEnterExerciseResult } from "../-lib/routeGuards";
import {
  exerciseAnswersAtom,
  exerciseRecommendationAtom,
  selectedCancerAtom,
} from "../-state/exerciseAtoms";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/exercise/result/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { alert } = useDialog();
  const { pt } = usePageTranslation("coaching/exercise/result");
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = accountMe.data?.name || accountMe.data?.nickName || "";
  const selectedCancer = useAtomValue(selectedCancerAtom);
  const answers = useAtomValue(exerciseAnswersAtom);
  const [, setRecommendation] = useAtom(exerciseRecommendationAtom);
  const { data: contentList = [] } = useExerciseContentList(loginId);
  const { mutateAsync: saveExerciseUserClass } = useSaveExerciseUserClass();
  const { mutateAsync: saveExerciseSurveyResult } =
    useSaveExerciseSurveyResult();

  useEffect(() => {
    if (!canEnterExerciseResult({ cancer: selectedCancer, answers })) {
      navigate({ to: "/coaching/exercise/eval", replace: true });
    }
  }, [answers, navigate, selectedCancer]);

  if (!selectedCancer || !answers.length) {
    return null;
  }

  const summary = evaluateExerciseProgram(
    selectedCancer as CancerTypeName,
    answers,
  );
  const questions = getQuestionSet(selectedCancer as CancerTypeName);

  const handleComplete = async () => {
    const surveyResult = buildExerciseSurveyResult({
      questions,
      answers,
    });
    const userClassPayload = buildExerciseUserClassPayload({
      loginId,
      cancerTypeCd: getCancerTypeCode(selectedCancer as CancerTypeName),
      exerciseProgramCd: summary.program,
      aerobic: summary.aerobic,
      therapyCd: summary.therapy,
      surveyResult,
    });
    const refs = buildExerciseRecommendationRefs({
      contentList,
      cancerTypeCd: getCancerTypeCode(selectedCancer as CancerTypeName),
      exerciseProgramCd: summary.program,
      aerobic: summary.aerobic,
      therapyCd: summary.therapy,
    });

    try {
      await saveExerciseUserClass(userClassPayload);
      await saveExerciseSurveyResult(userClassPayload);
      await saveCoachingAnswerList(
        buildExerciseSeedPayload({
          accountName,
          loginId,
          refs,
        }),
      );
      setRecommendation(summary);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.exerciseClassInfo(loginId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.exerciseContentList(loginId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.webview.coaching.answerList(loginId, "E"),
        }),
      ]);

      await alert(pt("success"));
      navigate({ to: "/coaching/exercise/content", replace: true });
    } catch {
      await alert(pt("error"));
    }
  };

  return (
    <ExerciseShell
      title={pt("title")}
      description={pt("description")}
      footer={
        <button
          type="button"
          onClick={handleComplete}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-white"
        >
          {pt("complete")}
        </button>
      }
    >
      <ExerciseResultSummary
        program={summary.program}
        aerobic={summary.aerobic}
        therapy={summary.therapy}
      />
    </ExerciseShell>
  );
}
