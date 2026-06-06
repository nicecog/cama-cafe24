import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import Day12Pic from "./Day12Pic.png";
import InfomationTitle from "@/app/webview/coaching/component/Layout/Titles/InfomationTitle";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ExerciseResult from "../../component/Layout/ExerciseResult";
import ImageBox from "../../component/ImageBox";

export default function Day12Step2(props: any) {
  // Props;
  const { onNext, onPrev, data } = props;

  return (
    <>
      <MainCard type="infomation">
        <InfomationTitle className="!text-[20px]">
          유산소 운동과 근력 운동을 함께 하는 것의 이점
        </InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <ImageBox imgSrc={Day12Pic} />
          유산소 운동과 근력 운동을 함께 한다면 어떤 점이 좋을까요?
        </TextBox>

        <TextArea className="mt-5 text-justify flex items-start  gap-2">
          <div>✔</div>
          <div>
            유산소 운동은 심폐 기능을, 근력 운동은 근육과 뼈를 강화하기 때문에
            두 가지를 조합하면 전반적인 체력이 향상될 수 있어요.
          </div>
        </TextArea>
        <TextArea className="mt-5 text-justify flex items-start  gap-2">
          <div>✔</div>
          <div>
            암 치료의 부작용으로 나타나는 피로감, 근육 손실, 체력 저하 등을
            완화할 수 있어요.
          </div>
        </TextArea>
        <TextArea className="mt-5 text-justify flex items-start  gap-2">
          <div>✔</div>
          <div>
            유산소 운동을 할 때는 호흡수와 심박수가 어느 정도 증가할 수 있는
            강도가 좋아요. 운동을 하면서 말은 할 수 있지만 노래는 하기 힘든
            정도의 강도를 유지해 보세요.
          </div>
        </TextArea>
        <ExerciseResult data={data} />
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
