import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import Day12Pic from "./day12Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

export default function Day12Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle className="!text-[24px]">
          잠을 자기 위한 <br />
          알코올 섭취
        </InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day12Pic} alt="day12" className="rounded-xl" />
          </div>
          간혹 잠에 빨리 들기 위해 술을 한 잔씩 마시는 분들이 있어요. 술을
          마시는 자리가 있어서가 아니라, 잠에 들기 위해 마시는 것이지요.
          <br />
          술을 마시는 것은 암을 더 악화시킬 수도 있고, 수면에도 도움이 되지
          않아요.
        </TextBox>

        <TextArea className="mt-10">
          보통 술에 취하면 졸리거나 빨리 잠에 들기 때문에 수면에 도움이 된다고
          생각해요. 그러나, 실제로는 알코올을 분해하는 과정에서 잠을 계속 깨우는
          현상이 발생해요.
        </TextArea>
        <TextArea className="mt-10">
          또한 술을 마시면 소변이 자주 마려워서 깊은 잠을 자지 못하고 자주 깰 수
          있어요.
        </TextArea>
        <TextArea className="mt-10">
          가능한 한 술을 피해야 합니다. 혹시라도 잠을 자기 위해 술을 마신다면,
          바로 그만두어야 합니다.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
