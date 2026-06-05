import { usePageTranslation } from "@/hooks/usePageTranslation";
import ChallengeStart from "../../-components/elements/ChallengeStart";
import Textbox from "../../-components/elements/Textbox";
import type { Day16Averages, Day16Step1Data } from "./utils";

interface Day16Step1Props {
  step1: Day16Step1Data;
  averages: Day16Averages;
  onChange: (value: Day16Step1Data) => void;
}

export function Day16Step1({ step1, averages, onChange }: Day16Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day16");

  const answerOptions = [
    pt("step1.msg_011"),
    pt("step1.msg_012"),
    pt("step1.msg_013"),
    pt("step1.msg_014"),
  ];

  return (
    <div className="flex flex-col gap-5">
      <ChallengeStart>{pt("step1.msg_001")}</ChallengeStart>

      <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-black text-slate-800 tracking-tight">
            {pt("step1.msg_002")}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            📊 {pt("step1.summary_badge")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1 rounded-md border border-primary/10 bg-primary/5 p-4">
            <span className="text-xs font-semibold text-slate-400">
              {pt("step1.average_sleep_label")}
            </span>
            <span className="text-lg font-black text-slate-800">
              {pt("step1.average_sleep_value", { time: averages.time })}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-md border border-primary/10 bg-primary/5 p-4">
            <span className="text-xs font-semibold text-slate-400">
              {pt("step1.average_rating_label")}
            </span>
            <span className="text-lg font-black text-slate-800">
              {pt("step1.average_rating_value", { rating: averages.rating })}
            </span>
          </div>
        </div>
      </div>

      <Textbox className="text-center font-bold text-slate-700">
        {pt("step1.msg_003")}
      </Textbox>

      <div className="grid gap-3">
        {answerOptions.map((label) => {
          const selected = step1.answer === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => onChange({ ...step1, answer: label })}
              className={[
                "rounded-2xl border px-4 py-3 text-left text-base font-semibold leading-relaxed transition-all",
                selected
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-700",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
