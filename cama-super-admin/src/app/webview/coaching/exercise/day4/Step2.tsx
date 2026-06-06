import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

import ExerciseResult from "../../component/Layout/ExerciseResult";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import day4Pic from "./day4Pic.png";
export default function Day4Step2(props: any) {
  // Props;
  const { onNext, data, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          꾸준한 운동의 <br /> 이점
        </InfomationTitle>
        <TextBox className="my-5 text-justify">
          <div className="flex justify-center mb-10">
            <img src={day4Pic} alt=" " className="rounded-xl w-[200px]" />
          </div>
          매일 일정 시간 꾸준히 운동하면 이런 점이 좋아요.
          <p className="mt-4">
            ✔ 전반적인 체력이 향상되어 일상생활을 손쉽게 할 수 있어요.
          </p>
          <p className="mt-5">
            ✔ 면역 시스템을 강화하여 감염과 다른 건강 문제에 대한 저항력을 높일
            수 있어요.
          </p>
          <p className="mt-5">
            ✔ 암 치료로 인한 부작용(피로, 근육 손실 등)을 완화하고, 심폐 기능을
            개선할 수 있어요.
          </p>
        </TextBox>

        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
