import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Textbox from "../../-components/elements/Textbox";
import Infomation from "@/assets/images/coaching/mental/infomation.png";
import { likertOptions, mentalQuestions } from "./-constants";
import type { MentalAnswerValue } from "./-types";

interface MentalChecklistStepProps {
  answers: MentalAnswerValue[];
  onAnswerChange: (index: number, value: number) => void;
  showValidation?: boolean;
}

export function MentalChecklistStep({
  answers,
  onAnswerChange,
  showValidation = false,
}: MentalChecklistStepProps) {
  return (
    <div className="space-y-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-100/80 bg-white px-6 py-10 shadow-sm">
        <div className="relative flex flex-col items-center justify-center gap-6">
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* 이미지 뒤의 가벼운 후광 */}
            <div className="absolute inset-0 scale-110 rounded-full bg-sky-200/20 blur-xl" />
            <img
              src={Infomation}
              alt="info"
              className="relative z-10 h-20 w-auto object-contain drop-shadow-sm"
            />
          </motion.div>
          <h3 className="text-center text-lg font-extrabold tracking-tight text-slate-800 break-keep text-pretty">
            체크리스트에 답변해 주세요
          </h3>
        </div>
      </div>

      {showValidation ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 break-keep text-pretty">
          모든 문항에 답변해야 다음 단계로 이동할 수 있어요.
        </div>
      ) : null}

      {mentalQuestions.map((question, index) => (
        <section
          key={question.id}
          className="rounded-3xl border border-slate-100 bg-white px-4 py-5 shadow-sm"
        >
          <p className="text-sm font-black tracking-wide text-primary">
            Q{question.id}
          </p>
          <Textbox className="mt-2 font-semibold text-slate-700 break-keep text-pretty">
            {question.text}
          </Textbox>

          <div
            role="radiogroup"
            aria-label={`${question.id}번 문항 응답`}
            className="mt-5"
          >
            <div className="mb-0 flex items-center justify-between text-xs font-extrabold tracking-tight text-slate-500">
              <span>{likertOptions[0].label}</span>
              <span>{likertOptions[likertOptions.length - 1].label}</span>
            </div>

            <div className="relative flex items-center justify-between px-0 py-3">
              <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200/90" />
              <div className="pointer-events-none absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/15 via-primary/25 to-primary/40" />

              {likertOptions.map((option) => {
                const isSelected = answers[index] === option.value;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => onAnswerChange(index, option.value)}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={option.label}
                    className={cn(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-0 bg-transparent p-0 transition-all appearance-none shadow-none active:bg-transparent",
                      "outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0",
                    )}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      WebkitAppearance: "none",
                      appearance: "none",
                      outline: "none",
                      boxShadow: "none",
                      border: "0",
                    }}
                  >
                    <span
                      className={cn(
                        "relative h-4 w-4 rounded-full border transition-all duration-200",
                        isSelected
                          ? "scale-125 border-primary bg-primary"
                          : "border-slate-300 bg-white",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
