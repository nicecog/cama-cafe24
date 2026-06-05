import activityTitle from "@/assets/images/character/activity.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import CoachingWelcomePage from "../../-components/template/CoachingWelcomePage";
import type { Day0Step1Data } from "./index";

interface Day0Step1Props {
  accountName: string;
  step1: Day0Step1Data;
  onChange: (value: Day0Step1Data) => void;
}

export function Day0Step1({ accountName, step1, onChange }: Day0Step1Props) {
  const { pt } = usePageTranslation("coaching/physical/day0");

  const onChangeHandler = (newValue: string) => {
    if (step1.value === newValue && step1.extra === newValue) return;

    onChange({
      ...step1,
      value: newValue,
      extra: newValue,
    });
  };

  return (
    <CoachingWelcomePage
      image={activityTitle}
      value={step1.value}
      onChange={onChangeHandler}
    >
      <Textbox className="font-semibold">{pt("MSG_003")}</Textbox>
      <Textbox className="font-semibold">
        {pt("MSG_005", { name: accountName })}
      </Textbox>
    </CoachingWelcomePage>
  );
}
