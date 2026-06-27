import { Moon, Sun } from "lucide-react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day3Step3Props {
  accountName: string;
  sleepHour: string;
  sleepMinutes: string;
  wakeupHour: string;
  wakeupMinutes: string;
}

export function Day3Step3({
  accountName,
  sleepHour,
  sleepMinutes,
  wakeupHour,
  wakeupMinutes,
}: Day3Step3Props) {
  const { pt } = usePageTranslation("coaching/sleep/day3");

  return (
    <>
      <TodayMission text={pt("step3.msg_001")} />

      <Textbox className="mt-4 p-0 overflow-hidden">
        <div className="flex divide-x divide-primary bg-white border rounded-md border-primary">
          <div className="flex-1 py-5 px-4 flex flex-col items-center gap-1 transition-colors ">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-1">
              <Moon size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
              {pt("step3.msg_002")}
            </span>
            <span className="text-2xl font-black text-primary tracking-tight">
              {`${sleepHour}:${sleepMinutes}`}
            </span>
          </div>

          <div className="flex-1 py-5 px-4 flex flex-col items-center gap-1 transition-colors ">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-1">
              <Sun size={20} />
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center">
              {pt("step3.msg_003")}
            </span>
            <span className="text-2xl font-black text-primary tracking-tight">
              {`${wakeupHour}:${wakeupMinutes}`}
            </span>
          </div>
        </div>
      </Textbox>

      <Textbox className="mt-4 font-bold leading-relaxed text-slate-700 text-center">
        {pt("step3.msg_004", { name: accountName })}
      </Textbox>
    </>
  );
}
