import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day10Pic from "./Day10Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ExerciseResult from "../../component/Layout/ExerciseResult";

export default function Day10Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>근력 운동의 이점</InfomationTitle>
        <TextBox className="mt-10  text-justify">
          <div className="flex justify-center mb-10">
            <img
              src={Day10Pic}
              alt="Day10Pic"
              className="rounded-xl w-[180px] "
            />
          </div>
          근력 운동을 꾸준히 한다면 어떤 점이 좋을까요?
        </TextBox>

        <TextArea className="mt-5  text-justify">
          ✔ 근력 운동은 치료 과정에서 근육량 감소를 방지하거나 완화할 수 있고
          골밀도를 높여 골다공증의 위험을 줄일 수 있어요.
        </TextArea>
        <TextArea className="mt-10  text-justify">
          ✔ 근력 운동은 전반적인 체력과 에너지 수준을 높일 수 있으며 근육이
          비교적 많은 에너지를 소모하기 때문에, 체중 관리에도 도움이 돼요.
        </TextArea>
        <TextArea className="mt-10  text-justify">
          ✔ 근력 운동을 할 때는 조금씩 무게를 늘리며 운동을 하는 것이 좋아요.
        </TextArea>
        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
