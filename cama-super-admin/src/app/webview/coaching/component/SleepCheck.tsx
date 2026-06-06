import Hours from "@/app/webview/coaching/component/Layout/Hours";
import { ChangeEvent } from "react";
import TextArea from "./Layout/TextArea";
import { FcExpired } from "react-icons/fc";
const descriptions = [
  { label: "0", key: 0 },
  { label: "1", key: 1 },
  { label: "2", key: 2 },
  { label: "3", key: 3 },
  { label: "4", key: 4 },
  { label: "5", key: 5 },
  { label: "6", key: 6 },
  { label: "7", key: 7 },
  { label: "8", key: 8 },
  { label: "9", key: 9 },
  { label: "10", key: 10 },
];
export default function SleepCheck(props: {
  data: { sleep: string; rating: string };
  onChange: (e: any) => void;
  className?: string;
}) {
  const { data, onChange, className } = props;

  const onChangeHandler = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="mt-5">
        <TextArea
          className={`${className} mt-5 bg-white border border-camaColor rounded-md py-5 px-2.5`}
        >
          <h2 className="text-camaColor1 font-oneMobile text-[30px] my-4  flex gap-1 items-center justify-center">
            <div>
              <FcExpired />
            </div>
            잠깐!
          </h2>
          <div className="">
            <p className="text-camaColor font-bold mb-1 text-center">
              어제 몇 시간 정도 주무셨나요?
            </p>
            <Hours onChange={onChangeHandler} value={data.sleep} />

            <p className="text-camaColor font-bold  mt-5 text-center">
              어제 수면의 질은 어땠나요?
            </p>
            <div className="w-full">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={data.rating}
                className="w-full"
                name="rating"
                onChange={onChangeHandler}
              />
              <div className="flex justify-between mt-1 text-center text-f2 leading-4">
                {descriptions.map((desc) => (
                  <div
                    key={desc.key}
                    className={`text-[13px] ${
                      Number(data.rating) === desc.key
                        ? "font-bold text-camaColor1"
                        : "text-gray-600"
                    }`}
                  >
                    {desc.label.split("\n").map((line, index) => (
                      <span key={index}>{line}</span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-sm text-center mt-3 flex justify-between bg-camaColor1 bg-opacity-10 px-1 font-bold rounded-md ">
                <div>
                  <p>0점</p>
                  <p className="my-[-14px]">매우</p>
                  <p>불만족</p>
                </div>
                <div className="pr-3">
                  <p>5점</p>
                  <p className="my-[-14px]">보통</p>
                </div>
                <div>
                  <p>10점</p>
                  <p className="my-[-14px]">매우</p>
                  <p>만족</p>
                </div>
              </div>
            </div>
          </div>
        </TextArea>
      </div>
    </>
  );
}
