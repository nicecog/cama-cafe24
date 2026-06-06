import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import Inputs from "@/app/webview/coaching/component/Inputs";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAlert from "@/hooks/useAlert";

type StepType = {
  data: string;
  onChange: (e: any) => void;
  onSave: () => void;
  onPrev: () => void;
};

export default function Day8Step3(props: StepType) {
  const { data, onChange, onSave, onPrev } = props;

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
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"자신의 노력을 칭찬하기"</MissionTitle>
        <TextArea className="text-justify my-10 ">
          지금까지 계획을 잘 지켰든 지키지 못했든 간에, 8일차까지 도전하고
          실천하고 있다는 것은 수면에 관심을 갖고 관리하려고 노력했다는
          뜻입니다.
        </TextArea>
        <TextArea className="text-justify mt-10 mb-1 font-bold ">
          자기 자신에게 칭찬과 지지의 말 한 마디를 해주세요. <br />
          (예: 지치지 말고 조금만 더 노력해보자!)
        </TextArea>
        <Inputs
          value={data}
          onChange={(e: any) => {
            onChange(e.target.value);
          }}
        />
        <MissionChallengeButton onClick={onSaveHandler} className="mt-10" />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
