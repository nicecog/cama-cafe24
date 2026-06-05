import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import type { Day1Step3Data } from "./index";

interface Day1Step3Props {
  accountName: string;
  step3: Day1Step3Data;
  onChange: (value: Day1Step3Data) => void;
}

export function Day1Step3({ accountName, step3, onChange }: Day1Step3Props) {
  const { pt } = usePageTranslation("coaching/sleep/day1");

  return (
    <div className="flex flex-col gap-4">
      <TodayMission text={pt("step3.mission")} />
      <Textbox className="font-bold">
        {pt("step3.question", { name: accountName })}
        <br />
        <span className="text-sm font-semibold text-slate-600">
          {pt("step3.example")}
        </span>
      </Textbox>

      <Textbox className="text-primary font-bold">
        {pt("step3.input_prefix")}
      </Textbox>

      <div className="mx-auto w-full max-w-[24rem] rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col items-center gap-1.5">
        <p className="text-sm font-semibold text-slate-500 break-keep leading-relaxed italic">
          "{pt("step3.closing")}"
        </p>
      </div>

      <MissionInput
        value={step3.value}
        onChange={(value) =>
          onChange({
            value,
          })
        }
      />
    </div>
  );
}
