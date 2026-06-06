import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import React from "react";
import useFontSize from "@/hooks/useFontSize";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import ExcerciseCompleteButton from "../../component/Layout/ExcerciseCompleteButton";
import TextArea from "../../component/Layout/TextArea";
const answerList = [
  "맞춤형 운동",
  "운동계획 공유",
  "운동 일정 관리",
  "다른 사람들과 함께 운동하기",
  "심리상담",
];

export default function Day7Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  //  답 선택
  const onClick = (value: string) => () => {
    onChange(
      data.includes(value)
        ? data.filter((item: string) => item !== value)
        : data.concat(value)
    );
  };
  const [sm] = useFontSize([-2]);
  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "내가 운동을 계속 하는데 도움이 <br />될 수 있는 요인 찾아보기"
        </MissionTitle>
        <TextArea className="mt-10 text-center">
          다음 중 꾸준한 운동을 위해 실천해 볼수있는 (도움이 될 수 있는) 요인을
          한 가지 이상 찾아보세요.
        </TextArea>
        <TextArea className="mb-10 text-center">
          {answerList.map((i: any, idx: number) => (
            <React.Fragment key={idx}>
              <div
                className={`text-md flex my-3 border-2 px-2.5 py-1 rounded-xl bg-white accent-camaColor1  ${
                  data.includes(i) && "border border-camaColor1"
                }`}
              >
                <input
                  type="checkbox"
                  name={`check_${idx}`}
                  checked={data.includes(i)}
                  id={`id_${idx}`}
                  className={`w-3.5 min-w-3.5 mr-1`}
                  onChange={onClick(i)}
                />
                <label
                  style={{ fontSize: sm }}
                  htmlFor={`id_${idx}`}
                  className={`ml-2  w-full text-left ${
                    data.includes(i) ? "font-semibold text-camaColor1" : ""
                  }`}
                >
                  {i}
                </label>
              </div>
            </React.Fragment>
          ))}
        </TextArea>
        <ExcerciseCompleteButton condition={data.length > 0} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
