"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

type DateFormat = "yyyy년 MM월 dd일" | "yyyy.MM.dd" | "yyyy-MM-dd";

interface DatePickerProps {
  readOnly?: boolean;
  format?: DateFormat;
}

function formatDate(
  date: Date | undefined,
  format: DateFormat = "yyyy년 MM월 dd일",
) {
  if (!date) {
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
    default:
      return "2026년 01월 14일";
  }
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !Number.isNaN(date.getTime());
}

export function DatePicker({
  readOnly = false,
  format = "yyyy년 MM월 dd일",
}: DatePickerProps = {}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date, format));

  // format이 변경되면 value 업데이트
  React.useEffect(() => {
    setValue(formatDate(date, format));
  }, [format, date]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          value={value}
          placeholder={getPlaceholder(format)}
          className="bg-background pr-10 cursor-pointer"
          readOnly={readOnly}
          onChange={(e) => {
            if (readOnly) return;
            const date = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(date)) {
              setDate(date);
              setMonth(date);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          onClick={() => {
            if (readOnly) {
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">날짜 선택</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date, format));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
