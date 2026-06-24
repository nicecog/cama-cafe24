import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { usePageTranslation } from "@/hooks/usePageTranslation";
import { cn } from "@/lib/utils";

interface CoachingWelcomePageProps {
  image: string;
  // Selection Props
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  title?: React.ReactNode;
  extraPlaceholder?: string;
  // Description (as children)
  children: React.ReactNode;
}

export default function CoachingWelcomePage({
  image,
  value,
  onChange,
  options,
  title,
  extraPlaceholder = "중요한 삶의 가치를 입력해 주세요.",
  children,
}: CoachingWelcomePageProps) {
  const { pt } = usePageTranslation("coaching/coachingCommon");
  const translatedOptions = options ?? [
    pt("options.msg_001"),
    pt("options.msg_002"),
    pt("options.msg_003"),
    pt("options.msg_004"),
    pt("options.msg_005"),
    pt("options.msg_006"),
  ];

  const greetingTitle = pt("greeting_title");
  const greetingSubtitle = pt("greeting_subtitle");

  // --- Selection Logic (from CoachingSelectionGrid) ---
  const isPresetOption = translatedOptions.includes(value);
  const [isExtraMode, setIsExtraMode] = useState(
    !isPresetOption && value !== "",
  );
  const [extraInput, setExtraInput] = useState(!isPresetOption ? value : "");

  const handleSelect = (option: string) => {
    setIsExtraMode(false);
    onChange(option);
  };

  const handleExtraSelect = () => {
    setIsExtraMode(true);
    onChange(extraInput);
  };

  const handleExtraInputChange = (text: string) => {
    setExtraInput(text);
    onChange(text);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center ">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative w-full"
        >
          <div className="relative z-10 w-full rounded-2xl border border-slate-100/80 bg-white px-5 py-5 shadow-sm">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent" />

            <div className="relative z-10 flex flex-col text-base">
              {title ? (
                <p className="break-keep whitespace-pre-wrap text-center text-xl font-bold leading-6 text-slate-800">
                  {title}
                </p>
              ) : (
                <>
                  <p className="break-keep whitespace-pre-wrap text-center text-xl font-bold leading-6 text-slate-800">
                    {greetingTitle}
                  </p>
                  <p className="mt-1 break-keep whitespace-pre-wrap text-center text-xl font-bold leading-6 text-slate-800">
                    {greetingSubtitle}
                  </p>
                </>
              )}
              <div className="relative my-4 flex h-36 w-36 items-center justify-center self-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-100/50 blur-xl"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.95, 1.05, 0.95],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-white/60 shadow-sm ring-1 ring-white/50 backdrop-blur-md" />
                <motion.img
                  src={image}
                  alt=""
                  className="relative z-10 w-24 object-contain drop-shadow-md"
                  animate={{ y: [-4, 4, -4] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3">{children}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- Selection Grid Section --- */}
      <div className="px-1">
        <div className="relative mb-5 mt-10 w-full text-center">
          <h2 className="text-balance whitespace-pre-wrap text-2xl font-black leading-6 tracking-tight text-slate-900 sm:text-3xl">
            {pt("questions1")}
            <span className="relative mb-0.5 inline-block leading-9 text-primary">
              {pt("questions2")}
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                className="absolute bottom-1 left-0 z-0 h-2 rounded-sm bg-primary/20"
              />
            </span>
            {pt("questions3")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {translatedOptions.map((option) => {
            const isSelected = value === option && !isExtraMode;

            return (
              <motion.button
                key={option}
                type="button"
                data-testid={`coaching-option-${option}`}
                onClick={() => handleSelect(option)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.975 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all",
                  isSelected
                    ? "border-primary/80 bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm",
                )}
              >
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "text-base font-black tracking-tight sm:text-lg",
                      isSelected
                        ? "text-white"
                        : "text-slate-800 group-hover:text-primary",
                    )}
                  >
                    {option}
                  </span>
                  <motion.span
                    initial={false}
                    animate={{
                      scale: isSelected ? 1 : 0.85,
                      opacity: isSelected ? 1 : 0,
                      y: isSelected ? 0 : 2,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 26,
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm"
                    aria-hidden="true"
                  >
                    <Check size={16} strokeWidth={4} />
                  </motion.span>
                </div>
              </motion.button>
            );
          })}

          <motion.button
            type="button"
            onClick={handleExtraSelect}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.975 }}
            className={cn(
              "group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all",
              isExtraMode
                ? "border-primary/80 bg-gradient-to-br from-primary to-primary/90 text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 hover:shadow-sm",
            )}
          >
            <div className="relative z-10 flex items-center justify-between gap-3">
              {pt("options.msg_007")}
              <motion.span
                initial={false}
                animate={{
                  scale: isExtraMode ? 1 : 0.85,
                  opacity: isExtraMode ? 1 : 0,
                  y: isExtraMode ? 0 : 2,
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 26,
                }}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/95 text-primary shadow-sm"
                aria-hidden="true"
              >
                <Check size={16} strokeWidth={4} />
              </motion.span>
            </div>
          </motion.button>
        </div>

        {isExtraMode && (
          <input
            type="text"
            value={extraInput}
            placeholder={extraPlaceholder}
            onChange={({ target: { value } }) => handleExtraInputChange(value)}
            className="mt-3 w-full rounded-2xl border-2 border-slate-100 bg-white px-4 py-3 text-base leading-7 text-slate-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        )}
      </div>
    </>
  );
}
