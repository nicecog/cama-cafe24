import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import useAccountName from "@/hooks/useAccountName";
import Day3Pic from "./day3Pic.png";
import TextArea from "../../component/Layout/TextArea";
import ImageBox from "../../component/ImageBox";
export default function StartDayStep2(props: any) {
  // Props;
  const { step1, onNext, onPrev } = props;

  // State

  const accountName = useAccountName();
  // (2점 이하) 조금 더 운동이 필요해요! 지금의 생활습관에 변화를 줘 보세요.
  // (3~5점) 이미 어느 정도 운동을 하고 있네요! 지금보다 조금 더 건강한 습관을 만들어보세요.
  // (6점 이상) 대체로 좋은 운동 습관을 가지고 있어요! 지금의 습관을 계속 유지하세요.

  return (
    <>
      <MainCard type="infomation">
        <TextBox className="mt-5 text-justify">
          <ImageBox imgSrc={Day3Pic} />
          {accountName}
          님은 다음과 같이 선택해 주셨습니다.
        </TextBox>

        <TextArea className="mt-5 rounded-md p-3 ">
          {step1.map((r: string, idx: number) => (
            <p className="  text-camaColor font-bold  text-md" key={idx}>
              {r}
            </p>
          ))}
        </TextArea>

        <TextBox className="mt-5 text-justify">
          처음부터 너무 무리를 할 필요는 없어요. 하루에 10분 걷기와 같이 작은
          것에서부터 시작해도 괜찮아요.
        </TextBox>
        <TextBox className="mt-5 text-justify">
          시작이 반이라는 말처럼, 조금이라도 신체 활동을 하는 것이 매우
          중요합니다. 아예 활동을 하지 않는 것과의 차이는 커요.
        </TextBox>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
