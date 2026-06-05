import { ChevronLeft, ChevronRight } from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

interface CoachingFooterProps {
  onPrev?: () => void;
  onNext: () => void;
  prevText?: string;
  nextText?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * CoachingFooter 컴포넌트
 * 코칭 스텝 페이지 하단에서 이전/다음 네비게이션을 담당합니다.
 */
export function CoachingFooter({
  onPrev,
  onNext,
  prevText = "이전",
  nextText = "다음",
  disabled = false,
  className,
}: CoachingFooterProps) {
  return (
    <div className={cn("px-5 mt-auto pb-8 flex gap-3", className)}>
      {/* 이전 버튼 (onPrev가 있을 때만 표시) */}
      {onPrev && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className={cn(
            "flex-1 h-12 rounded-xl border border-gray-200 bg-white text-gray-600 text-base font-bold",
            "flex items-center justify-center gap-1 shadow-sm",
          )}
        >
          <ChevronLeft size={18} />
          <span>{prevText}</span>
        </motion.button>
      )}

      {/* 다음(또는 시작/완료) 버튼 */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        disabled={disabled}
        className={cn(
          "h-12 rounded-xl bg-primary text-white text-base font-bold transition-all",
          "flex items-center justify-center gap-1 shadow-sm shadow-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          onPrev ? "flex-[2]" : "w-full",
        )}
      >
        <span>{nextText}</span>
        <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}
