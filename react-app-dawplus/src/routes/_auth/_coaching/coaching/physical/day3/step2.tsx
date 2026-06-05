import { motion } from "framer-motion";
import { Check } from "lucide-react";
import day3Pic from "@/assets/images/coaching/physical/day3.png";
import { useAccountName } from "@/hooks/useAccountInfo";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

export function Day3Step2(props: any) {
  const { pt } = usePageTranslation("coaching/physical/day3");
  const { step1 } = props;
  const selectedItems = step1.filter(Boolean);
  const accountName = useAccountName();
  return (
    <CoachingInfoStep image={day3Pic}>
      <div className="flex flex-col gap-6 pt-2 pb-8">
        <div className="space-y-3 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-900 break-keep">
            {pt("MSG_015", { name: accountName })}
          </h3>
          <div className="flex flex-col gap-2 text-left w-full mt-1">
            {selectedItems.map((item: string, idx: number) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-white py-2.5 px-3 shadow-sm"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                  <Check size={11} strokeWidth={4} />
                </div>
                <span className="text-base font-bold text-slate-800 break-keep leading-relaxed">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 text-left px-2 mt-1">
          <p className="text-base font-semibold leading-relaxed text-slate-600 break-keep">
            {pt("MSG_016")}
          </p>
          <p className="text-base font-semibold leading-relaxed text-slate-600 break-keep">
            {pt("MSG_017")}
          </p>
        </div>
      </div>
    </CoachingInfoStep>
  );
}
