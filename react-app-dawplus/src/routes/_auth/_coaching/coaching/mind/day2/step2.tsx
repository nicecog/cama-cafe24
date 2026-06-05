import { motion } from "framer-motion";
import day2Pic from "@/assets/images/coaching/sleep/day2/day2Pic2.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day2Step2Props {
  step1Value: string;
}

export function Day2Step2({ step1Value }: Day2Step2Props) {
  const { pt } = usePageTranslation("coaching/sleep/day2");
  const lowSleepOptions = [pt("step1.msg_004"), pt("step1.msg_005")];
  const isLowSleep = lowSleepOptions.includes(step1Value);
  const isMidSleep = step1Value === pt("step1.msg_006");
  const isGoodSleep = step1Value === pt("step1.msg_007");
  const isTooLongSleep = step1Value === pt("step1.msg_008");
  const lowSleepLead =
    step1Value === pt("step1.msg_004")
      ? pt("step2.msg_012")
      : pt("step2.msg_013");
  const introMessage = isLowSleep
    ? lowSleepLead
    : isMidSleep
      ? pt("step2.msg_009")
      : isGoodSleep
        ? pt("step2.msg_014")
        : isTooLongSleep
          ? pt("step2.msg_011")
          : pt("step2.msg_015");
  const tips = [
    pt("step2.msg_004"),
    pt("step2.msg_005"),
    pt("step2.msg_006"),
    pt("step2.msg_007"),
  ];

  return (
    <CoachingInfoStep title={pt("step2.msg_001")} image={day2Pic}>
      <div className="flex flex-col gap-10 pt-4 pb-12">
        <div className="mx-auto flex w-full max-w-[28rem] flex-col items-center space-y-3 px-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-base font-bold text-primary">
              {pt("step2.msg_002")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 text-base tracking-wide">
            <span className="relative inline-flex items-center">
              <span
                aria-hidden="true"
                className="absolute inset-x-[-0.1rem] bottom-0.5 h-1.5 rounded-sm bg-blue-500/60"
              />
              <span className="relative font-bold text-slate-900">
                {step1Value}
              </span>
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {introMessage}
          </h3>
        </div>
        <Textbox>{pt("step2.msg_003")}</Textbox>

        <div className="flex w-full flex-col gap-3">
          {tips.map((tip, idx) => (
            <motion.div
              key={tip}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-slate-100/50 hover:shadow-md transition-shadow"
            >
              {/* 왼쪽의 번호 뱃지 */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                {idx + 1}
              </div>

              {/* 텍스트 내용 */}
              <p className="text-base font-bold text-slate-700 break-keep leading-relaxed text-left flex-1">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>

        <Textbox>{pt("step2.msg_008")}</Textbox>
      </div>
    </CoachingInfoStep>
  );
}
