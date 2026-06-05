import day9Pic1 from "@/assets/images/coaching/physical/day9_1.png";
import day9Pic2 from "@/assets/images/coaching/physical/day9_2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day9Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day9");
  const { step1 } = props;
  const sections = [
    { title: pt("MSG_014"), content: pt("MSG_013") },
    { title: pt("MSG_016"), content: pt("MSG_015") },
    { title: pt("MSG_018"), content: pt("MSG_017") },
  ];

  return (
    <CoachingInfoStep
      title={pt("MSG_008")}
      image={step1 === pt("MSG_011") ? day9Pic1 : day9Pic2}
    >
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="space-y-3 px-1 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_010")}
          </h3>
          <p className="text-base font-bold text-slate-500 break-keep">
            {pt("MSG_019")}
          </p>
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
