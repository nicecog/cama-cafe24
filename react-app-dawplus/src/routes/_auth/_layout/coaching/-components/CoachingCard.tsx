import * as motion from "motion/react-client";
import { Card } from "@/components/ui/Card";
import MotionProgress from "@/components/ui/Progress/MotionProgress";
import { cn } from "@/lib/utils";

interface CoachingCardProps {
  categoryCd: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  progress: number;
  bgGradient?: string;
  index: number;
  pt: (key: string, opts?: any) => string;
  onClick: (categoryCd: string) => void;
  isLargeVariant?: boolean;
}

export function CoachingCard({
  categoryCd,
  titleKey,
  descriptionKey,
  image,
  progress,
  bgGradient,
  index,
  pt,
  onClick,
  isLargeVariant = false,
}: CoachingCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      onClick={() => onClick(categoryCd)}
      className={cn(
        "flex flex-col rounded-lg text-left w-full overflow-hidden border shadow-sm",
        bgGradient,
        isLargeVariant && "from-amber-100 to-amber-50 bg-gradient-to-br",
      )}
    >
      <div className="flex-1 flex flex-col w-full">
        <Card
          className={cn(
            "p-3 bg-white/95 border-white shadow-sm flex-1 flex flex-col rounded-lg overflow-hidden relative group",
            !isLargeVariant && "min-h-[160px]",
          )}
        >
          {/* 상단 섹션: 타이틀 + 이미지 */}
          <div
            className={cn(
              "flex justify-between items-center gap-2",
              isLargeVariant ? "mb-0" : "mb-3",
            )}
          >
            <div className="flex-1 min-w-0">
              <h2
                className={cn(
                  "font-black text-gray-900 font-jalnan leading-tight break-keep",
                  isLargeVariant
                    ? "text-lg md:text-xl"
                    : "text-sm md:text-base",
                )}
              >
                {pt(titleKey)}
              </h2>
            </div>

            {/* 캐릭터 이미지 */}
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "object-contain",
                  isLargeVariant ? "w-16 h-16" : "w-14 h-14",
                )}
              >
                <img
                  src={image}
                  alt={pt(titleKey)}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* 하단 밀착 섹션: 설명 + 진행률 바 */}
          <div className={cn("mt-auto", isLargeVariant && "-mt-3")}>
            <div className={cn(isLargeVariant ? "mb-1" : "mb-3")}>
              <p
                className={cn(
                  "text-xs text-gray-600 leading-normal break-keep",
                  !isLargeVariant && "font-bold",
                )}
              >
                {pt(descriptionKey)}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-50">
              <MotionProgress
                value={progress}
                prefix={pt("MSG_30")}
                prefixClassName={cn(
                  "font-suit font-bold text-gray-600",
                  isLargeVariant ? "text-sm-fixed" : "text-xs-fixed",
                )}
                suffixClassName="text-xs"
                suffix="%"
              />
            </div>
          </div>
        </Card>
      </div>
    </motion.button>
  );
}
