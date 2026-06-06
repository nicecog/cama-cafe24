import { cn } from "@/utils/utils";
import { DateRangePickerType } from "./DataEntryTypes";
import DatePicker from "./DatePicker";
import { useMemo } from "react";
import dayjs from "dayjs";

export default function DateRangePicker(props: DateRangePickerType) {
  const {
    stDt,
    edDt,
    onChange,
    className,
    stDtName = "stDt",
    edDtName = "edDt",
    showMonthYearPicker,
  } = props;

  const minDate = useMemo(() => dayjs(stDt).toDate(), [stDt]);
  const maxDate = useMemo(() => dayjs(stDt).add(1, "year").toDate(), [stDt]); // stDt 이후 1년 계산
  const onChangeStDate = (_: string, value: any) => {
    if (dayjs(value).isAfter(edDt)) {
      onChange?.(stDtName, value);
      onChange?.(edDtName, ""); // edDt 초기화
    } else {
      onChange?.(stDtName, value);
    }
  };

  const onChangeEdDate = (_: string, value: any) => {
    if (dayjs(value).isBefore(stDt)) {
      return; // 잘못된 선택 무시
    }
    onChange?.(edDtName, value);
  };

  return (
    <div className={cn("flex items-center w-full ", className)}>
      <DatePicker
        value={stDt}
        name={stDtName}
        format="YYYY-MM"
        onChange={onChangeStDate}
        showMonthYearPicker={showMonthYearPicker}
      />
      <span className="mx-2"> ~ </span>
      <DatePicker
        value={edDt}
        name={edDtName}
        format="YYYY-MM"
        onChange={onChangeEdDate}
        showMonthYearPicker={showMonthYearPicker}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );
}
