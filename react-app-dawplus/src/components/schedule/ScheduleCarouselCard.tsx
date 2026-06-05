import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import type { WebviewSchedule } from "@/apis/types";
import Image1 from "@/assets/images/character/char1.png"; // 내원
import Image3 from "@/assets/images/character/char3.png"; // 복약
import Image4 from "@/assets/images/character/hello/helloType3.png"; // 기타

interface ScheduleCarouselCardProps {
  schedule: WebviewSchedule;
  onComplete: (id: number) => void;
}

// 타입별 이미지 가져오기
const getTypeImage = (type: string) => {
  switch (type) {
    case "MEDICINE":
      return Image3;
    case "HOSPITAL":
      return Image1;
    case "ETC":
      return Image4;
    default:
      return Image4;
  }
};

// 타입별 색상 가져오기
const getTypeColor = (type: string) => {
  switch (type) {
    case "MEDICINE": // 복약
      return {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-600",
        badge: "bg-blue-500 text-white",
      };
    case "HOSPITAL": // 내원
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
        badge: "bg-green-500 text-white",
      };
    case "ETC": // 기타
      return {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-600",
        badge: "bg-purple-500 text-white",
      };
    default:
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600",
        badge: "bg-gray-500 text-white",
      };
  }
};

// 타입별 라벨 가져오기
const getTypeLabel = (type: string) => {
  switch (type) {
    case "MEDICINE":
      return "복약";
    case "HOSPITAL":
      return "내원";
    case "ETC":
      return "기타";
    default:
      return "기타";
  }
};

export function ScheduleCarouselCard({
  schedule,
  onComplete,
}: ScheduleCarouselCardProps) {
  const image = getTypeImage(schedule.scheduleType);
  const label = getTypeLabel(schedule.scheduleType);
  const colors = getTypeColor(schedule.scheduleType);
  const isCompleted = schedule.done;

  const handleClick = () => {
    onComplete(schedule.scheduleSeq);
  };

  return (
    <motion.div
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex-shrink-0 w-[180px] rounded-xl border-2 overflow-hidden
        cursor-pointer select-none transition-all duration-300
        ${
          isCompleted
            ? "bg-gray-50/80 border-gray-200"
            : `${colors.bg} ${colors.border} shadow-md hover:shadow-lg`
        }
      `}
    >
      {/* 완료 오버레이 */}
      {isCompleted && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      <div className="p-3 flex items-center gap-3">
        {/* 타입 배지 - 오른쪽 상단 */}
        <div className="absolute top-0 left-1.5 z-20">
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-md ${
              isCompleted ? "bg-gray-400 text-white" : colors.badge
            }`}
          >
            {label}
          </span>
        </div>

        {/* 왼쪽: 타입 이미지 */}
        <div className="flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center ${
              isCompleted ? "bg-gray-100" : "bg-white/80"
            } shadow-sm`}
          >
            <img
              src={image}
              alt={label}
              className={`w-14 h-14 object-contain ${isCompleted ? "opacity-50" : ""}`}
            />
          </div>
        </div>

        {/* 오른쪽: 시간 + 제목 + 설명 */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* 시간 */}
          <div className="flex items-center gap-1">
            <Clock
              className={`w-3 h-3 ${isCompleted ? "text-gray-400" : colors.text}`}
            />
            <span
              className={`text-xs font-bold ${isCompleted ? "text-gray-400" : colors.text}`}
            >
              {schedule.time.substring(0, 5)}
            </span>
          </div>

          {/* 제목 - 2줄까지 표시 */}
          <h3
            className={`font-bold text-sm line-clamp-2 ${
              isCompleted ? "text-gray-400 line-through" : "text-gray-800"
            }`}
          >
            {schedule.memo || "일정"}
          </h3>

          {/* 설명 */}
          {schedule.scheduleName && (
            <p
              className={`text-xs truncate ${
                isCompleted ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {schedule.scheduleName}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
