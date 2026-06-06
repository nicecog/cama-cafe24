import { usePageTranslation } from "@/hooks/usePageTranslation";
import TodayMission from "../../-components/elements/TodayMission";

interface Day11Step3Props {
  step3: string[];
  setStep3: React.Dispatch<React.SetStateAction<string[]>>;
  options: string[];
}

export function Day11Step3(props: Day11Step3Props) {
  const { pt } = usePageTranslation("coaching/physical/day11");
  const { options } = props;

  return (
    <div className="flex flex-col gap-6 py-2">
      <TodayMission text={pt("MSG_019")} />

      <div className="flex flex-col gap-5 px-1 mt-2">
        <h3 className="text-xl font-black text-slate-900 text-center leading-relaxed break-keep">
          {pt("MSG_021")}
        </h3>

        <div className="flex flex-col gap-3 max-w-xs mx-auto w-full mt-2">
          {options.map((option, idx) => (
            <div
              key={option}
              className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-black">
                {idx + 1}
              </div>
              <span className="text-base font-bold text-slate-800 break-keep">
                {option.replace(/^[0-9]\.\s*/, "")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
