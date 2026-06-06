import { ChangeEvent, HTMLInputTypeAttribute, KeyboardEvent } from "react";

/** Type  : inputType  */
export type InputType = {
  name?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

const Input = (props: InputType) => {
  const {
    name,
    value,
    type = "text",
    className,
    placeholder,
    onChange,
    onKeyDown,
    readOnly = false,
  } = props;

  return (
    <>
      <input
        type={type}
        id={name}
        value={value !== undefined ? value : ""}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`block p-1 text-gray-900 border border-gray-300 rounded-sm bg-white sm:text-xs focus:outline-none ${className}`}
      />
    </>
  );
};
export default Input;
