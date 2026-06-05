import type { DayPickerProps } from "react-day-picker";
import { Calendar as BaseCalendar } from "@/components/ui/Calendar";
import { cn } from "@/lib/utils";

interface ScheduleCalendarProps
  extends Omit<
    DayPickerProps,
    "modifiers" | "modifiersClassNames" | "mode" | "required" | "onSelect"
  > {
  /** 일정이 있는 날짜 목록 (YYYY-MM-DD 형식) */
  scheduleDates?: string[];
  /** 선택 모드 */
  mode?: "single";
  /** 선택된 날짜 (single 모드) */
  selected?: Date;
  /** 날짜 선택 핸들러 (single 모드) */
  onSelect?: (date: Date | undefined) => void;
  /** 표시 중인 월 */
  month?: Date;
  /** 월 변경 핸들러 */
  onMonthChange?: (month: Date) => void;
}

/**
 * 일정관리 전용 커스텀 캘린더 컴포넌트
 * - 오늘 날짜: 연한 파란색 배경
 * - 선택된 날짜: Primary 색상 배경
 * - 일정이 있는 날짜: 날짜 아래 작은 점 표시
 */
export function ScheduleCalendar({
  scheduleDates = [],
  mode,
  selected,
  onSelect,
  month,
  onMonthChange,
  ...props
}: ScheduleCalendarProps) {
  // 날짜가 일정이 있는지 확인하는 함수
  const hasSchedule = (date: Date): boolean => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return scheduleDates.includes(dateStr);
  };

  return (
    <BaseCalendar
      {...({
        mode,
        selected,
        onSelect,
        month,
        onMonthChange,
        ...props,
        className: cn(
          "border rounded-md [--cell-size:12vw] md:[--cell-size:9vw]",
          props.className,
        ),
        classNames: {
          // 오늘 날짜 스타일 - 연한 파란색 배경
          today: cn(
            "bg-blue-50 text-blue-900 font-semibold",
            "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
          ),
          // 날짜 셀 스타일 - 일정 표시를 위한 공간 확보
          day: cn(
            "group/day relative aspect-square h-full w-full select-none p-0 text-center",
            "[&:first-child[data-selected=true]_button]:rounded-l-md",
            "[&:last-child[data-selected=true]_button]:rounded-r-md",
          ),
          ...props.classNames,
        },
        modifiers: {
          hasSchedule: (date: Date) => hasSchedule(date),
        },
        modifiersClassNames: {
          hasSchedule:
            "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
        },
        buttonVariant: "ghost",
      } as any)}
    />
  );
}
