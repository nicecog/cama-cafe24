"use client";

import { Clock } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { cn } from "@/lib/utils";

interface TimePickerDrawerProps {
  value?: string; // "HH:mm" 또는 "HH:mm:ss" 형식
  onChange?: (time: string) => void;
}

function formatTimeWithSeconds(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

/** 배치 FCM 매칭용 HH:mm:ss (입력은 HH:mm / HH:mm:ss 모두 허용) */
export function normalizeScheduleTime(value: string | undefined): string {
  const { hour, minute } = parseTimeValue(value);
  return formatTimeWithSeconds(hour, minute);
}

function formatTimeDisplay(value: string | undefined): string {
  if (!value) return "";
  const { hour, minute } = parseTimeValue(value);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// 시간 문자열을 안전하게 파싱
function parseTimeValue(value: string | undefined): {
  hour: number;
  minute: number;
} {
  if (!value) {
    return { hour: 9, minute: 0 }; // 기본값
  }

  try {
    // "HH:mm" 또는 "HH:mm:ss" 형식 모두 처리
    const parts = value.split(":");
    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    // 유효성 검사
    if (
      !Number.isNaN(hour) &&
      !Number.isNaN(minute) &&
      hour >= 0 &&
      hour <= 23 &&
      minute >= 0 &&
      minute <= 59
    ) {
      return { hour, minute };
    }
  } catch {
    // 파싱 실패 시 기본값
  }

  return { hour: 9, minute: 0 };
}

export function TimePickerDrawer({ value, onChange }: TimePickerDrawerProps) {
  const parsedTime = parseTimeValue(value);
  const [open, setOpen] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState<number>(
    parsedTime.hour,
  );
  const [selectedMinute, setSelectedMinute] = React.useState<number>(
    parsedTime.minute,
  );
  const [displayValue, setDisplayValue] = React.useState(
    formatTimeDisplay(value),
  );

  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  // value prop이 변경되면 내부 상태 업데이트
  React.useEffect(() => {
    if (value) {
      const parsed = parseTimeValue(value);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setDisplayValue(formatTimeDisplay(value));
    }
  }, [value]);

  // 시간 선택 시 자동 스크롤
  React.useEffect(() => {
    if (open && hourRef.current) {
      const selectedElement = hourRef.current.querySelector(
        `[data-hour="${selectedHour}"]`,
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [open, selectedHour]);

  // 분 선택 시 자동 스크롤
  React.useEffect(() => {
    if (open && minuteRef.current) {
      const selectedElement = minuteRef.current.querySelector(
        `[data-minute="${selectedMinute}"]`,
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [open, selectedMinute]);

  const handleConfirm = () => {
    const timeString = formatTimeWithSeconds(selectedHour, selectedMinute);
    setDisplayValue(formatTimeDisplay(timeString));
    onChange?.(timeString);
    setOpen(false);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const openPicker = () => setOpen(true);

  const triggerClassName = cn(
    "relative flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors",
    "cursor-pointer touch-manipulation select-none [-webkit-tap-highlight-color:transparent]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm",
  );

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={openPicker}
        aria-label="시간 선택"
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            !displayValue && "text-muted-foreground",
          )}
        >
          {displayValue || "09:00"}
        </span>
        <Clock className="ml-2 size-3.5 shrink-0 text-muted-foreground" />
      </button>

      <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
        <DrawerContent className="h-auto">
          <DrawerHeader className="border-b border-gray-100 pb-3">
            <DrawerTitle className="text-center text-base font-semibold text-gray-800">
              시간 선택
            </DrawerTitle>
          </DrawerHeader>

          {/* Time Picker */}
          <div className="w-full p-6 bg-gradient-to-b from-blue-50/30 to-white">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-100">
                {/* 시 선택 */}
                <div className="relative">
                  <div className="sticky top-0 z-10 bg-gradient-to-b from-blue-50 to-blue-50/80 backdrop-blur-sm py-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-100">
                    시
                  </div>
                  <div
                    ref={hourRef}
                    className="h-64 overflow-y-auto scroll-smooth"
                  >
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        data-hour={hour}
                        onClick={() => setSelectedHour(hour)}
                        className={cn(
                          "w-full py-3 text-center transition-all duration-200",
                          selectedHour === hour
                            ? "bg-primary text-primary-foreground font-semibold text-lg"
                            : "hover:bg-gray-50 text-gray-600",
                        )}
                      >
                        {String(hour).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 분 선택 */}
                <div className="relative">
                  <div className="sticky top-0 z-10 bg-gradient-to-b from-blue-50 to-blue-50/80 backdrop-blur-sm py-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-100">
                    분
                  </div>
                  <div
                    ref={minuteRef}
                    className="h-64 overflow-y-auto scroll-smooth"
                  >
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        data-minute={minute}
                        onClick={() => setSelectedMinute(minute)}
                        className={cn(
                          "w-full py-3 text-center transition-all duration-200",
                          selectedMinute === minute
                            ? "bg-primary text-primary-foreground font-semibold text-lg"
                            : "hover:bg-gray-50 text-gray-600",
                        )}
                      >
                        {String(minute).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 확인 버튼 */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full h-11 font-semibold"
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
