import {
  Calendar as CalendarIcon,
  Hospital,
  MoreHorizontal,
  Pill,
} from "lucide-react";
import ScheduleCharacter from "@/assets/images/character/char3.png";
import { Each } from "@/components/common/Each";

// 일정 타입 필터 옵션
const scheduleTypeOptions = [
  { key: "all", value: "전체", icon: CalendarIcon },
  { key: "MEDICINE", value: "복약", icon: Pill },
  { key: "HOSPITAL", value: "내원", icon: Hospital },
  { key: "ETC", value: "기타", icon: MoreHorizontal },
];

interface ScheduleHeaderProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

/**
 * 일정 관리 페이지 헤더
 * - 타이틀
 * - 타입 필터 버튼
 */
export function ScheduleHeader({
  selectedType,
  onTypeChange,
}: ScheduleHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-primary via-primary to-primary/90 shadow-md flex-shrink-0">
      <div className="px-6 pt-16 pb-4">
        {/* 타이틀 영역 */}
        <div className="flex items-center justify-between mb-4">
          {/* 타이틀 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-jalnan text-white drop-shadow-md ">
                일정관리
              </h1>
              <p className="text-sm-fixed text-white/80 mt-0.5">
                나의 건강 일정을 관리하세요
              </p>
            </div>
          </div>
          <img
            src={ScheduleCharacter}
            alt="Schedule Character"
            className="w-20 h-20 object-contain relative z-10 drop-shadow-lg"
          />
        </div>

        {/* 필터 섹션 */}
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
      </div>
    </div>
  );
}
