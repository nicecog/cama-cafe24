import ReactDatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/utils/utils";
import { AiOutlineCalendar } from "react-icons/ai";
import { DatePickerType } from "./DataEntryTypes";
import dayjs from "dayjs";
import { forwardRef } from "react";
// Custom Input with ref
const CustomInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, className, onChange, disabled }, ref) => (
    <div className={cn("relative w-full text-[#878790] h-9", className)}>
      <motion.button
        className="absolute top-2 left-3 cursor-pointer "
        whileTap={{ scale: 1.2 }}
        onClick={onClick}
      >
        <AiOutlineCalendar className="text-[17px]" />
      </motion.button>
      <input
        type="text"
        value={value}
        onClick={onClick}
        className={cn(
          "h-full w-full px-9 py-1.5 rounded-lg cursor-pointer min-w-[160px] outline-none",

          disabled ? "bg-gray-200" : ""
        )}
        ref={ref}
        onChange={onChange}
        readOnly={true}
      />
      {/* {!(readOnly || disabled) && (
        <motion.button
          className="absolute top-2 right-2 cursor-pointer text-[18px]"
          whileTap={{ scale: 1.2 }}
          onClick={() => {
            onChange?.("");
          }}
        >
          <MdOutlineClear />
        </motion.button>
      )} */}
    </div>
  )
);

CustomInput.displayName = "CustomInput";

//  Header 부분 수정
// const CustomHeader = ({
//   date,
//   changeYear,
//   changeMonth,
//   decreaseMonth,
//   increaseMonth,
//   prevMonthButtonDisabled,
//   nextMonthButtonDisabled,
// }: any) => {
//   const valueDate = dayjs(date);

//   const today = dayjs();
//   const years = today.subtract(10, "year");

//   const year = valueDate.year();
//   const month = valueDate.month();

//   return (
//     <div
//       style={{
//         margin: 10,
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <button
//         onClick={decreaseMonth}
//         disabled={prevMonthButtonDisabled}
//         className="  font-bold"
//       >
//         <FaChevronLeft />
//       </button>
//       <div className="mx-5 flex gap-1">
//         <select
//           value={year}
//           className="px-1 py-0.5 border border-slate-600 rounded-md cursor-pointer"
//           onChange={({ target: { value } }) => {
//             changeYear(value);
//           }}
//         >
//           {Array.from({ length: 10 }, (_, index) => {
//             const value = years.add(index + 1, "year").format("YYYY");
//             return (
//               <option key={index} value={value}>
//                 {value}
//               </option>
//             );
//           })}
//         </select>
//         {/* month */}
//         <select
//           value={month}
//           className="px-1 py-0.5 border border-slate-600 rounded-md cursor-pointer"
//           onChange={({ target: { value } }) => {
//             changeMonth(value);
//           }}
//         >
//           {Array.from({ length: 12 }, (_, index) => {
//             return (
//               <option key={index} value={index}>
//                 {`${index + 1}월`}
//               </option>
//             );
//           })}
//         </select>
//       </div>

//       <button
//         onClick={increaseMonth}
//         disabled={nextMonthButtonDisabled}
//         className="font-bold"
//       >
//         <FaChevronRight />
//       </button>
//     </div>
//   );
// };

// DatePicker
export default function DatePicker(props: DatePickerType) {
  // Props
  const {
    value,
    onChange,
    className,
    format = "YYYY.MM.DD",
    name,
    readOnly,
    disabled,
    minDate,
    maxDate,
    showMonthYearPicker,
  } = props;

  const selectedDate =
    value && dayjs(value, format).isValid()
      ? dayjs(value, format).toDate()
      : undefined;

  // Convert dayjs format to match react-datepicker format
  const datePickerFormat = format
    .replace("YYYY", "yyyy")
    .replace("DD", "dd")
    .replace("MM", "MM");

  const onChangeHandler = (date: Date | null) => {
    onChange && onChange(name || "", date ? dayjs(date).format(format) : "");
  };

  const renderMonthContent = (_: any, shortMonth: any) => {
    return <div className="py-2">{shortMonth}</div>;
  };

  // Render
  return (
    <ReactDatePicker
      customInput={<CustomInput />}
      // renderCustomHeader={CustomHeader}
      locale={ko}
      selected={selectedDate}
      dateFormat={datePickerFormat}
      onChange={onChangeHandler}
      calendarClassName="w-full"
      minDate={minDate}
      maxDate={maxDate}
      showMonthYearPicker={showMonthYearPicker}
      renderMonthContent={renderMonthContent}
      // highlightDates={highlightWeekends}
      disabled={disabled}
      readOnly={readOnly}
      className={cn(
        "bg-white w-full border border-gray-300 rounded-lg focus:outline-0 z-1",
        "focus-within:border-[1px] focus-within:border-[#4d5159] focus-within:shadow-[ -1px -1px 4px rgba(77, 81, 89, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.1)]",
        className
      )}
    />
  );
}
794001;
