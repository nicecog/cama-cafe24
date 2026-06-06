import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day8Step1(props: any) {
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
      <MainCard type="question" coachingType="B">
        <TextBox className="!text-camaColor font-bold ">
          이제 도전이 절반 정도 진행되었어요.
          <br />
          오늘은 중간 점검을 하는 날이에요.
        </TextBox>

        <TextArea className="my-10 text-justify">
          지난 일주일 동안 식습관을 변화시키기 위해 노력한 부분들이 잘 유지되고
          있나요?
        </TextArea>

        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
