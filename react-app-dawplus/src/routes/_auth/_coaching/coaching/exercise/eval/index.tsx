import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExerciseCancerSelector } from "../-components/ExerciseCancerSelector";
import { ExerciseQuestionComplete } from "../-components/ExerciseQuestionComplete";
import { ExerciseQuestionStep } from "../-components/ExerciseQuestionStep";
import { ExerciseShell } from "../-components/ExerciseShell";
import { useExerciseEvaluationFlow } from "../-hooks/useExerciseEvaluationFlow";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/exercise/eval/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { pt } = usePageTranslation("coaching/exercise/eval");
  const {
    selectedCancer,
    questions,
    currentIndex,
    isComplete,
    selectCancer,
    answerCurrent,
  } = useExerciseEvaluationFlow();

  const currentQuestion =
    currentIndex >= 0 && currentIndex < questions.length
      ? questions[currentIndex]
      : null;

  return (
    <ExerciseShell
      title={pt("title")}
      description={
        selectedCancer ? pt("question_description") : pt("description")
      }
      footer={
        isComplete ? (
          <button
            type="button"
            onClick={() => navigate({ to: "/coaching/exercise/result" })}
            className="h-12 w-full rounded-md bg-primary text-sm font-bold text-white"
          >
            {pt("result")}
          </button>
        ) : null
      }
    >
      {!selectedCancer ? (
        <>
          <section className="rounded-md border border-primary/15 bg-white p-6 text-sm font-medium leading-6 text-slate-600 shadow-sm">
            {pt("intro")}
          </section>
          <ExerciseCancerSelector
            selectedCancer={selectedCancer}
            onSelect={selectCancer}
          />
        </>
      ) : isComplete ? (
        <ExerciseQuestionComplete />
      ) : currentQuestion ? (
        <ExerciseQuestionStep
          current={currentIndex + 1}
          total={questions.length}
          question={currentQuestion}
          onAnswer={answerCurrent}
        />
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-500 shadow-sm">
          {pt("ready")}
        </section>
      )}
    </ExerciseShell>
  );
}
