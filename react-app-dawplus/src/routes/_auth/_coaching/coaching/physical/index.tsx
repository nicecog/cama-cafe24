import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import confirmImage from "@/assets/images/character/head/type2.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { CoachingDayGrid } from "@/components/coaching/CoachingDayGrid";
import { CoachingHeader } from "@/components/coaching/CoachingHeader";
import { CoachingJourney } from "@/components/coaching/CoachingJourney";
import { useCoachingCurrentDay } from "@/hooks/queries";
import { useDialog } from "@/hooks/useDialog";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { cn } from "@/lib/utils";
import { MissionOutcomeScreen } from "../-components/elements/MissionOutcomeScreen";

export const Route = createFileRoute("/_auth/_coaching/coaching/physical/")({
  component: RouteComponent,
});

const dayStart = 0;
const physicalDayLocales = import.meta.glob(
  "../../../../../locales/ko/coaching/physical/day*.json",
  {
    eager: true,
  },
) as Record<string, { default?: { previousMission?: string } }>;

const physicalPreviousMissionMap = Object.fromEntries(
  Object.entries(physicalDayLocales).map(([path, module]) => {
    const match = path.match(/day(\d+)\.json$/);
    return [
      match ? Number(match[1]) : -1,
      (module.default?.previousMission ?? "").trim(),
    ];
  }),
) as Record<number, string>;

function RouteComponent() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const navigate = useNavigate();
  const { confirm } = useDialog();
  const { pt } = usePageTranslation("coaching/physical/index");
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { currentDay } = useCoachingCurrentDay(loginId, "C", 17);
  const safeActiveIndex = Math.min(Math.max(currentDay - dayStart, 0), 16);

  const [activeIndex, setActiveIndex] = useState(safeActiveIndex);
  const [missionOutcome, setMissionOutcome] = useState<boolean | null>(null);
  const isPastDay = activeIndex < currentDay;
  const isCompleted = currentDay >= 17;
  const missionDialogStartDay = 1;
  const shouldShowMissionDialog = activeIndex >= missionDialogStartDay;
  const ctaLabel = isPastDay ? pt("MSG_002") : pt("MSG_001");
  const answerReviewTo = `/coaching/physical/${activeIndex}`;
  const coachingDayTo = `/coaching/physical/day${activeIndex}`;
  const previousMissionLabel = physicalPreviousMissionMap[activeIndex] ?? "";

  const handleCtaClick = async () => {
    if (isPastDay) {
      await navigate({
        to: answerReviewTo,
      });
      return;
    }

    if (!shouldShowMissionDialog) {
      await navigate({
        to: coachingDayTo,
      });
      return;
    }

    await confirm(
      {
        icon: (
          <div className="flex flex-col items-center gap-2.5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-white to-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
              <img
                src={confirmImage}
                alt="head"
                className="h-14 w-14 object-contain"
              />
            </div>
          </div>
        ),
        iconFrame: false,
        body: (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="space-y-2">
              <h3 className="text-xl-fixed font-bold tracking-tight text-slate-900">
                <span className="text-primary">{pt("MSG_003")}</span>{" "}
                {pt("MSG_004")}
              </h3>
              <div className="mx-auto h-1 w-8 rounded-full bg-slate-100" />
            </div>

            <div className="w-full rounded-2xl bg-primary/5 px-4 py-3.5 ring-1 ring-inset ring-primary/10">
              <p className="text-xs-fixed font-bold tracking-[0.08em] text-primary">
                어제의 미션
              </p>
              <p className="mt-1 text-sm-fixed font-semibold leading-relaxed text-slate-700">
                {previousMissionLabel}
              </p>
            </div>
          </div>
        ),
        actionButton: pt("MSG_006"),
        cancelButton: pt("MSG_007"),
      },
      () => {
        setMissionOutcome(true);
      },
      () => {
        setMissionOutcome(false);
      },
    );
  };

  const handleMissionOutcomeAction = () => {
    setMissionOutcome(null);
    navigate({
      to: coachingDayTo,
    });
  };

  useEffect(() => {
    setActiveIndex(safeActiveIndex);
  }, [safeActiveIndex]);

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden bg-slate-50 font-suit">
      <CoachingHeader type="exercise" currentDay={currentDay} />

      <div className="flex items-center justify-end px-5 py-2 bg-white">
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all",
              viewMode === "list"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <List size={14} />
            {pt("MSG_008")}
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all",
              viewMode === "grid"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <LayoutGrid size={14} />
            {pt("MSG_009")}
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <CoachingJourney
          type="exercise"
          currentDay={currentDay}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
      ) : (
        <CoachingDayGrid
          type="exercise"
          currentDay={currentDay}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
      )}

      <div className="mt-auto shrink-0 border-t border-slate-100 bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 z-20">
        {isCompleted ? (
          <div className="mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
            <p className="text-sm font-bold text-emerald-700">
              신체활동 코칭을 모두 완료했어요. 이전 답변도 다시 확인할 수
              있어요.
            </p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleCtaClick}
          aria-label={ctaLabel}
          className={cn(
            "h-12 w-full rounded-lg bg-primary text-sm-fixed font-bold text-white",
            "flex items-center justify-center gap-2",
            "shadow-sm shadow-primary/20",
            "active:scale-95 transition duration-200 ease-out",
          )}
        >
          {ctaLabel}
        </button>
      </div>

      {missionOutcome !== null ? (
        <MissionOutcomeScreen
          open
          complete={missionOutcome}
          onAction={handleMissionOutcomeAction}
        />
      ) : null}
    </div>
  );
}
