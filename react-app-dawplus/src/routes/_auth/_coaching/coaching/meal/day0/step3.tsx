import { usePageTranslation } from "@/hooks/usePageTranslation";
import MissionInput from "../../-components/elements/MissionInput";
import { PercentageSlider } from "../../-components/elements/PercentageSlider";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";
import type { Day0Step1Data, Day0Step3Data } from "./index";

interface Day0Step3Props {
  accountName: string;

  step1: Day0Step1Data;
  step3: Day0Step3Data;
  onChange: (value: Day0Step3Data) => void;
}

export function Day0Step3({
  accountName,

  step1,
  step3,
  onChange,
}: Day0Step3Props) {
  const { pt } = usePageTranslation("coaching/meal/day0");
  const selectedText = step1.extra.trim() || step1.value.trim();

  return (
    <>
      {/*  오늘의 미션  */}
      <TodayMission text={pt("step3.mission")} />
      <Textbox className="mt-4 text-center">
        {pt("step3.value_text", { name: accountName })}
        <br />
        <span className="mx-1 text-primary font-bold">{selectedText}</span>
        {pt("step3.value_suffix")}
      </Textbox>

      <PercentageSlider
        className="mt-4"
        value={step3.value1}
        onChange={(value1) => {
          onChange({
            ...step3,
            value1,
          });
        }}
        label={pt("step3.slider_label", { name: accountName })}
      />
      <Textbox className="mt-8 text-center font-bold">
        {pt("step3.question")}
        <p className="text-sm font-semibold text-slate-600">
          {pt("step3.example")}
        </p>
      </Textbox>

      <MissionInput
        value={step3.value2}
        onChange={(value) =>
          onChange({
            ...step3,
            value2: value,
          })
        }
      />
      <Textbox className="mt-4  text-center">{pt("step3.closing")}</Textbox>
    </>
  );
}
