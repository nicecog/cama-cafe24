import { createFileRoute, Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { ArrowLeft, CalendarDays, MessageSquareText } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import images from "@/assets/images/character/advice2.png";
import { accountMeAtom } from "@/atoms/accountAtoms";

import {
  COACHING_DATA,
  type CoachingType,
} from "@/components/coaching/coachingData";
import { useUserAnswerInfoList } from "@/hooks/queries";

const COACHING_TYPE_ALIAS: Record<string, CoachingType> = {
  sleep: "sleep",
  meal: "meal",
  exercise: "exercise",
  physical: "exercise",
  mind: "mind",
  mental: "mind",
};

const COACHING_CATEGORY_CD: Record<CoachingType, string> = {
  sleep: "A",
  meal: "B",
  exercise: "C",
  mind: "D",
};

const isCoachingType = (value: string): value is CoachingType => {
  return value in COACHING_TYPE_ALIAS;
};

const getCoachingType = (value: string): CoachingType | null => {
  return COACHING_TYPE_ALIAS[value] ?? null;
};

const normalizeStepDayCd = (value: string) => {
  const trimmed = value.trim();
  const parsed = Number.parseInt(trimmed, 10);

  if (Number.isNaN(parsed)) {
    return trimmed;
  }

  return String(parsed);
};

export const Route = createFileRoute("/_auth/_coaching/coaching/$type/$day/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      type: params.type,
      day: params.day,
    };
  },
});

function RouteComponent() {
  const { type, day } = Route.useLoaderData();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const coachingType = getCoachingType(type);

  const categoryCd = coachingType ? COACHING_CATEGORY_CD[coachingType] : "";

  const { data: answerList = [], isLoading } = useUserAnswerInfoList({
    loginId,
    categoryCd,
  });

  const content = coachingType ? COACHING_DATA[coachingType] : null;
  const dayIndex = Number(day);
  const isValidDay =
    !!content &&
    Number.isInteger(dayIndex) &&
    dayIndex >= 0 &&
    dayIndex < content.missions.length;
  const selectedStepDayCd = normalizeStepDayCd(String(dayIndex));

  const targetAnswers = useMemo(() => {
    if (!isValidDay) {
      return [];
    }

    return answerList.filter(
      (item) => normalizeStepDayCd(item.stepDayCd) === selectedStepDayCd,
    );
  }, [answerList, isValidDay, selectedStepDayCd]);

  if (!isCoachingType(type)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <MessageSquareText size={32} />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold text-slate-900">
              잘못된 코칭 유형이에요.
            </p>
            <p className="text-sm text-slate-500">
              요청하신 페이지를 찾을 수 없습니다.
            </p>
          </div>
          <Link
            to="/coaching"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-white transition-all active:scale-95"
          >
            코칭 홈으로 돌아가기
          </Link>
        </motion.div>
      </div>
    );
  }

  const dayTitle = isValidDay ? content.missions[dayIndex] : "";

  if (!isValidDay) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur-md">
          <Link
            to="/coaching"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500"
          >
            <ArrowLeft size={16} />
            돌아가기
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <CalendarDays size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-slate-900">
                잘못된 일차예요.
              </p>
              <p className="text-sm text-slate-500">
                존재하는 코칭 일차를 선택해 주세요.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-suit">
      <main className="flex-1 px-5 pb-32 pt-8">
        <div className="mb-10">
          <div className="relative flex items-center gap-5 rounded-[32px] bg-white p-6 ring-1 ring-primary/40 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative shrink-0"
            >
              <img
                src={images}
                alt="character"
                className="w-20 h-auto drop-shadow-[0_8px_16px_rgba(0,102,204,0.12)]"
              />
            </motion.div>

            <div className="flex flex-col py-1 relative z-10">
              <div className="inline-flex w-fit mb-2 rounded-full bg-primary/10 px-3 py-0.5 text-[10px] font-black tracking-widest text-primary uppercase ring-1 ring-primary/20">
                내가 쓴 답변 돌아보기
              </div>
              <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900">
                {dayTitle}
              </h1>
              <p className="mt-2 text-[13px] font-bold leading-relaxed text-slate-500/80">
                당시 기록했던 답변들을
                <br />
                다시 한번 찬찬히 확인해보세요.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs font-bold text-slate-400">불러오는 중...</p>
          </div>
        ) : targetAnswers.length === 0 ? (
          <div className="rounded-2xl border border-primary/30 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
              <MessageSquareText size={28} />
            </div>
            <p className="text-base font-bold text-slate-900">
              저장된 답변이 없습니다.
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400">
              코칭을 완료하면 답변이 여기에 기록됩니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {targetAnswers.map((answer, index) => {
              const displayValue =
                answer.answerChoice?.trim() ||
                answer.refVal1?.trim() ||
                answer.refVal2?.trim() ||
                "답변 없음";

              const answerKey = [
                answer.categoryCd,
                answer.stepDayCd,
                answer.progressTypeCd,
                answer.answerChoiceSeq,
                index,
              ].join("-");

              return (
                <section
                  key={answerKey}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-md transition-all active:scale-[0.98] transform-gpu will-change-transform"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-primary ring-1 ring-inset ring-primary/20">
                      <MessageSquareText size={13} strokeWidth={2.5} />
                      <span className="text-[11px] font-black tracking-tight">
                        답변 {index + 1}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">
                      {answer.createdAt
                        ? new Date(answer.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <div className="relative rounded-xl bg-slate-50/80 px-4 py-4 ring-1 ring-inset ring-slate-100/50">
                    <p className="whitespace-pre-wrap text-[15px] font-bold leading-relaxed text-slate-700">
                      {displayValue}
                    </p>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Fixed Bottom Button Area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white/80 p-4 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <Link
          to="/coaching"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          <ArrowLeft size={18} />
          코칭 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
