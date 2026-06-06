import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day7Pic from "./day7Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
export default function Day7Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle className=" ">
          꾸준한 운동 습관을 <br /> 위한 TIP
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <div className="flex justify-center mb-10">
            <img
              src={Day7Pic}
              alt="Day7Pic"
              className="rounded-xl w-[180px] "
            />
          </div>
          꾸준한 운동 습관을 기를 수 있는 몇 가지 팁을 소개해 드릴게요. <br />{" "}
          <br />
          다음의 내용을 참고해 보세요!
        </TextBox>

        <TextArea className="mt-10  text-justify">
          1) 나의 치료 상황과 운동 능력에 맞춰 적절한 운동을 하는 것이 좋아요.
        </TextArea>

        <TextArea className="mt-5  text-justify">
          2) 가족이나 친구, 의료진 등 주변 사람들에게 자신의 운동 계획을 알리고
          응원을 받으세요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          3) 운동을 할 때는 구체적인 목표를 세우고 그에 따른 계획을 세우는 것이
          좋아요. 이를 위해 스마트폰 애플리케이션이나 다이어리를 사용하는 것도
          좋은 방법이에요.
        </TextArea>
        <TextArea className="mt-5  text-justify">
          4) 운동을 같이 할 수 있는 모임이나 동호회 같은 곳에 가입해보세요. 서로
          도움도 주고받을 수 있고 외롭지 않게 꾸준하게 운동을 할 수 있어요.
        </TextArea>
        <TextArea className="mt-5 text-justify">
          5) 정신건강 전문가의 상담을 받아보세요. 신체뿐만 아니라 정신건강까지
          챙길 수 있어 더 효과적이에요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
