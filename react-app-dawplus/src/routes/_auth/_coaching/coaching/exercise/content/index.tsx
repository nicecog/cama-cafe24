import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useLayoutEffect, useMemo } from "react";
import type {
  WebviewExerciseContentItem,
  WebviewUserAnswerInfo,
} from "@/apis/types";
import { accountMeAtom } from "@/atoms/accountAtoms";
import {
  useExerciseContentList,
  useExerciseUserClassInfo,
  useUserAnswerInfoList,
} from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { ExerciseShell } from "../-components/ExerciseShell";
import { ExerciseWorkoutList } from "../-components/ExerciseWorkoutList";
import {
  resetExerciseFlowAtom,
  selectedWorkoutAtom,
} from "../-state/exerciseAtoms";

export const Route = createFileRoute(
  "/_auth/_coaching/coaching/exercise/content/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { alert, confirm } = useDialog();
  const { pt } = usePageTranslation("coaching/exercise/content");
  const accountMe = useAtomValue(accountMeAtom);
  const resetExerciseFlow = useSetAtom(resetExerciseFlowAtom);
  const setSelectedWorkout = useSetAtom(selectedWorkoutAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const classInfoQuery = useExerciseUserClassInfo(loginId);
  const contentListQuery = useExerciseContentList(loginId);
  const answerListQuery = useUserAnswerInfoList({
    loginId,
    categoryCd: "E",
  });
  const classInfo = classInfoQuery.data;
  const contentList = contentListQuery.data ?? [];
  const answerList = answerListQuery.data ?? [];
  const isLoading =
    classInfoQuery.isLoading ||
    contentListQuery.isLoading ||
    answerListQuery.isLoading;

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
    if (classInfoQuery.isFetched && classInfo === null) {
      navigate({ to: "/coaching/exercise/eval", replace: true });
    }
  }, [classInfo, classInfoQuery.isFetched, navigate]);

  useEffect(() => {
    if (
      classInfoQuery.isFetched &&
      answerListQuery.isFetched &&
      classInfo &&
      answerList.length === 0
    ) {
      void alert(pt("missing_answers"), () => {
        navigate({ to: "/coaching/exercise/eval", replace: true });
      });
    }
  }, [
    alert,
    answerList.length,
    answerListQuery.isFetched,
    classInfo,
    classInfoQuery.isFetched,
    navigate,
    pt,
  ]);

  const workouts = useMemo(() => {
    return contentList
      .filter((item: WebviewExerciseContentItem) =>
        answerList.some(
          (answer: WebviewUserAnswerInfo) =>
            answer.refVal1 ===
            `${item.indexNum}${item.exerciseTypeCd}${item.difficultyCd}`,
        ),
      )
      .sort(
        (left: WebviewExerciseContentItem, right: WebviewExerciseContentItem) =>
          left.exerciseTypeCd.localeCompare(right.exerciseTypeCd) ||
          left.indexNum - right.indexNum,
      );
  }, [answerList, contentList]);

  // 리다이렉트가 예정되어 있는 상태인지 확인 (데이터는 있지만 평가를 안했거나 답변이 없는 경우)
  const isRedirecting =
    (classInfoQuery.isFetched && classInfo === null) ||
    (classInfoQuery.isFetched &&
      answerListQuery.isFetched &&
      classInfo &&
      answerList.length === 0);

  if (isLoading || isRedirecting) {
    return (
      <ExerciseShell title={pt("title")} description={pt("description")}>
        <section className="flex min-h-[200px] items-center justify-center rounded-md border border-primary/15 bg-white p-6 text-center text-sm font-medium text-slate-500 shadow-sm">
          {isLoading ? "불러오는 중..." : "확인 중..."}
        </section>
      </ExerciseShell>
    );
  }

  return (
    <ExerciseShell
      title={pt("title")}
      description={pt("description")}
      footer={
        <button
          type="button"
          onClick={() =>
            confirm(
              {
                title: "운동평가를 다시 진행하시겠습니까?",
                body: "기존 운동 진행 정보가 초기화될 수 있습니다.",
              },
              () => {
                resetExerciseFlow();
                navigate({ to: "/coaching/exercise/eval" });
              },
            )
          }
          className="h-12 w-full rounded-md border border-slate-200 bg-white text-sm font-bold text-slate-700"
        >
          운동평가 다시하기
        </button>
      }
    >
      <ExerciseWorkoutList
        workouts={workouts}
        answerList={answerList}
        onSelect={(workout) => {
          setSelectedWorkout(workout);
          navigate({ to: "/coaching/exercise/video" });
        }}
      />
    </ExerciseShell>
  );
}
