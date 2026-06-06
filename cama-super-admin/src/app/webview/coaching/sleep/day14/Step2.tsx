import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import Day14Pic from "./day14Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
// Day 14
export default function Day14Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle className="!text-[24px]">낮잠 자기</InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day14Pic} alt="day14" className="rounded-xl" />
          </div>
          낮잠이 밤에 잠을 자는 데 방해가 된다는 것은 누구나 알고 있는
          사실이에요.
        </TextBox>

        <TextArea className="mt-10">
          낮잠으로 인해 수면 욕구가 감소하면 다시 잠을 자기에 충분한 수면 욕구가
          쌓일 때까지는 그만큼의 시간이 더 필요해요. 그러나 치료로 인한
          피로감이나 전날의 수면 부족으로 인해 낮잠이 꼭 필요하거나 도움이 되는
          경우도 있지요.
        </TextArea>
        <TextArea className="mt-10">
          낮에 너무 피로하고 계속 졸음이 온다면, 오후 4시 이전에 1시간 이내로
          짧게 자도록 해요. 늦은 오후나 저녁에 자는 잠은 오히려 밤잠에 방해가
          되므로 삼가야 해요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
