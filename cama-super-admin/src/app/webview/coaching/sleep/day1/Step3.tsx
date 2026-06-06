import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import Inputs from "@/app/webview/coaching/component/Inputs";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";

export default function StartDayStep3(props: any) {
  const { data, onChange, onSave, onPrev } = props;

  const accountName = useAccountName();

  const { alert } = useAlert();
  const onSaveHandler = () => {
    if (data.trim() === "") {
      alert("내용을 입력해 주세요");
      return;
    }
    onSave();
  };
  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "잠을 잘 자면 좋은 점을
          <br /> 한가지 생각하기"
        </MissionTitle>
        <TextBox className="text-center mt-10 ">
          <div className="text-camaColor font-bold mb-5">
            {accountName} 님의 수면이 개선된다면 <br />
            어떤 점이 가장 좋을까요? <br />한 가지만 작성해 보세요.
          </div>
          (예: 내가 지금보다 잠을 잘 잔다면, <br />
          다음날 더 활력이 생길것이다.)
        </TextBox>
        <TextArea className="text-center !text-camaColor font-bold mt-5">
          내가 지금 보다 잠을 잘 잔다면,
        </TextArea>
        <Inputs
          value={data.value2}
          onChange={(e: any) => onChange(e.target.value)}
        />

        <MissionChallengeButton onClick={onSaveHandler} className="mt-10" />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
