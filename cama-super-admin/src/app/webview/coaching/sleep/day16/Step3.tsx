import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day16Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"변화 지속을 위한 선언하기"</MissionTitle>
        <TextArea className="text-justify my-10 font-bold">
          카마 코칭을 통해서 변화된 자신의 수면 습관을 떠올려보세요. 그리고
          앞으로도 그러한 습관을 유지 하겠다고 가족들에게 알려주세요.
        </TextArea>
        <TextArea className="text-justify my-5 font-bold">
          이것은 자신과의 약속을 되새기는 과정입니다.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
