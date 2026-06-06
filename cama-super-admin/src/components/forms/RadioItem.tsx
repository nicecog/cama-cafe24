import { useId } from "react";

export default function RadioItem(props: any) {
  // UUID
  const id = useId();
  // Props
  const {
    checked,
    name,
    onChange,
    label,
    readOnly = false,
    value,
    className,
  } = props;
  return (
    <>
      <div className={`flex items-center ${className}`}>
        <input
          id={id}
          type="radio"
          value={value}
          name={name}
          checked={checked}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300  cursor-pointer "
          onChange={onChange}
          readOnly={readOnly}
        />
        {label ? (
          <label
            htmlFor={id}
            className="ms-2 text-xs font-medium text-gray-900  cursor-pointer "
          >
            {label}
          </label>
        ) : null}
      </div>
    </>
  );
}
