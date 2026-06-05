import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Children,
  createContext,
  Fragment,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Context for sharing stepper state
interface StepInfo {
  children: ReactNode;
  label?: string;
}

interface StepperContextValue {
  currentStep: number;
  totalSteps: number;
  direction: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  steps: StepInfo[];
  goToStep: (step: number) => void;
  goBack: () => void;
  goNext: () => void;
  complete: () => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within StepperPage");
  }
  return context;
}

// Main StepperPage Provider
interface StepperPageProps {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
}

export default function StepperPage({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onComplete = () => {},
}: StepperPageProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [direction, setDirection] = useState<number>(0);

  // Extract StepContent children and labels recursively
  const extractStepContents = (node: ReactNode): StepInfo[] => {
    const steps: StepInfo[] = [];

    const traverse = (child: ReactNode) => {
      if (!child) return;

      if (typeof child === "object" && "type" in child) {
        if ((child as any).type === StepContent) {
          steps.push({
            children: (child as any).props.children,
            label: (child as any).props.label,
          });
        } else if ((child as any).props?.children) {
          Children.forEach((child as any).props.children, traverse);
        }
      }
    };

    Children.forEach(node, traverse);
    return steps;
  };

  const steps = extractStepContents(children);
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const updateStep = (newStep: number) => {
    if (newStep < 1 || newStep > totalSteps) return;
    setCurrentStep(newStep);
    onStepChange(newStep);
  };

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    updateStep(step);
  };

  const goBack = () => {
    if (!isFirstStep) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const goNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const complete = () => {
    onComplete();
  };

  const contextValue: StepperContextValue = {
    currentStep,
    totalSteps,
    direction,
    isFirstStep,
    isLastStep,
    steps,
    goToStep,
    goBack,
    goNext,
    complete,
  };

  return (
    <StepperContext.Provider value={contextValue}>
      {children}
    </StepperContext.Provider>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  className?: string;
  children?: ReactNode;
  renderIndicator?: (props: RenderIndicatorProps) => ReactNode;
}

interface RenderIndicatorProps {
  step: number;
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  isComplete: boolean;

  onClick: () => void;
}

export function StepIndicator({
  className = "",
  renderIndicator,
  children,
}: StepIndicatorProps) {
  const { currentStep, totalSteps, goToStep, steps } = useStepperContext();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      layout
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`flex flex-col gap-2${className}`}
    >
      <div className="flex items-center justify-center w-full max-w-4xl mx-auto px-4 ">
        {steps.map((info, index) => {
          const step = index + 1;
          const isActive = currentStep === step;
          const isComplete = currentStep > step;
          const isNotLast = index < steps.length - 1;

          return (
            <Fragment key={step}>
              <motion.div
                layout
                variants={itemVariants}
                className="flex flex-col items-center relative z-10 group cursor-pointer"
                onClick={() => goToStep(step)}
              >
                {renderIndicator ? (
                  renderIndicator({
                    step,
                    currentStep,
                    totalSteps,
                    isActive,
                    isComplete,
                    onClick: () => goToStep(step),
                  })
                ) : (
                  <DefaultStepIndicator
                    step={step}
                    label={info.label}
                    currentStep={currentStep}
                    onClickStep={() => goToStep(step)}
                  />
                )}
              </motion.div>

              {/* Connector Line - Inspired by Stepper.tsx */}
              {isNotLast && <StepConnector isComplete={currentStep > step} />}
            </Fragment>
          );
        })}
      </div>
      {children}
    </motion.div>
  );
}

// Step Content Component
interface StepContentProps {
  children: ReactNode;
  label?: string; // Step name to show in indicator
  className?: string;
}

export function StepContent({ children, className = "" }: StepContentProps) {
  return (
    <div className={`max-w-3xl mx-auto w-full ${className}`}>{children}</div>
  );
}

// Step Content Wrapper (renders current step with animation)
interface StepContentWrapperProps {
  className?: string;
  children?: ReactNode;
  scrollToTopOnStepChange?: boolean;
}

