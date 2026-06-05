import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

export function Day1Step3() {
  const { pt } = usePageTranslation("coaching/meal/day1");

  return (
    <>
      <TodayMission text={pt("MSG_017")} />
      <div className="mt-5 flex flex-col items-center px-6">
        <div className="relative flex flex-col items-center gap-4 ">
          <Textbox className="text-center font-semibold">
            <p>{pt("MSG_018")}</p>
            <p>{pt("MSG_019")}</p>
          </Textbox>
        </div>
      </div>
    </>
  );
}
