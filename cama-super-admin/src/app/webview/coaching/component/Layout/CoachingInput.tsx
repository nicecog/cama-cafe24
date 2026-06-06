import { ChangeEvent } from "react";

type CoachingInputType = {
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
};

export default function CoachingInput(props: CoachingInputType) {
  const {
    type = "text",
    value,
    onChange,
    placeholder = "내용을 입력해 보세요",
    name,
  } = props;

  return (
    <input
      type={type}
      className="w-full my-1 rounded-md py-3  text-center bg-white border-[#774F2D] border-2 text-camaColor1"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
