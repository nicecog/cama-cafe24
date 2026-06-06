import SelectBox from "@/app/webview/coaching/component/Layout/SelectBox";
import { FaSun, FaMoon } from "react-icons/fa";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import { ChangeEvent } from "react";

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${String(i).padStart(2, "0")}시`,
  value: String(i).padStart(2, "0"),
}));

const minutes = Array.from({ length: 6 }, (_, j) => ({
  label: `${String(j * 10).padStart(2, "0")}분`,
  value: String(j * 10).padStart(2, "0"),
}));
export default function SleepWakeupCheck(props: any) {
  const { onChange, data, className = "" } = props;

  const hourOptions = [{ label: "선택", value: "" }, ...hours];
  const minutesOptions = [{ label: "선택", value: "" }, ...minutes];

  const onChangeSleepHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const _sleepData = {
      ...data.sleep,
      [e.target.name]: e.target.value,
    };
    onChange("sleep", _sleepData);
  };
  const onChangeWakeupHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    const _wakeupData = {
      ...data.wakeup,
      [e.target.name]: e.target.value,
    };
    onChange("wakeup", _wakeupData);
  };

  return (
    <>
      <div className={className}>
        <TextArea className="">
          <TextAreaTitle className="font-normal">목표 취침시간</TextAreaTitle>
          <div className="flex items-center gap-2 mt-2">
            <div>
              <FaMoon className="ml-2 text-gray-500 text-[18px]" />
            </div>
            <SelectBox
              onChange={onChangeSleepHandler}
              name="hour"
              value={data.sleep.hour}
              options={hourOptions}
              className="rounded-lg border-camaColor"
            />
            <SelectBox
              onChange={onChangeSleepHandler}
              name="minutes"
              value={data.sleep.minutes}
              options={minutesOptions}
              className="rounded-lg border-camaColor"
            />
          </div>
        </TextArea>
        <TextArea className="mt-5">
          <TextAreaTitle className="font-normal">목표 기상시간</TextAreaTitle>
          <div className="flex items-center gap-3 mt-2">
            <div>
              <FaSun className="ml-2 text-camaColorLight text-[18px]" />
            </div>

            <SelectBox
              onChange={onChangeWakeupHandler}
              name="hour"
              value={data.wakeup.hour}
              options={hourOptions}
              className="rounded-lg border-camaColor"
            />
            <SelectBox
              onChange={onChangeWakeupHandler}
              name="minutes"
              value={data.wakeup.minutes}
              options={minutesOptions}
              className="rounded-lg border-camaColor"
            />
          </div>
        </TextArea>
      </div>
    </>
  );
}
