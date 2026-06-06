import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import MissionTitle from "../../component/Layout/MissionTitle";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "../../component/Layout/TextArea";
import NextButton from "../../component/Layout/NextButton";
import Day13Title from "./Day13Title.png";
import ImageBox from "../../component/ImageBox";
import useAlert from "@/hooks/useAlert";

// Day13
export default function Day13Step1(props: any) {
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

  return (
    <>
      <MainCard type="question" coachingType="C">
        <MissionTitle className="mb-5">
          이제 목표의 80%를 넘었습니다.
        </MissionTitle>
        <TextBox className="text-justify">
          <ImageBox imgSrc={Day13Title} />
          오늘도 함께 건강해지기 위해 노력해봐요!
        </TextBox>

        <TextArea className="my-5 text-justify">
          지난 번에 알려드린 운동 시 주의사항을 <br />
          기억하시나요?
        </TextArea>
        <ConfrimAnswerButton value={data} onChange={onChange} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
