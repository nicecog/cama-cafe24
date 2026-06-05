import * as motion from "motion/react-client";
import IncrementNumber from "@/components/effect/IncrementNumber";
import { cn } from "@/lib/utils";

type NumberCounterType = {
  title: string;
  count: number;
  className?: string;
};

export default function NumberCounter(props: NumberCounterType) {
  const { count, title, className } = props;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        scale: { type: "spring", duration: 0.4, bounce: 0.5 },
      }}
      whileHover={{
        scale: 1.05,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      }}
      className={cn(
        "border-2 rounded-lg px-9 py-6 border-primary flex flex-col gap-1",
        className,
      )}
    >
      <h2 className="text-lg font-semibold font-jalnan pb-3">{title}</h2>
      <div className="text-3xl font-jalnan flex gap-1">
        <IncrementNumber target={count} />초
      </div>
    </motion.div>
  );
}
