import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useSetAtom } from "jotai";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type5HeadImg from "@/assets/images/character/head/type5.png";
import { coachingHeaderTTSAtom } from "@/atoms/coachingHeaderAtom";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface DayStepFlowProps {
  title: string;
  ttsTexts?: Record<number, string>;
  totalSteps?: number;
  dayTotal?: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  showNextButton?: boolean | ((currentStep: number) => boolean);
  showFooter?: boolean;
  onBeforeNext?: (currentStep: number) => boolean | Promise<boolean>;
  onNextStep?: (currentStep: number) => number | undefined;
  onPrevStep?: (currentStep: number) => number | undefined;
  onSave: () => void;
  stepIndicatorVariant?: "default" | "fraction";
  /** 특정 스텝의 '다음' 버튼 내용을 커스텀 ReactNode로 대체합니다. */
  nextButtonContent?: Record<number, React.ReactNode>;
  children: React.ReactNode;
}

function PageHeader({
  title,
  dayTotal,
  dayNumber,
}: {
  title: string;
  dayTotal: number;
  dayNumber: number;
}) {
  const { pt } = usePageTranslation("coaching/coachingCommon");
  const isStart = Number.isNaN(dayNumber) || dayNumber === 0;

  return (
    <div className="mb-1 rounded-lg bg-primary/95 px-2.5 py-3.5 text-white">
      <div className="flex items-center gap-4 justify-between px-2 rounded-md">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <motion.img
            src={type5HeadImg}
            alt=""
            aria-hidden="true"
            className="relative h-full w-full object-contain ml-3"
            animate={{
              y: [0, -3.5, 0],
              rotate: [0, 1.2, 0],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="min-w-0 flex flex-col items-end">
          <h2 className="text-2xl-fixed font-bold leading-6 tracking-tight text-balance">
            {title}
          </h2>

          {isStart ? (
            <div className="mt-1 inline-flex items-center gap-1 self-end rounded-full bg-white/12 px-3 py-1 text-xs-fixed font-semibold tracking-wide text-white/95">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              <span>{pt("step_flow.start")}</span>
            </div>
          ) : (
            <div className="mt-1 flex items-center justify-center gap-1 text-sm-fixed tracking-wide">
              <span className="relative inline-flex items-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-0.1rem] bottom-0.5 h-1.5 rounded-sm bg-blue-500"
                />
                <span className="relative font-bold text-white">
                  {dayTotal}일차
                </span>
              </span>
              중
              <span className="relative inline-flex items-center">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-0.1rem] bottom-0.5 h-1.5 rounded-sm bg-blue-500"
                />
                <span className="relative font-bold text-white">
                  {dayNumber}일차
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DayStepFlow({
  title,
  ttsTexts = {},
  totalSteps = 3,
  dayTotal = 16,
  currentStep,
  onStepChange,
  showNextButton = true,
  showFooter = true,
  onBeforeNext,
  onNextStep,
  onPrevStep,
  onSave,
  stepIndicatorVariant = "default",
  nextButtonContent,
  children,
}: DayStepFlowProps) {
  const { pt } = usePageTranslation("coaching/coachingCommon");
  const location = useLocation();
  const [internalStep, setInternalStep] = useState(1);
  const step = currentStep ?? internalStep;
  const isLastStep = step === totalSteps;
  const setHeaderTtsText = useSetAtom(coachingHeaderTTSAtom);
  const shouldShowNextButton =
    typeof showNextButton === "function"
      ? showNextButton(step)
      : showNextButton;
  const shouldRenderFooter = showFooter && (step > 1 || shouldShowNextButton);

  const mainRef = useRef<HTMLElement>(null);
  const childrenArray = React.Children.toArray(children);
  const dayMatch = location.pathname.match(/day(\d+)/);
  const dayNumber = dayMatch ? Number(dayMatch[1]) : Number.NaN;

  useEffect(() => {
    const ttsText = ttsTexts[step] || "";
    setHeaderTtsText(ttsText);

    return () => {
      setHeaderTtsText(null);
    };
  }, [setHeaderTtsText, ttsTexts, step]);

  const handleNext = async () => {
    if (onBeforeNext) {
      const canProceed = await onBeforeNext(step);
      if (!canProceed) return;
    }

    if (isLastStep) {
      onSave();
    } else {
      const nextStep = onNextStep?.(step) ?? Math.min(step + 1, totalSteps);

      if (onStepChange) {
        onStepChange(nextStep);
      } else {
        setInternalStep(nextStep);
      }
    }
  };

  const handlePrev = () => {
    const nextStep = onPrevStep?.(step) ?? Math.max(step - 1, 1);

    if (onStepChange) {
      onStepChange(nextStep);
    } else {
      setInternalStep(nextStep);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-50">
      <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-6 pt-4 pb-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <PageHeader title={title} dayTotal={dayTotal} dayNumber={dayNumber} />

          {/* Progress Indicator */}
          <div className="my-2 flex items-center justify-end">
            {stepIndicatorVariant === "fraction" ? (
              <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-black tracking-tight text-slate-600">
                {step}/{totalSteps}
              </div>
            ) : (
              <StepIndicator step={step} totalSteps={totalSteps} />
            )}
          </div>

          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => {
              if (mainRef.current) {
                mainRef.current.scrollTop = 0;
              }
            }}
          >
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="py-1"
            >
              {childrenArray[step - 1]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence initial={false}>
        {shouldRenderFooter ? (
          <motion.footer
            key="footer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative z-10 shrink-0 border-t border-slate-100 bg-white px-3 pb-2 pt-2"
          >
            <div className="mx-auto max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
              <AnimatePresence initial={false}>
                {(step > 1 || shouldShowNextButton) && (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex gap-2"
                  >
                    {step > 1 && (
                      <motion.button
                        type="button"
                        onClick={handlePrev}
                        whileTap={{ scale: 0.98 }}
                        className="flex h-14 flex-1 items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white text-base font-bold text-slate-600 active:scale-95"
                      >
                        <ChevronLeft size={16} />
                        {pt("step_flow.prev")}
                      </motion.button>
                    )}
                    <motion.button
                      type="button"
                      data-testid={
                        isLastStep
                          ? "coaching-day-complete"
                          : "coaching-day-next"
                      }
                      onClick={handleNext}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.985 }}
                      className="flex h-14 flex-1 items-center justify-center gap-1 rounded-2xl bg-primary text-base font-black text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                    >
                      {isLastStep ? (
                        <>
                          <Check size={16} />
                          {pt("step_flow.complete")}
                        </>
                      ) : nextButtonContent?.[step] ? (
                        nextButtonContent[step]
                      ) : (
                        <>
                          {pt("step_flow.next")}
                          <ChevronRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.footer>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
