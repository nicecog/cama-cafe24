import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day4Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>
          "잠자리에 누워서 <br />
          호흡에 집중하기"
        </MissionTitle>
        <TextArea className="text-justify mt-10 font-bold">
          잠자리에서 이런 저런 생각이 들 때, 들숨과 날숨에 주의를 기울여 봅니다.
        </TextArea>
        <TextArea className="text-justify my-10 font-bold tracking-tighter">
          호흡에 집중하다보면 어느새 생각이 사라지고, 마음이 차분해지는 것을
          느낄 거에요. <br />
          그리고 스르르 잠이 올 겁니다.
        </TextArea>
        <MissionChallengeButton onClick={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
