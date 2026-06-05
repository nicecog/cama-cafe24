import { createFileRoute } from "@tanstack/react-router";
import day13Title from "@/assets/images/coaching/sleep/day13/Day13Title.png";
import day13Pic from "@/assets/images/coaching/sleep/day13/day13Pic.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { StandardSleepDayPage } from "../_shared/StandardSleepDayPage";
import { resolveStandardSleepDayConfig } from "../_shared/standardSleepDay";

export const Route = createFileRoute("/_auth/_coaching/coaching/mind/day13/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/sleep/day13");

  return (
    <StandardSleepDayPage
      config={resolveStandardSleepDayConfig(pt, {
        dayCd: "13",
        titleKey: "msg_001",
        ttsKeys: ["tts.msg_001", "tts.msg_002", "tts.msg_003"],
        step1IntroKey: "step1.msg_001",
        step1ErrorKey: "step1.msg_003",
        showCharacter: false,
        sleepTitleKey: "step1.msg_002",
        sleepHintKey: "step1.msg_003",
        ratingTitleKey: "step1.msg_004",
        ratingHintKey: "step1.msg_005",
        step1Top: (
          <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/10 bg-white p-5 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
            {/* 상단 텍스트 배지 */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              🎉 {pt("step1.msg_006")}
            </div>

            {/* 이미지 컨테이너 */}
            <div className="mt-4 flex justify-center rounded-2xl bg-slate-50/80 p-4 border border-slate-100/50">
              <img
                src={day13Title}
                alt=""
                aria-hidden="true"
                className="w-full max-w-[15rem] object-contain rounded-xl drop-shadow-sm"
              />
            </div>
          </div>
        ),
        step2TitleKey: "step2.msg_001",
        step2Image: day13Pic,
        step2ParagraphKeys: ["step2.msg_002", "step2.msg_003", "step2.msg_004"],
        step3MissionKey: "step3.msg_001",
        step3ParagraphKeys: ["step3.msg_002"],
      })}
    />
  );
}
