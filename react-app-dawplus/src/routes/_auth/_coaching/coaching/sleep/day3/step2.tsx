import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { ArrowRight, Clock, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import day3Pic from "@/assets/images/coaching/sleep/day3/day3Pic.png";
import { accountMeAtom } from "@/atoms/accountAtoms";
import { useUserAnswerInfoList } from "@/hooks/queries";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";
import type { Day3Step1Data } from "./utils";
import { calculateSleepDurationAndOutput } from "./utils";

interface Day3Step2Props {
  data: Day3Step1Data;
}

export function Day3Step2({ data }: Day3Step2Props) {
  const { pt } = usePageTranslation("coaching/sleep/day3");

  const accountName = useAccountName();
  const accountMe = useAtomValue(accountMeAtom);
  const loginId = accountMe.data?.loginId ?? "";
  const { data: answerList = [] } = useUserAnswerInfoList({
    loginId,
    categoryCd: "A",
  });

  const result = answerList.find(
    (item) => item.stepDayCd === "02" && item.progressTypeCd === "A3",
  );

  const selectedTime = useMemo(() => {
    const numbers = result?.answerChoice?.match(/\d+/g)?.map(Number) ?? [];

    return numbers.length > 0 ? Math.max(...numbers) : 0;
  }, [result?.answerChoice]);

  const { sleepDuration, statement } = calculateSleepDurationAndOutput(
    data,
    selectedTime,
  );

  const sleepHour = data.sleep.hour.padStart(2, "0");
  const sleepMinutes = data.sleep.minutes.padStart(2, "0");
  const wakeupHour = data.wakeup.hour.padStart(2, "0");
  const wakeupMinutes = data.wakeup.minutes.padStart(2, "0");

  return (
    <CoachingInfoStep
      image={day3Pic}
      subtitle={pt("step2.msg_001", { name: accountName })}
    >
      {statement && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex w-full items-start gap-3.5 rounded-2xl   p-4.5   transition-all duration-300 flex items-center px-2"
        >
          <p className="text-base font-bold text-slate-700 break-keep leading-relaxed text-center flex-1">
            {statement}
          </p>
        </motion.div>
      )}
      <div className="flex flex-col gap-6 pt-4 pb-6 w-full max-w-[28rem] mx-auto">
        {/* Sleep Target Dashboard Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/30 p-6 border border-indigo-100/60 shadow-md shadow-slate-100/80 hover:shadow-lg transition-all"
        >
          {/* Connected Time Schedule */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            {/* Bedtime Section */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/30 shadow-sm shadow-indigo-100/20">
                <Moon size={22} className="fill-indigo-100/20" />
              </div>
              <span className="text-xs font-bold text-slate-400">
                {pt("step2.msg_002")}
              </span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">
                {`${sleepHour}:${sleepMinutes}`}
              </span>
            </div>

            {/* Connecting Timeline Arrow */}
            <div className="flex items-center justify-center flex-shrink-0 px-2">
              <div className="w-12 border-t-2 border-dashed border-indigo-100 relative flex items-center justify-center">
                <div className="absolute bg-white border border-indigo-50 p-1.5 rounded-full shadow-sm text-indigo-400">
                  <ArrowRight size={12} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Wakeup Section */}
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100/30 shadow-sm shadow-amber-100/20">
                <Sun size={22} className="fill-amber-100/20" />
              </div>
              <span className="text-xs font-bold text-slate-400">
                {pt("step2.msg_003")}
              </span>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight mt-1">
                {`${wakeupHour}:${wakeupMinutes}`}
              </span>
            </div>
          </div>

          {/* Soft divider */}
          <div className="h-px bg-slate-100/80 my-5 relative z-10" />

          {/* Sleep Duration Display */}
          <div className="text-center relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-xs font-bold mb-2.5 border border-slate-100/50">
              <Clock size={12} className="text-slate-400" />총 수면 시간
            </span>

            <div className="flex items-baseline justify-center gap-1">
              {sleepDuration.hours > 0 && (
                <span className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-camaColor tracking-tight">
                    {sleepDuration.hours}
                  </span>
                  <span className="text-sm font-extrabold text-slate-500 mr-1.5">
                    시간
                  </span>
                </span>
              )}
              {sleepDuration.minutes > 0 && (
                <span className="flex items-baseline gap-0.5">
                  <span className="text-3xl font-black text-camaColor tracking-tight">
                    {sleepDuration.minutes}
                  </span>
                  <span className="text-sm font-extrabold text-slate-500">
                    분
                  </span>
                </span>
              )}
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-600 leading-relaxed text-center px-2">
              {sleepDuration.hours > 0 || sleepDuration.minutes > 0 ? (
                <div className="break-keep">
                  {pt("step2.msg_004")}{" "}
                  <span className="text-camaColor font-bold underline decoration-2 decoration-camaColor/20 underline-offset-4">
                    {pt("step2.msg_005")}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400 font-medium">
                  {pt("step2.msg_006")}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Highlight Card for the comparison statement */}
      </div>
    </CoachingInfoStep>
  );
}
