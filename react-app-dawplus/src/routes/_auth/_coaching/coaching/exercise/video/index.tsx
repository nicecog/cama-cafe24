import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useLayoutEffect, useState } from "react";
import { saveCoachingAnswerList } from "@/apis/api/webview/coaching";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { queryKeys } from "@/lib/queryClient";
import { ExerciseCompleteModal } from "../-components/ExerciseCompleteModal";
import { ExerciseShell } from "../-components/ExerciseShell";
import { ExerciseVideoPanel } from "../-components/ExerciseVideoPanel";
import { getExerciseExecutionMeta } from "../-constants/exerciseExecutionMeta";
import { buildExerciseCompletionPayload } from "../-lib/buildExercisePayloads";
import { canEnterExerciseVideo } from "../-lib/routeGuards";
import { selectedWorkoutAtom } from "../-state/exerciseAtoms";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/exercise/video/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { alert, confirm } = useDialog();
  const { pt } = usePageTranslation("coaching/exercise/video");
  const accountMe = useAtomValue(accountMeAtom);
  const setSelectedWorkout = useSetAtom(selectedWorkoutAtom);
  const selectedWorkout = useAtomValue(selectedWorkoutAtom);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const loginId = accountMe.data?.loginId ?? "";
  const accountName = accountMe.data?.name || accountMe.data?.nickName || "";
  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "E",
  });

  useLayoutEffect(() => {
    const scrollContainerId = import.meta.env.VITE_MAIN_SCROLL_CONTAINER_ID;

    const scrollToTop = () => {
      const mainContainer = scrollContainerId
        ? document.getElementById(scrollContainerId)
        : null;

      if (mainContainer) {
        mainContainer.scrollTop = 0;
        mainContainer.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const frameId = window.requestAnimationFrame(scrollToTop);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!canEnterExerciseVideo(selectedWorkout)) {
      navigate({ to: "/coaching/exercise/content", replace: true });
    }
  }, [navigate, selectedWorkout]);

  if (!selectedWorkout) return null;

  const selectedRef = `${selectedWorkout.indexNum}${selectedWorkout.exerciseTypeCd}${selectedWorkout.difficultyCd}`;
  const executionMeta = getExerciseExecutionMeta({
    difficultyCd: selectedWorkout.difficultyCd as "A1" | "A2" | "A3",
    exerciseTypeCd: selectedWorkout.exerciseTypeCd,
    korName: selectedWorkout.korName,
  });

  const completeWorkout = async () => {
    try {
      await saveCoachingAnswerList(
        buildExerciseCompletionPayload({
          accountName,
          answerList,
          loginId,
          selectedRef,
        }),
      );

      await queryClient.invalidateQueries({
        queryKey: queryKeys.webview.coaching.answerList(loginId, "E"),
      });
      setIsCompleteOpen(true);
    } catch {
      await alert(pt("error"));
    }
  };

  const handleComplete = async () => {
    const isSpecialExercise = ["E7", "E8", "E9"].includes(
      selectedWorkout.exerciseTypeCd,
    );

    await confirm(
      {
        body: isSpecialExercise ? (
          pt("confirm")
        ) : (
          <span className="whitespace-pre-line">
            {pt("confirm_prefix")}
            {"\n"}
            <span className="font-bold text-primary">
              [{executionMeta?.exe ?? ""}]
            </span>
            {"\n"}
            {pt("confirm_suffix")}
          </span>
        ),
        actionButton: pt("confirm_yes"),
        cancelButton: pt("confirm_no"),
      },
      () => {
        void completeWorkout();
      },
    );
  };

  const handleCloseComplete = () => {
    setIsCompleteOpen(false);
    setSelectedWorkout(null);
    navigate({ to: "/coaching/exercise/content", replace: true });
  };

  return (
    <>
      <ExerciseShell title={pt("title")} description={pt("description")}>
        <ExerciseVideoPanel
          difficultyCd={selectedWorkout.difficultyCd}
          exerciseTypeCd={selectedWorkout.exerciseTypeCd}
          korName={selectedWorkout.korName}
          url={selectedWorkout.url}
        />

        <div className="flex gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate({ to: "/coaching/exercise/content" })}
            className="h-12 flex-1 rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-700"
          >
            {pt("back")}
          </button>
          <button
            type="button"
            onClick={handleComplete}
            className="h-12 flex-1 rounded-md bg-primary text-sm font-bold text-white"
          >
            {pt("complete")}
          </button>
        </div>
      </ExerciseShell>

      <ExerciseCompleteModal
        isOpen={isCompleteOpen}
        onClose={handleCloseComplete}
      />
    </>
  );
}
