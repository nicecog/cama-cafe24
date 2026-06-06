import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day8Pic from "./Day8Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "../../component/Layout/Titles/TextAreaTitle";
import ExerciseResult from "../../component/Layout/ExerciseResult";
export default function Day8Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle>
          운동이 부족하면 <br />
          생기는 문제 3
        </InfomationTitle>
        <TextBox className="mt-10  text-justify">
          <div className="flex justify-center mb-10">
            <img
              src={Day8Pic}
              alt="Day8Pic"
              className="rounded-xl w-[180px] "
            />
          </div>
          운동이 부족하면 생기는 문제에 대해 좀더 알아볼게요.
        </TextBox>

        <TextArea className="mt-5  text-justify">
          <TextAreaTitle>✔ 정서적 문제</TextAreaTitle>
          운동이 부족하면, 이미 겪고 있는 심리적 스트레스가 심해질 수 있어요.
          신체 활동과 꾸준한 운동은 스트레스, 불안, 우울증 등의 정서적 문제를
          완화하는 데 도움이 돼요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          <TextAreaTitle>✔ 다른 건강 문제 악화</TextAreaTitle>
          운동 부족은 체중 증가, 고혈압, 당뇨 등 다른 건강 문제의 위험을 높일 수
          있어요. 암 치료를 받는 동안에도 건강 관리가 필요하며, 운동 부족은 그런
          관리를 더 어렵게 만들어요.
        </TextArea>
        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
