import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useExerciseUserClassInfo } from "@/hooks/queries";
import { ExerciseIntroCard } from "./-components/ExerciseIntroCard";
import { ExerciseShell } from "./-components/ExerciseShell";
import { resetExerciseFlowAtom } from "./-state/exerciseAtoms";

export const Route = createFileRoute("/_auth/_coaching/coaching/exercise/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const accountMe = useAtomValue(accountMeAtom);
  const resetFlow = useSetAtom(resetExerciseFlowAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: classInfo, isLoading } = useExerciseUserClassInfo(loginId);

  useEffect(() => {
    if (classInfo) {
      navigate({
        to: "/coaching/exercise/content",
        replace: true,
      });
    }
  }, [classInfo, navigate]);

  if (isLoading) {
    return (
      <ExerciseShell
        title="운동코칭"
        description="운동 정보를 불러오는 중입니다."
      >
        <div className="rounded-[28px] bg-white p-8 text-center text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100">
          불러오는 중...
        </div>
      </ExerciseShell>
    );
  }

  return (
    <ExerciseShell
      title="운동코칭"
      description="운동평가를 통해 현재 신체 활동 수준에 맞는 운동 프로그램을 추천해 드려요."
    >
      <ExerciseIntroCard
        onStart={() => {
          resetFlow();
          navigate({ to: "/coaching/exercise/eval" });
        }}
      />
    </ExerciseShell>
  );
}
