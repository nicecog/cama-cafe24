import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day15Pic from "./Day15Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import CheckText from "../../component/CheckText";

export default function Day15Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle className="tracking-tighter">
          운동을 지속하기 <br />
          위한 TIP
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <div className="flex justify-center mb-10">
            <img src={Day15Pic} alt="Day15Pic" className="rounded-xl " />
          </div>
          다음 팁을 활용하면 정말 움직이기 싫은 날에 조금이라도 운동이나 신체
          활동을 시작하는 데 도움이 될 수 있어요.
        </TextBox>

        <TextArea className="mt-5">
          <CheckText>좋아하는 활동하기</CheckText>
          <CheckText>
            일상에서 아주 쉬운 활동을 더 해보기
            <br />
            (예: 우편함 열어보기, 반려견 산책, 전화 받을 때 걷기)
          </CheckText>
          <CheckText>
            매일 운동 시간을 일정하게 하기
            <br />
            (매일의 반복적인 습관 만들기)
          </CheckText>
          <CheckText>운동 일기 쓰기</CheckText>
          <CheckText>친구나 가족과 함께 하기</CheckText>
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
