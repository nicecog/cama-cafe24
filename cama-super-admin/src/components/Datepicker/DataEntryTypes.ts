// DatePicker
export type DatePickerType = {
  name?: string;
  value?: string | null;
  format?: string;
  onChange?: (name: string, value: any) => void;
  className?: string;
  readOnly?: boolean;
  disabled?: boolean;
  showMonthYearPicker?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

// DateRange Picker
export type DateRangePickerType = {
  stDt: string;
  edDt: string;
  stDtName?: string;
  edDtName?: string;
  showMonthYearPicker?: boolean;
  onChange?: (name: string, value: any) => void;
  className?: string;
};
