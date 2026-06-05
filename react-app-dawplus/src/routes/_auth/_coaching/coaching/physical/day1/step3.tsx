import { motion } from "framer-motion";
import { Dumbbell, ShoppingBag, Store, Train, Trash2 } from "lucide-react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import TodayMission from "../../-components/elements/TodayMission";

interface Day1Step3Props {
  accountName: string;
}

export function Day1Step3({ accountName }: Day1Step3Props) {
  const { pt } = usePageTranslation("coaching/physical/day1");

  const listItems = [
    { text: pt("step3.MSG_001"), icon: ShoppingBag },
    { text: pt("step3.MSG_002"), icon: Trash2 },
    { text: pt("step3.MSG_003"), icon: Store },
    { text: pt("step3.MSG_004"), icon: Train },
    { text: pt("step3.MSG_005"), icon: Dumbbell },
  ];

  return (
    <div className="flex flex-col gap-3">
      <TodayMission text={pt("step3.mission")} />

      <Textbox className="mt-2 text-center font-bold">
        {pt("step3.question", { name: accountName })}
      </Textbox>

      <Textbox className="mt-2 flex flex-col items-center gap-1 text-center font-bold text-base text-slate-800">
        <span className="break-keep">{pt("step3.input_prefix1")}</span>
        <span className="text-primary break-keep">
          {pt("step3.input_prefix2")}
        </span>
        <span className="break-keep">{pt("step3.input_prefix3")}</span>
      </Textbox>

      <div className="mt-2 flex flex-col gap-2">
        {listItems.map((item, idx) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="flex   items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3   shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={16} strokeWidth={2.25} />
              </div>
              <span className="text-base font-bold text-slate-800 break-keep leading-relaxed tracking-tight">
                {item.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
