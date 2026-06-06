import { useId } from "react";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";

export default function Answer(props: any) {
  const {
    checked,
    onChange,
    useUnique = false,
    className,
    readOnly = false,
  } = props;

  const id = useId();

  return (
    <>
      <div
        className={`text-md  my-2   bg-white  border-2 rounded-lg     ${className}
          ${checked ? "!border-[#FE8825] " : ""}
        `}
      >
        <label
          htmlFor={id}
          className={`font-bold w-full h-full  px-[16px] py-[8px] text-camaText flex justify-between items-center  ${
            checked ? "!text-camaColor1" : ""
          }`}
        >
          <div className="w-[90%]">{props.children}</div>
          {checked ? (
            <FaCircleCheck className="text-[20px] " />
          ) : (
            <FaRegCircle className="text-[20px] text-[#cfcfcf] font-thin" />
          )}

          <input
            type="radio"
            name={useUnique ? id : "radio"}
            checked={checked}
            id={id}
            className={`w-5 min-w-5 hidden`}
            onClick={onChange}
            readOnly={readOnly}
          />
        </label>
      </div>
    </>
  );
}
