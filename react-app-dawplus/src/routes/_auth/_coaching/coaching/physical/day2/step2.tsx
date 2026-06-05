import day2Pic from "@/assets/images/coaching/physical/day2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day2Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day2");
  const { selectedCount } = props;
  const line1 =
    selectedCount <= 2
      ? pt("MSG_019")
      : selectedCount <= 5
        ? pt("MSG_022")
        : pt("MSG_025");
  const line2 =
    selectedCount <= 2
      ? pt("MSG_020")
      : selectedCount <= 5
        ? pt("MSG_023")
        : pt("MSG_026");

  return (
    <CoachingInfoStep image={day2Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {line1}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {line2}
          </p>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
