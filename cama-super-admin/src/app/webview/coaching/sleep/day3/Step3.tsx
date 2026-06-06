import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAccountName from "@/hooks/useAccountName";
import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import ImporText from "../../mental/component/ImportText";
import { CgArrowLongRightC } from "react-icons/cg";
export default function Day3Step3(props: any) {
  const { onSave, data, onPrev } = props;

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="mission" coachingType="A">
        <MissionTitle>"계획한 시간에 자고 일어나기"</MissionTitle>

        <TextBox className="text-center mt-10 !text-camaColor font-bold">
          <div className="flex items-center justify-center gap-2">
            내가 정한 취침시간 <CgArrowLongRightC className="text-xl mt-0.5" />
            <span className="text-camaColor1">{`${data.sleep.hour}:${data.sleep.minutes}`}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            내가 정한 기상시간 <CgArrowLongRightC className="text-xl mt-0.5" />
            <span className="text-camaColor1">{`${data.wakeup.hour}:${data.wakeup.minutes}`}</span>
          </div>
        </TextBox>
        <TextArea className="mt-10 text-justify font-bold ">
          <ImporText className="ml-0">{accountName}</ImporText>님이 정한
          취침시간에 잠자리에 들고, 목표한 기상시간을 반드시 지켜 일어납니다.
          전날 잠을 잘 자지 못했더라도, 목표한 기상시간에 일어나는 것이
          중요합니다.
        </TextArea>
        <MissionChallengeButton onClick={onSave} className="mt-10" />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
