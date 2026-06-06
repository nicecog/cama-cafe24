import { ChangeEvent, ReactNode, useId } from "react";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";

type radioType = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  children: ReactNode;
  className?: string;
};

export default function Radio(props: radioType) {
  const { checked, onChange, className, name } = props;

  const id = useId();

  return (
    <>
      <div
        className={`text-md my-1  ${className}  bg-white   border-2 rounded-lg  border-[#e1e1e1]  
          ${checked ? "!border-[#FE8825] " : ""}
        `}
      >
        <label
          htmlFor={id}
          className={`font-bold w-full h-full  px-[12px] py-1 text-camaText flex justify-between gap-5 items-center  ${
            checked ? "!text-camaColor1" : ""
          }`}
        >
          {checked ? (
            <FaCircleCheck className="text-[20px] text-camaColor1" />
          ) : (
            <FaRegCircle className="text-[20px] text-[#cfcfcf] font-thin" />
          )}
          <div className="w-[90%] ">{props.children}</div>
          <input
            type="radio"
            name={name}
            id={id}
            className={`w-5 min-w-5 hidden`}
            onChange={onChange}
          />
        </label>
      </div>
    </>
  );
}
