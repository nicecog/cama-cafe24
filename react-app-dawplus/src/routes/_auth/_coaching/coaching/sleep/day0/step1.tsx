import sleepTitle from "@/assets/images/coaching/sleep/sleep.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import CoachingWelcomePage from "../../-components/template/CoachingWelcomePage";
import type { Day0Step1Data } from "./index";

interface Day0Step1Props {
  step1: Day0Step1Data;
  onChange: (value: Day0Step1Data) => void;
}

export function Day0Step1({ step1, onChange }: Day0Step1Props) {
  const { pt } = usePageTranslation("coaching/sleep/day0");

  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue) return;

    onChange({
      ...step1,
      value: newValue,
      extra: newValue,
    });
  };

  return (
    <CoachingWelcomePage
      image={sleepTitle}
      value={step1.value}
      onChange={onChangeHandler}
    >
      <Textbox className="font-semibold">{pt("step1.description_001")}</Textbox>
      <Textbox className="font-semibold">{pt("step1.description_002")}</Textbox>
    </CoachingWelcomePage>
  );
}
