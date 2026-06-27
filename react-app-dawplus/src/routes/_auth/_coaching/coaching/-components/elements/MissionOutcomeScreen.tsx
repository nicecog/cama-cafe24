import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";

import successImage from "@/assets/images/character/char4.png";
import failImage from "@/assets/images/character/favorite.png";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface MissionOutcomeScreenProps {
  open: boolean;
  complete: boolean;
  onAction: () => void;
}

export function MissionOutcomeScreen({
  open,
  complete,
  onAction,
}: MissionOutcomeScreenProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={cn(
          "relative w-full max-w-[340px] overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]",
          complete ? "ring-1 ring-slate-100" : "ring-1 ring-slate-100",
        )}
      >
        <div className="relative flex flex-col items-center p-8 text-center">
          {/* Character Image with floating animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mb-3"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className={cn(
                "relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white p-2 shadow-xl ring-4",
                complete ? "ring-amber-200" : "ring-sky-200",
              )}
            >
              <img
                src={complete ? successImage : failImage}
                alt="Character"
                className="h-full w-full object-contain"
              />
            </motion.div>

            {/* Subtle Glow behind character */}
            <div
              className={cn(
                "absolute left-1/2 top-1/2 -z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl opacity-20",
                complete ? "bg-amber-400" : "bg-sky-400",
              )}
            />
          </motion.div>

          <h2 className="text-2xl-fixed font-black leading-tight text-slate-900">
            {complete ? (
              <>
                미션 완료!
                <br />
                정말 고생 많으셨어요
              </>
            ) : (
              <>
                괜찮아요!
                <br />
                내일은 더 잘할 수 있어요
              </>
            )}
          </h2>

          <p className="mt-2 px-2 text-sm-fixed font-medium leading-relaxed text-slate-500/80">
            {complete ? (
              <>
                꾸준함이 모여 건강한 습관을 만들어요.
                <br />
                오늘의 보람을 잊지 말고 다음으로 가볼까요?
              </>
            ) : (
              <>
                완벽하지 않아도 괜찮아요.
                <br />
                포기하지 않는 마음이 가장 중요하니까요.
              </>
            )}
          </p>

          <div
            className={cn(
              "mt-2  flex w-full flex-col gap-4 rounded-3xl px-4 py-3 text-left transition-all",
              complete
                ? "bg-amber-50/50 ring-1 ring-amber-100"
                : "bg-sky-50/50 ring-1 ring-sky-100",
            )}
          >
            <div className="flex gap-4">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                  complete
                    ? "bg-white text-amber-500"
                    : "bg-white text-sky-500",
                )}
              >
                {complete ? <Sparkles size={20} /> : <RotateCcw size={20} />}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm-fixed font-bold text-slate-900">
                  {complete
                    ? "당신은 벌써 변하고 있어요"
                    : "내일 다시 시도하면 돼요"}
                </p>
                <p className="text-xs-fixed font-semibold leading-normal text-slate-500">
                  {complete ? (
                    <>
                      성공의 기쁨을 마음껏 누리고,
                      <br />
                      기분 좋게 다음 목표를 세워봐요.
                    </>
                  ) : (
                    <>
                      어려웠던 점을 기록해 두면,
                      <br />
                      내일은 훨씬 더 쉬워질 거예요.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onAction}
            className="group mt-4 h-14 w-full rounded-[1.25rem] bg-primary text-base-fixed font-black text-white shadow-xl shadow-primary/25 transition-all active:scale-95"
          >
            {complete ? "미션 완료" : "오늘 다시 도전하기"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
