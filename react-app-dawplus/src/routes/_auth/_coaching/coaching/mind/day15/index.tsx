import { createFileRoute } from "@tanstack/react-router";
import day15Pic from "@/assets/images/coaching/sleep/day15/day15Pic.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { StandardSleepDayPage } from "../_shared/StandardSleepDayPage";
import { resolveStandardSleepDayConfig } from "../_shared/standardSleepDay";

export const Route = createFileRoute("/_auth/_coaching/coaching/mind/day15/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pt } = usePageTranslation("coaching/sleep/day15");

  return (
    <StandardSleepDayPage
      config={resolveStandardSleepDayConfig(pt, {
        dayCd: "15",
        titleKey: "msg_001",
        ttsKeys: ["tts.msg_001", "tts.msg_002", "tts.msg_003"],
        step1IntroKey: "step1.msg_001",
        step1ErrorKey: "step1.msg_003",
        sleepTitleKey: "step1.msg_002",
        sleepHintKey: "step1.msg_003",
        ratingTitleKey: "step1.msg_004",
        ratingHintKey: "step1.msg_005",
        step1Top: (
          <div className="rounded-[2rem] bg-white px-4 py-3 text-center shadow-sm">
            <p className="text-lg font-black text-slate-900 whitespace-pre-line">
              {pt("step1.msg_006")}
            </p>
          </div>
        ),
        step2TitleKey: "step2.msg_001",
        step2Image: day15Pic,
        step2ParagraphKeys: ["step2.msg_002", "step2.msg_003", "step2.msg_004"],
        step3MissionKey: "step3.msg_001",
        step3ParagraphKeys: ["step3.msg_002"],
      })}
    />
  );
}
