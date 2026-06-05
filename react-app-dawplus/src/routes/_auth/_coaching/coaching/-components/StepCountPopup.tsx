import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useId } from "react";
import { useNativeStepCount } from "@/hooks/useNativeStepCount";
import StepImage from "@/assets/images/character/activity.png";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Popup from "@/components/ui/Popup";
import { useToast } from "@/hooks/use-toast";
import { usePageTranslation } from "@/hooks/usePageTranslation";

interface StepCountPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onConfirm: (value: string) => void | Promise<void>;
}

export function StepCountPopup({
  open,
  setOpen,
  value,
  onChange,
  onConfirm,
}: StepCountPopupProps) {
  const { pt } = usePageTranslation("coaching/physical/index");
  const { toast } = useToast();
  const inputId = useId();
  const { fetchSteps, loading: nativeLoading, isWebView } = useNativeStepCount();

  useEffect(() => {
    if (!open || !isWebView) {
      return;
    }
    void fetchSteps().then((steps) => {
      if (steps !== null && steps > 0) {
        onChange(String(steps));
      }
    });
  }, [open, isWebView, fetchSteps, onChange]);

  const handleConfirm = async () => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      toast({
        description: pt("MSG_029"),
      });
      return;
    }

    await onConfirm(trimmedValue);
  };

  return (
    <Popup
      open={open}
      setOpen={setOpen}
      title={pt("MSG_019")}
      className="h-auto  rounded-t-[28px] sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px]"
    >
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/12 via-sky-50 to-transparent" />

        <div className="relative px-6 pb-7 pt-8">
          <div className="relative mx-auto flex h-36 w-[200px] flex-col items-center justify-end overflow-visible">
            {/* Speech Bubble / Dialog Balloon */}
            <div className="absolute -top-4 z-20 flex flex-col items-center">
              <div className="relative inline-flex items-center gap-1 rounded-2xl bg-primary px-3.5 py-1.5 text-sm font-extrabold text-white shadow-md shadow-primary/20">
                <Sparkles size={14} className="text-white/90" />
                <span>{pt("MSG_020")}</span>
                {/* Speech bubble small triangle pointer */}
                <div className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary" />
              </div>
            </div>

            {/* Character dynamic drop shadow */}
            <motion.div
              className="absolute bottom-0 h-1.5 w-16 rounded-full bg-slate-900/10 blur-[3px]"
              animate={{
                scaleX: [1, 0.8, 1],
                opacity: [0.6, 0.35, 0.6],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Character walk/bobbing animation */}
            <motion.img
              src={StepImage}
              alt="Walking character"
              className="relative z-10 h-28 w-auto object-contain"
              animate={{
                y: [0, -6, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="mt-5 text-center flex flex-col items-center">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 break-keep px-2 leading-snug">
              {pt("MSG_021")} {pt("MSG_022")}
            </h3>
            <p className="mt-3 text-lg font-bold leading-relaxed text-slate-700 break-keep px-4">
              {pt("MSG_023")} {pt("MSG_024")}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {isWebView && nativeLoading && (
              <p className="text-center text-sm text-slate-500">
                기기에서 걸음수를 불러오는 중…
              </p>
            )}
            <div className="relative flex items-center">
              <Input
                id={inputId}
                type="number"
                inputMode="numeric"
                min="0"
                placeholder={pt("MSG_026")}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={nativeLoading}
                className="h-14 w-full rounded-md border-slate-200 bg-slate-50/50 pl-5 pr-16 text-xl font-bold text-slate-900 shadow-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 placeholder:text-slate-300"
              />
              <span className="absolute right-5 text-lg font-bold text-slate-800">
                {pt("MSG_027")}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-14 flex-1 rounded-md border-slate-300 text-base font-bold text-slate-700"
              onClick={() => setOpen(false)}
            >
              {pt("MSG_010")}
            </Button>
            <Button
              type="button"
              className="h-14 flex-1 rounded-md text-base font-bold text-white shadow-lg shadow-primary/20"
              onClick={handleConfirm}
            >
              {pt("MSG_028")}
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  );
}
