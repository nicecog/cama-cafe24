import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import SleepCheck from "../../-components/elements/SleepCheck";
import Textbox from "../../-components/elements/Textbox";
import type { Day8PreviousDaySummary, Day8Step1Data } from "./utils";

interface Day8Step1Props {
  step1: Day8Step1Data;
  accountName: string;
  previousDaySummary: Day8PreviousDaySummary;
  onChange: (value: Day8Step1Data) => void;
}

export function Day8Step1({
  step1,
  accountName,
  previousDaySummary,
  onChange,
}: Day8Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day8");

  const yesVal = pt("step1.yes");
  const noVal = pt("step1.no");

  return (
    <div className="flex flex-col gap-2">
      <ChallengeStart>{pt("step1.msg_001")}</ChallengeStart>

      <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-black text-slate-800 tracking-tight">
            {pt("step1.summary_title", { accountName })}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            ⏱️ {pt("step1.summary_badge")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1 rounded-md border border-primary/10 bg-primary/5 p-4">
            <span className="text-xs font-semibold text-slate-400">
              {pt("step1.target_sleep_label")}
            </span>
            <span className="text-lg font-black text-slate-800">
              {pt("step1.target_sleep_value", {
                targetTime: previousDaySummary.targetTime,
              })}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-md border border-primary/10 bg-primary/5 p-4">
            <span className="text-xs font-semibold text-slate-400">
              {pt("step1.target_bedtime_label")}
            </span>
            <span className="text-lg font-black text-slate-800">
              {pt("step1.target_bedtime_value", {
                sleepTime: previousDaySummary.sleepTime,
              })}
            </span>
          </div>
        </div>

        <Textbox className="text-center font-bold text-slate-700 mt-2">
          {pt("step1.msg_006")}
        </Textbox>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8 mt-2">
        {[
          { key: "예", label: yesVal },
          { key: "아니요", label: noVal },
        ].map(({ key, label }) => {
          const selected = step1.answer === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ ...step1, answer: key })}
              className={[
                "h-12 rounded-2xl border px-4 text-base font-bold transition-all",
                selected
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-600",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>

      <SleepCheck
        sleepTitle={pt("step1.msg_007")}
        sleepHint={pt("step1.msg_008")}
        ratingTitle={pt("step1.msg_004")}
        ratingHint={pt("step1.msg_005")}
        sleep={step1.sleep}
        rating={step1.rating}
        onChange={(next) => {
          onChange({
            ...step1,
            sleep: next.sleep ?? step1.sleep,
            rating: next.rating ?? step1.rating,
          });
        }}
      />
    </div>
  );
}
