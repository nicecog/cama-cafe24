import { RadioGroup } from "@headlessui/react";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";

export default function CheckAnswer(props: any) {
  const { value, onChange, index } = props;

  const onChangeHandler = (checked: boolean) => {
    onChange(index, checked);
  };

  return (
    <>
      <RadioGroup
        value={value}
        onChange={onChangeHandler}
        className={"flex gap-3 text-camaColor justify-end"}
      >
        <RadioGroup.Option value={true} className={""}>
          {({ checked }) => (
            <div
              className={`border  px-2 py-1 rounded-md w-[100px] text-center text-[16px] flex items-center justify-center gap-2 ${
                checked
                  ? "text-camaColor1 border-camaColor1"
                  : "border-camaColor"
              }`}
            >
              예
              {checked ? (
                <FaCircleCheck className="text-[16px]  mt-0.5" />
              ) : (
                <FaRegCircle className="text-[16px]    mt-0.5" />
              )}
            </div>
          )}
        </RadioGroup.Option>

        <RadioGroup.Option value={false} className={""}>
          {({ checked }) => (
            <div
              className={`border  px-2 py-1 rounded-md w-[100px] text-center text-[16px] flex items-center justify-center gap-2 ${
                checked
                  ? "text-camaColor1 border-camaColor1"
                  : "border-camaColor"
              }`}
            >
              아니오
              {checked ? (
                <FaCircleCheck className="text-[16px]  mt-0.5" />
              ) : (
                <FaRegCircle className="text-[16px]    mt-0.5" />
              )}
            </div>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </>
  );
}
