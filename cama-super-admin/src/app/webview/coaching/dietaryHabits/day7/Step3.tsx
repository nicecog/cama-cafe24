import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
export default function Day7Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"탄산음료 마시지 않기"</MissionTitle>
        <TextArea className="mt-10 text-justify">
          오늘부터 탄산음료를 끊어보세요.
        </TextArea>
        <TextArea className="mt-5  mb-10 text-justify">
          탄산음료가 마시고 싶다면 당분이 없는 슈가프리 제품이나 탄산수로 대체해
          보세요.
        </TextArea>

        <MissionChallengeButton onClick={onSave} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
