import day15Pic from "@/assets/images/coaching/physical/day15.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day15Step2() {
  const { pt } = usePageTranslation("coaching/physical/day15");
  const bodies = [12, 13, 14, 15, 16].map((key) =>
    pt(`MSG_${String(key).padStart(3, "0")}`),
  );
  return (
    <CoachingInfoStep title={pt("MSG_009")} image={day15Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_010")}
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {bodies.map((body) => (
            <div
              key={body}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100/80"
            >
              <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
