import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "../../component/Layout/TextArea";

export default function Day16Step2(props: any) {
  const { onNext, onPrev } = props;

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <TextBox className="mt-5">
          수면 시간이나 수면의 질이 좋아졌다면, 그것은
          <span className="font-bold underline text-lg text-green-600 mx-1">
            {accountName}
          </span>
          님이 힘든 노력을 기울여 얻은 값진 결과예요.
        </TextBox>
        <TextArea className="mt-10">
          <span className="font-bold underline text-lg text-green-600 mx-1">
            {accountName}
          </span>
          님의 노력으로 잠으로부터 해방되어 일상생활에 집중할 수 있다면, 그것은
          새로운 수면 습관이 성공적으로 자리잡혔다는 증거예요.
        </TextArea>

        <TextArea className="mt-10">
          아직 만족스럽지 못하더라도 걱정하지 마세요. 습관을 만드는 것은
          하루아침에 이뤄지는 일이 아니니까요. 계속해서 노력해 보세요. 충분한
          수면이 당신의 건강에 얼마나 중요한지를 잊지 말고, 매일 밤 건강한
          수면을 위해 해야 할 행동을 하는 겁니다.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
