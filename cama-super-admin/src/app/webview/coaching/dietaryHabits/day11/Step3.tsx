import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import CheckAnswers from "../../component/Layout/CheckAnswers";

import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextBox from "../../component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import useAlert from "@/hooks/useAlert";
const checkAnswer = [
  "혼잡한 시간 피하기",
  "1인분 요리 주문하기",
  "주스는 저온살균으로",
  "식기위생 확인하기",
  "남은 음식은 직접 포장하기",
  "가능한 완전히 익은 음식 선택하기",
  "가능한 따듯한 음료나 병에 든 음료 선택하기",
  "모두 이미 잘 하고 있음",
];
export default function Day11Step3(props: any) {
  const { onSave, step3, onChange, onPrev } = props;

  const { alert } = useAlert();

  //  답 선택
  const onClick = (value: string) => {
    onChange(
      step3.includes(value)
        ? step3.filter((item: string) => item !== value)
        : step3.concat(value)
    );
  };
  const accountName = useAccountName();

  const onSaveHandler = () => {
    if (step3.length === 0) {
      alert("선택해 주세요");
      return;
    }
    onSave();
  };
  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          "외식 때 새롭게 실천할 <br />
          사항 정하기"
        </MissionTitle>
        <TextBox className="mt-10 text-justify">
          오늘은 외식을 할 때 유의할 점을 살펴보았어요.
        </TextBox>
        <TextArea className="mt-5  mb-10 text-justify">
          오늘 확인한 내용 중 {accountName}님이 새롭게 실천해야겠다고 생각한
          것이 있으면 모두 선택해 보세요.
        </TextArea>
        <TextArea className="my-5 mb-10">
          <CheckAnswers list={checkAnswer} data={step3} onChange={onClick} />
        </TextArea>

        <MissionChallengeButton onClick={onSaveHandler} />
      </MainCard>

      <NextButton onPrev={onPrev} />
    </>
  );
}
