import { ChangeEvent, memo, useId } from "react";

// CheckBox Type
export type CheckBox = {
  checked: boolean;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  labelValue?: boolean;
  value?: any;
  className?: string;
};

// 체크 박스
const CheckBox = (props: CheckBox) => {
  // Props
  const { label, checked, name, onChange, value, labelValue = false } = props;
  // ID Generator
  const id = useId();
  // Render
  return (
    <>
      <div className="flex items-center justify-start">
        <input
          checked={checked}
          name={name}
          id={id}
          value={value ? value : labelValue ? label : ""}
          type="checkbox"
          className={`w-4 h-4 border border-gray-300 rounded bg-white focus:ring-0 focus:ring-blue-300`}
          onChange={onChange}
        />
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-bold ml-2  text-gray-700 whitespace-nowrap w-full"
          >
            {label}
          </label>
        )}
      </div>
    </>
  );
};
export default memo(CheckBox);
