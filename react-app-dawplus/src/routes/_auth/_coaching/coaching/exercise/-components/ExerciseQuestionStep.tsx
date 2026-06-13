import { motion } from "framer-motion";
import type5 from "@/assets/images/coaching/main/type5.png";

interface ExerciseQuestionStepProps {
  current: number;
  total: number;
  question: string;
  onAnswer: (value: "Y" | "N") => void;
}

export function ExerciseQuestionStep({
  current,
  total,
  question,
  onAnswer,
}: ExerciseQuestionStepProps) {
  return (
    <section className="rounded-md border border-primary/15 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
            Question {current} / {total}
          </span>
          <div className="mt-3 h-1.5 w-24 rounded-md bg-primary/15">
            <div
              className="h-full rounded-md bg-primary transition-all"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-primary-thin/15">
          <motion.img
            src={type5}
            alt=""
            aria-hidden="true"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="rounded-md bg-primary-thin/10 p-4">
        <p className="whitespace-pre-line break-keep text-lg font-bold leading-8 text-slate-900">
          {question}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onAnswer("Y")}
          className="h-14 rounded-md border border-slate-200 bg-white text-md font-bold text-slate-700 transition hover:border-primary/30 hover:bg-primary-thin/5 active:scale-95"
        >
          예
        </button>
        <button
          type="button"
          onClick={() => onAnswer("N")}
          className="h-14 rounded-md border border-slate-200 bg-white text-md font-bold text-slate-700 transition hover:border-primary/30 hover:bg-primary-thin/5 active:scale-95"
        >
          아니오
        </button>
      </div>
    </section>
  );
}
