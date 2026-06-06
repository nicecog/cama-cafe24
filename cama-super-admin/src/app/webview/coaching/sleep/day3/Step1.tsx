import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "../../component/Layout/MainCard";
import TextArea from "../../component/Layout/TextArea";
import SleepWakeupCheck from "../../component/SleepWakeupCheck";
import useAlert from "@/hooks/useAlert";

type StepData = {
  wakeup: string;
  sleep: string;
};

type Day3Step1 = {
  data: StepData;
  onNext: (cd: string) => void;
  onChange: (e: StepData) => void;
};

// Day3
export default function Day3Step1(props: any) {
  const { data, onChange, onNext } = props;

  const { alert } = useAlert();

  const onChangeHandler = (name: string, value: string) => {
    onChange({ ...data, [name]: value });
  };

  const onNextHandler = () => {
    if (
      ["sleep", "wakeup"].some(
        (key) => data[key].hour === "" || data[key].minutes === ""
      )
    ) {
      alert("시간을 모두 선택해 주세요");
      return;
    }
    onNext();
  };

  return (
    <>
      <MainCard type="question" coachingType="A">
        <TextArea className="!text-camaColor font-bold  mt-5">
          오늘부터 규칙적인 수면을 위한 목표 수면 시간을 정해볼까요?
        </TextArea>

        <SleepWakeupCheck
          className="mt-10"
          data={data}
          onChange={onChangeHandler}
        />
      </MainCard>

      <NextButton onNext={onNextHandler} />
    </>
  );
}
