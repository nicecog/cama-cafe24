import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import CheckAnswers from "../../component/Layout/CheckAnswers";

import MissionChallengeButton from "@/app/webview/coaching/component/Layout/Buttons/MissionChallengeButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import useAccountName from "@/hooks/useAccountName";
import TextBox from "../../component/Layout/TextBox";
import useAlert from "@/hooks/useAlert";
const checkAnswer = [
  "정확한 목표 설정",
  "일정 관리 앱 이용",
  "가족 및 친구들의 지원 요청",
  "다양한 식단 준비",
  "자기 기록과 리뷰",
  "보상 시스템 설정",
  "실용적인 레시피 활용",
];

export default function Day9Step3(props: any) {
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
        <MissionTitle>"식습관 변화를 위한 전략 마련하기"</MissionTitle>
        <TextBox className="mt-10  text-justify">
          카마코치와 함께 식습관 변화를 위한 여정을 함께 하고 있어요.
        </TextBox>
        <TextArea className="mt-5  mb-10  text-justify">
          오늘 확인한 내용 중 {accountName}이 새롭게 실천해야겠다고 생각한 것이
          있으면 모두 선택해 보세요.
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