export function StepContentWrapper({
  className = "",
  scrollToTopOnStepChange = true,
}: StepContentWrapperProps) {
  const { currentStep, direction, steps } = useStepperContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top when step changes
  useLayoutEffect(() => {
    if (currentStep && scrollToTopOnStepChange && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [currentStep, scrollToTopOnStepChange]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    // When the container has 'scroll-smooth' class,
    // simply setting scrollTop or using behavior: 'smooth' works well.
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto hide-scrollbar overflow-x-hidden bg-gray-50 relative ${className}`}
      style={{ scrollbarGutter: "stable", scrollBehavior: "smooth" }}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
            opacity: { duration: 0.2 },
          }}
          className="w-full px-6 py-6"
        >
          <div className="max-w-3xl mx-auto w-full">
            {steps[currentStep - 1].children}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="sticky bottom-8 float-right mr-8 z-50 flex items-center justify-center w-10 h-10 bg-white/40 backdrop-blur-sm border border-black/5 shadow-sm rounded-full text-gray-500 hover:text-primary transition-all"
            aria-label="위로 가기"
          >
            <ArrowUpIcon className="w-5 h-5 text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// Navigation Buttons Component
interface StepNavigationProps {
  className?: string;
  backButtonText?: string;
  nextButtonText?: string;
  completeButtonText?: string;
  backButtonClassName?: string;
  nextButtonClassName?: string;
  renderBackButton?: (props: {
    onClick: () => void;
    text: string;
  }) => ReactNode;
  renderNextButton?: (props: {
    onClick: () => void;
    text: string;
    isLastStep: boolean;
  }) => ReactNode;
}

export function StepNavigation({
  className = "",
  backButtonText = "이전",
  nextButtonText = "다음",
  completeButtonText = "완료",
  backButtonClassName = "",
  nextButtonClassName = "",
  renderBackButton,
  renderNextButton,
}: StepNavigationProps) {
  const { isFirstStep, isLastStep, goBack, goNext, complete } =
    useStepperContext();

  const handleNext = isLastStep ? complete : goNext;
  const buttonText = isLastStep ? completeButtonText : nextButtonText;

  return (
    <div className={`flex justify-between items-center gap-4 ${className}`}>
      {!isFirstStep &&
        (renderBackButton ? (
          renderBackButton({ onClick: goBack, text: backButtonText })
        ) : (
          <button
            type="button"
            onClick={goBack}
            className={`px-8 py-2 rounded-lg font-semibold text-sm transition-all border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 ${backButtonClassName}`}
          >
            {backButtonText}
          </button>
        ))}
      {renderNextButton ? (
        renderNextButton({ onClick: handleNext, text: buttonText, isLastStep })
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className={`px-8 py-2 rounded-lg font-semibold text-sm  border border-gray-300  ml-auto ${nextButtonClassName}`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

// SlideTransition is now deprecated in favor of direct motion.div in StepContentWrapper
// Keeping for internal use if needed or removing if unused

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

interface DefaultStepIndicatorProps {
  step: number;
  label?: string;
  currentStep: number;
  onClickStep: (step: number) => void;
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  return (
    <div className="flex-1 mx-2 h-[2px] min-w-[2rem] bg-white/20 rounded-full overflow-hidden relative">
      <motion.div
        className="absolute inset-y-0 left-0 bg-white"
        initial={false}
        animate={{ width: isComplete ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}

function DefaultStepIndicator({
  step,
  label,
  currentStep,
  onClickStep,
}: DefaultStepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
        ? "inactive"
        : "complete";

  return (
    <motion.div
      layout
      onClick={() => onClickStep(step)}
      className="cursor-pointer flex items-center justify-center p-2"
    >
      <motion.div
        layout
        initial={false}
        animate={{
          backgroundColor:
            status === "active" ? "#ffffff" : "rgba(255,255,255,0.2)",
          color: status === "active" ? "#5227FF" : "#ffffff",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`flex items-center justify-center rounded-full font-bold text-[11px] shadow-lg backdrop-blur-md whitespace-nowrap relative overflow-hidden h-8 ${
          status === "active" && label ? "px-4 min-w-[32px]" : "w-8"
        }`}
      >
        {status === "complete" ? (
          <CheckIcon />
        ) : status === "active" ? (
          label ? (
            <motion.span
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key="label"
            >
              {label}
            </motion.span>
          ) : (
            <motion.div
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key="dot"
              className="w-1.5 h-1.5 rounded-full bg-[#5227FF]"
            />
          )
        ) : (
          <motion.span layout key="number">
            {step}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function ArrowUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
}

// Hook to use stepper programmatically
export function useStepper() {
  return useStepperContext();
}
