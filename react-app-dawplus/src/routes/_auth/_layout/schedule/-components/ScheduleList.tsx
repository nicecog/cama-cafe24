import {
  Calendar as CalendarIcon,
  Hospital,
  MoreHorizontal,
  Pill,
} from "lucide-react";
import type { WebviewSchedule } from "@/apis/types";
import Image1 from "@/assets/images/character/char1.png"; // 내원
import Image3 from "@/assets/images/character/char3.png"; // 복약
import Image4 from "@/assets/images/character/hello/helloType3.png"; // 기타
import { Each } from "@/components/common/Each";
import { SwipeableScheduleCard } from "./SwipeableScheduleCard";

// 일정 타입 필터 옵션
const scheduleTypeOptions = [
  { key: "all", value: "전체", icon: CalendarIcon },
  { key: "MEDICINE", value: "복약", icon: Pill },
  { key: "HOSPITAL", value: "내원", icon: Hospital },
  { key: "ETC", value: "기타", icon: MoreHorizontal },
];

interface ScheduleListProps {
  selectedDate?: Date;
  schedules: WebviewSchedule[];
  onComplete: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

/**
 * 일정 리스트 컴포넌트
 * - 선택된 날짜 표시
 * - 일정 카드 리스트
 */
export function ScheduleList({
  selectedDate,
  schedules,
  onComplete,
  onEdit,
  onDelete,
}: ScheduleListProps) {
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
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "HOSPITAL": // 내원
        return "bg-green-100 text-green-600 border-green-200";
      case "ETC": // 기타
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // 타입별 라벨 가져오기
  const getTypeLabel = (type: string) => {
    const option = scheduleTypeOptions.find((opt) => opt.key === type);
    return option?.value || "기타";
  };

  return (
    <div className="bg-white pt-4 pb-20 px-4">
      {/* 선택된 날짜 표시 */}
      {selectedDate && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월{" "}
            {selectedDate.getDate()}일
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            일정
            <span className="text-primary font-semibold ml-1">
              {schedules.length}
            </span>
            건
          </p>
        </div>
      )}

      {/* 일정 카드 리스트 */}
      <div className="space-y-3">
        <Each
          of={schedules}
          keyItem="scheduleSeq"
          render={(schedule) => {
            const image = getTypeImage(schedule.scheduleType);
            const label = getTypeLabel(schedule.scheduleType);
            const colorClass = getTypeColor(schedule.scheduleType);

            return (
              <SwipeableScheduleCard
                schedule={{
                  id: schedule.scheduleSeq,
                  title: schedule.memo || "일정",
                  time: schedule.time.substring(0, 5), // "08:00:00" -> "08:00"
                  description: schedule.scheduleName,
                }}
                image={image}
                typeLabel={label}
                colorClass={colorClass}
                isCompleted={schedule.done}
                onComplete={onComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          }}
          noData={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CalendarIcon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                등록된 일정이 없습니다
              </h3>
              <p className="text-gray-500 text-sm">
                선택한 날짜에 일정을 추가해보세요
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}
