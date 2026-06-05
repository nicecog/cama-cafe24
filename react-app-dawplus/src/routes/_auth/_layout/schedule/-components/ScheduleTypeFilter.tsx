import {
  Calendar as CalendarIcon,
  Hospital,
  MoreHorizontal,
  Pill,
} from "lucide-react";
import { Each } from "@/components/common/Each";

// 일정 타입 필터 옵션
const scheduleTypeOptions = [
  { key: "all", value: "전체", icon: CalendarIcon },
  { key: "MEDICINE", value: "복약", icon: Pill },
  { key: "HOSPITAL", value: "내원", icon: Hospital },
  { key: "ETC", value: "기타", icon: MoreHorizontal },
];

interface ScheduleTypeFilterProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

/**
 * 일정 타입 필터 버튼
 */
export function ScheduleTypeFilter({
  selectedType,
  onTypeChange,
}: ScheduleTypeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Each
        of={scheduleTypeOptions}
        keyItem="key"
        render={(option) => {
          const isSelected = selectedType === option.key;
          const Icon = option.icon;

          return (
            <button
              type="button"
              onClick={() => onTypeChange(option.key)}
              className={`
								flex-shrink-0 px-3 py-2 rounded-lg
								text-xs font-semibold 
								transition-all duration-200
								flex items-center gap-1.5
								${
                  isSelected
                    ? "bg-white text-primary shadow-lg scale-105"
                    : "bg-white/20 text-white/90 hover:bg-white/30 backdrop-blur-sm border border-white/20"
                }
							`}
            >
              <Icon className="w-3.5 h-3.5" />
              {option.value}
            </button>
          );
        }}
      />
    </div>
  );
}
