import { ChangeEvent, useId } from "react";

export default function Checkbox(props: any) {
  // props
  const { label, checked, onChange, value } = props;

  const id = useId();

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(value, e.target.checked);
  };

  // render
  return (
    <>
      <div className="flex items-center me-4">
        <input
          id={id}
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  cursor-pointer"
          checked={checked}
          value={value}
          onChange={onChangeHandler}
        />
        <label
          htmlFor={id}
          className="ms-2 text-xs  text-gray-900  cursor-pointer"
        >
          {label}
        </label>
      </div>
    </>
  );
}
