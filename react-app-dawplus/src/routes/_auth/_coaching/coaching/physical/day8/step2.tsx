import day8Pic from "@/assets/images/coaching/physical/day8.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day8Step2() {
  const { pt } = usePageTranslation("coaching/physical/day8");
  const sections = [
    { title: pt("MSG_008"), content: pt("MSG_007") },
    { title: pt("MSG_010"), content: pt("MSG_009") },
  ];

  return (
    <CoachingInfoStep title={pt("MSG_005")} image={day8Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_006")}
          </h3>
        </div>

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-1">
                <div className="h-2 w-2 rounded-full bg-primary shadow-sm" />
                <h4 className="text-lg font-black tracking-tight text-slate-900">
                  {section.title}
                </h4>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100/80">
                <p className="text-base font-bold leading-relaxed text-slate-600 break-keep">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CoachingInfoStep>
  );
}
