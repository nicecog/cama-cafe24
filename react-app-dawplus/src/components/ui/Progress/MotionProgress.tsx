import * as motion from "motion/react-client";
import IncrementNumber from "@/components/effect/IncrementNumber";
import { cn } from "@/lib/utils";

export default function MotionProgress(props: {
  value: number;
  max?: number; // 최대값 추가
  prefix?: string;
  suffix?: string;
  prefixClassName?: string;
  suffixClassName?: string;
  className?: string;
}) {
  const {
    value,
    max = 100,
    className,
    suffix,
    prefix = "",
    prefixClassName,
    suffixClassName,
  } = props;
  const percent = Math.min((value / max) * 100, 100); // max 대비 퍼센트 계산

  return (
    <div className={cn(className)}>
      <p className="flex gap-2 justify-between font-jalnan items-end  text-lg">
        <span className={cn(prefixClassName)}>{prefix}</span>
        <span className={cn(suffixClassName, "text-primary")}>
          <IncrementNumber target={value} duration={2000} />
          {suffix}
        </span>
      </p>
      <div className="w-full h-2 bg-primary-thin rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-primary rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
