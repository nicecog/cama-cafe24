import { motion } from "framer-motion";
import day3Pic from "@/assets/images/coaching/meal/day3/day3.png";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import Textbox from "../../-components/elements/Textbox";
import { CoachingInfoStep } from "../../-components/template/CoachingInfoStep";

interface Day3Step2Props {
  step1: string[];
}

export function Day3Step2({ step1 }: Day3Step2Props) {
  const { pt } = usePageTranslation("coaching/meal/day3");
  const selectedItems = step1.filter(Boolean);
  const options = [
    pt("MSG_005"),
    pt("MSG_006"),
    pt("MSG_007"),
    pt("MSG_008"),
    pt("MSG_009"),
    pt("MSG_010"),
    pt("MSG_011"),
    pt("MSG_012"),
  ];
  const guidance = [
    pt("MSG_017"),
    pt("MSG_018"),
    pt("MSG_019"),
    pt("MSG_020"),
    pt("MSG_021"),
    pt("MSG_022"),
    pt("MSG_023"),
    pt("MSG_024"),
  ];

  return (
    <CoachingInfoStep title={pt("MSG_016")} image={day3Pic}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 px-4">
            {selectedItems.map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 15,
                  stiffness: 100,
                  delay: idx * 0.1,
                }}
                className="group relative"
              >
                <span className="text-base font-black tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                  {item}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
                  className="absolute -bottom-0.5 left-0 h-1.5 w-full origin-left rounded-full bg-primary/10"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: selectedItems.length * 0.1 + 0.4 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-slate-200" />
              ))}
            </div>
            <p className="max-w-64 break-keep text-lg font-bold leading-tight text-slate-500">
              이 주된 어려움이라고 <br />
              답해주셨네요.
            </p>
          </motion.div>
        </div>

        {selectedItems.map((item) => {
          const index = options.indexOf(item);
          const body = guidance[index];

          return (
            <Textbox key={item} className="py-1">
              <div className="flex flex-col gap-2.5">
                <div className="self-start">
                  <span className="inline-block rounded-lg bg-primary/10 px-3 py-1.5 text-base font-extrabold text-primary">
                    {item}
                  </span>
                </div>
                <p className="break-keep px-1 text-base leading-relaxed text-slate-700">
                  {body}
                </p>
              </div>
            </Textbox>
          );
        })}
      </div>
    </CoachingInfoStep>
  );
}
