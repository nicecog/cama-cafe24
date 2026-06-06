import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MissionTitle from "../../component/Layout/MissionTitle";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";
import useAlert from "@/hooks/useAlert";
// Day9
export default function Day9Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext();
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="C">
        <MissionTitle>
          오늘도 카마와 함께 하는 <br />
          {accountName}님의 노력이 보기 좋아요!
        </MissionTitle>
        <TextBox className="my-5  text-justify">
          건강을 향한 여정에 계속 힘내 주세요
        </TextBox>
        <TextArea className="my-10  text-center ">
          운동을 계획대로 잘 실천하는 편인가요?
        </TextArea>

        <ConfrimAnswerButton value={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
