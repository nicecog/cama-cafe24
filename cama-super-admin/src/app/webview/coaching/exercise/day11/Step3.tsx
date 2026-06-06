import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import ExcerciseCompleteButton from "@/app/webview/coaching/component/Layout/ExcerciseCompleteButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";

export default function Day11Step3(props: any) {
  const { onSave, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>
          " 내가 운동을 하면서 꼭 지켜야 할 <br />
          주의 사항 정하기"
        </MissionTitle>
        <TextArea className=" my-10 ">
          <p className="text-center">
            다음 중 한 가지 이상을 꼭 실행해 보세요.
          </p>
          <div className="border bg-white p-4 rounded-md shadow-md mt-2">
            <p className="font-bold">1. 의사와 상의</p>
            <p className="font-bold">2. 부작용 검토</p>
            <p className="font-bold">3. 적절한 운동의 종류 선택</p>
          </div>
        </TextArea>
        <ExcerciseCompleteButton condition={true} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
