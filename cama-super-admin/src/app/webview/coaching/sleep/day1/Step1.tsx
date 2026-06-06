import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "../../component/Layout/TextArea";
import ConfrimAnswerButton from "../../component/Layout/Buttons/ConfirmAnswerButton";
import useAlert from "@/hooks/useAlert";

// Day1
export default function Day1Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();
  //  답 선택
  const onClick = (value: string) => {
    if (data === value) {
      return;
    }
    onChange(value);
  };

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    onNext("A2");
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextBox className="">
          <div className="font-bold text-camaColor mb-5">
            오늘부터 하루에 하나씩 건강한 수면 습관을 만들어 보기로 해요.
          </div>
          앞으로 매일 간단한 질문과 함께 쉽게 할 수 있는 미션을 드릴 거에요.
        </TextBox>
        <TextArea className="mt-5 mb-4 !text-camaColor !font-bold  ">
          {accountName} 님의 수면 상태는 어떤가요? <br />
          충분히 잘 자고 있나요?
        </TextArea>
        <ConfrimAnswerButton onChange={onClick} value={data} />
      </MainCard>
      <NextButton onNext={onNextHandler} />
    </>
  );
}
