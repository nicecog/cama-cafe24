"use client";

import { isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Calendar } from "@/components/ui/Calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { cn } from "@/lib/utils";

type DateFormat = "yyyy년 MM월 dd일" | "yyyy.MM.dd" | "yyyy-MM-dd";

interface DatePickerDrawerProps {
  format?: DateFormat;
  value?: string | Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
  disabled?:
    | (Omit<
        React.ComponentProps<typeof Calendar>["disabled"],
        "before" | "after"
      > & {
        before?: Date | string;
        after?: Date | string;
      })
    | (Date | string)[]
    | (Date | string);
}

// string을 Date로 안전하게 변환
function ensureDate(value: string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  try {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function parseValue(value: string | Date | undefined): Date | undefined {
  return ensureDate(value);
}

function formatDate(
  date: Date | undefined,
  format: DateFormat = "yyyy년 MM월 dd일",
) {
  if (!date || !isValid(date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "yyyy.MM.dd":
      return `${year}.${month}.${day}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    // case "yyyy년 MM월 dd일":
    default:
      return `${year}년 ${month}월 ${day}일`;
  }
}

function getPlaceholder(format: DateFormat) {
  switch (format) {
    case "yyyy.MM.dd":
      return "2026.01.14";
    case "yyyy-MM-dd":
      return "2026-01-14";
    // case "yyyy년 MM월 dd일":
    default:
      return "2026년 01월 14일";
  }
}

export function DatePickerDrawer({
  format = "yyyy.MM.dd",
  value,
  onChange,
  disabled: disabledProp,
  className,
}: DatePickerDrawerProps) {
  // disabled prop 내부의 string 날짜들을 Date 객체로 변환
  const disabled = React.useMemo(() => {
    if (!disabledProp) return undefined;

    // 단일 값인 경우
    if (typeof disabledProp === "string" || disabledProp instanceof Date) {
      return ensureDate(disabledProp);
    }

    // 배열인 경우
    if (Array.isArray(disabledProp)) {
      return disabledProp
        .map((item) =>
          typeof item === "string" || item instanceof Date
            ? ensureDate(item)
            : item,
        )
        .filter(Boolean);
    }

    // 객체(Matcher)인 경우 (before, after 등)
    if (typeof disabledProp === "object") {
      const newDisabled: any = { ...disabledProp };
      if ("before" in newDisabled && newDisabled.before) {
        newDisabled.before = ensureDate(newDisabled.before);
      }
      if ("after" in newDisabled && newDisabled.after) {
        newDisabled.after = ensureDate(newDisabled.after);
      }
      return newDisabled;
    }

    return disabledProp;
  }, [disabledProp]);

  const parsedValue = parseValue(value);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(parsedValue);
  const [month, setMonth] = React.useState<Date | undefined>(
    parsedValue || new Date(),
  );
  const [displayValue, setDisplayValue] = React.useState(
    formatDate(parsedValue, format),
  );

  // value prop이 변경되면 내부 상태 업데이트
  React.useEffect(() => {
    const parsed = parseValue(value);
    setDate(parsed);
    setMonth(parsed || new Date());
    setDisplayValue(formatDate(parsed, format));
  }, [value, format]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setDisplayValue(formatDate(selectedDate, format));
    onChange?.(selectedDate);
    // 선택 즉시 닫기
    setTimeout(() => setOpen(false), 200);
  };

  const openPicker = () => setOpen(true);

  const triggerClassName = cn(
    "relative flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors",
    "cursor-pointer touch-manipulation select-none [-webkit-tap-highlight-color:transparent]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm",
    className,
  );

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={openPicker}
        aria-label="날짜 선택"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            !displayValue && "text-muted-foreground",
          )}
        >
          {displayValue || getPlaceholder(format)}
        </span>
        <CalendarIcon className="ml-2 size-3.5 shrink-0 text-muted-foreground" />
      </button>

      {/* Popup(z-201) 위에 표시; iOS WebView 중첩 모달 시 배경 스케일 비활성화 */}
      <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        <DrawerContent className="h-auto">
          <DrawerHeader className="border-b border-gray-100 pb-3">
            <DrawerTitle className="text-center text-base font-semibold text-gray-800">
              날짜 선택
            </DrawerTitle>
          </DrawerHeader>

          {/* Calendar - 전체 너비 사용 */}
          <div className="w-full p-4 bg-gradient-to-b from-blue-50/30 to-white touch-none">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
              disabled={disabled}
              className="w-full max-w-none bg-white rounded-lg shadow-sm border border-gray-100 [--cell-size:3rem] select-none"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
