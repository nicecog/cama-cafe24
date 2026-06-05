import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, Edit2, Trash2 } from "lucide-react";

interface SwipeableScheduleCardProps {
  schedule: {
    id: number;
    time: string;
    title: string;
    description?: string;
  };
  image: string;
  typeLabel: string;
  colorClass: string;
  isCompleted?: boolean;
  onComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SwipeableScheduleCard({
  schedule,
  image,
  typeLabel,
  colorClass,
  isCompleted = false,
  onComplete,
  onEdit,
  onDelete,
}: SwipeableScheduleCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();

  // 오른쪽으로 밀면(x > 0) 수정 버튼 노출
  const editOpacity = useTransform(x, [0, 40, 80], [0, 0.5, 1]);
  const editScale = useTransform(x, [0, 80], [0.8, 1]);

  // 왼쪽으로 밀면(x < 0) 삭제 버튼 노출
  const deleteOpacity = useTransform(x, [-80, -40, 0], [1, 0.5, 0]);
  const deleteScale = useTransform(x, [-80, 0], [1, 0.8]);

  // 카드 모서리 라운딩 동적 조절 (스와이프 시 버튼과 밀착되도록)
  const borderTopLeftRadius = useTransform(x, [0, 20], [12, 0]);
  const borderBottomLeftRadius = useTransform(x, [0, 20], [12, 0]);
  const borderTopRightRadius = useTransform(x, [-20, 0], [0, 12]);
  const borderBottomRightRadius = useTransform(x, [-20, 0], [0, 12]);

  const handleClick = () => {
    const currentX = x.get();

    // 카드가 밀려있는 상태라면 제자리로 복귀만 수행
    if (Math.abs(currentX) >= 5) {
      controls.start({ x: 0 });
      return; // 완료 기능은 실행하지 않음
    }

    // 카드가 제자리에 있을 때만 완료/미완료 토글
    // confirm 다이얼로그는 useScheduleData에서 처리
    onComplete(schedule.id);
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 40;
    if (info.offset.x > threshold) {
      // 오른쪽으로 밀기 스냅 (수정)
      controls.start({ x: 80 });
    } else if (info.offset.x < -threshold) {
      // 왼쪽으로 밀기 스냅 (삭제)
      controls.start({ x: -80 });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
      {/* 배경 수정 버튼 (왼쪽) */}
      <motion.div
        style={{ opacity: editOpacity }}
        className="absolute inset-y-0 left-0 flex items-stretch z-0"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(schedule.id);
            controls.start({ x: 0 });
          }}
          className="w-[80px] bg-sky-500 flex flex-col items-center justify-center text-white transition-colors active:bg-sky-600"
        >
          <motion.div
            style={{ scale: editScale }}
            className="flex flex-col items-center"
          >
            <Edit2 className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              수정
            </span>
          </motion.div>
        </button>
      </motion.div>

      {/* 배경 삭제 버튼 (오른쪽) */}
      <motion.div
        style={{ opacity: deleteOpacity }}
        className="absolute inset-y-0 right-0 flex items-stretch z-0"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(schedule.id);
            controls.start({ x: 0 });
          }}
          className="w-[80px] bg-rose-500 flex flex-col items-center justify-center text-white transition-colors active:bg-rose-600"
        >
          <motion.div
            style={{ scale: deleteScale }}
            className="flex flex-col items-center"
          >
            <Trash2 className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">
              삭제
            </span>
          </motion.div>
        </button>
      </motion.div>

      {/* 메인 카드 */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.1}
        animate={controls}
        style={{
          x,
          borderTopLeftRadius,
          borderBottomLeftRadius,
          borderTopRightRadius,
          borderBottomRightRadius,
        }}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className={`relative z-10 bg-white ${
          isCompleted
            ? "bg-gray-50/50"
            : "shadow-[-2px_0_10px_rgba(0,0,0,0.02),2px_0_10px_rgba(0,0,0,0.02)]"
        } cursor-pointer select-none border-x border-gray-100`}
        whileTap={isCompleted || Math.abs(x.get()) > 5 ? {} : { scale: 0.98 }}
      >
        <div className="flex items-center gap-4 p-2.5">
          {/* 타입 이미지 및 라벨 */}
          <div className="flex-shrink-0 flex flex-col items-center w-14">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
              <img
                src={image}
                alt={typeLabel}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* 수직 구분선 */}
          <div className="w-[1px] h-12 bg-gray-100 flex-shrink-0" />

          {/* 시간 및 내용 */}
          <div className="flex-1 min-w-0 relative">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${colorClass}`}
              >
                {typeLabel}
              </span>
              <span className="text-sm font-bold text-primary">
                {schedule.time}
              </span>
            </div>

            <div className="space-y-0.5">
              <h3
                className={`font-bold text-[15px] truncate ${
                  isCompleted ? "text-gray-400 line-through" : "text-gray-800"
                }`}
              >
                {schedule.title}
              </h3>
              {schedule.description && (
                <p
                  className={`text-[13px] truncate ${
                    isCompleted ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {schedule.description}
                </p>
              )}
            </div>

            {/* 완료 체크마크 배지 (이미 완료된 경우) */}
            {isCompleted && (
              <div className="absolute right-0 top-0">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
