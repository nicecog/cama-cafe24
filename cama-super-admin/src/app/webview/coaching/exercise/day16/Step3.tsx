import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import MissionTitle from "@/app/webview/coaching/component/Layout/MissionTitle";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ExcerciseCompleteButton from "@/app/webview/coaching//component/Layout/ExcerciseCompleteButton";
import NextButton from "@/app/webview/coaching//component/Layout/NextButton";
import TextArea from "@/app/webview/coaching//component/Layout/TextArea";
import Inputs from "@/app/webview/coaching//component/Inputs";

export default function Day14Step3(props: any) {
  const { onSave, data, onChange, onPrev } = props;

  return (
    <>
      <MainCard type="mission">
        <MissionTitle>"변화 지속을 위한 선언하기"</MissionTitle>
        <TextBox className=" mt-5  text-justify ">
          지금까지 해온 운동을 계속하기로 가족이나 담당 의사, 또는 다른
          지인들에게 선언해 보세요.
        </TextBox>

        <TextArea className=" mt-5  text-justify ">
          <div>
            직접 말로 하는 것이 가장 좋지만, 상황이 여의치 않다면 핸드폰 문자
            메시지 등으로 선언하셔도 돼요.
          </div>
          <Inputs
            value={data}
            placeholder="누구에게 선언할 것인지 입력하세요"
            onChange={(e: any) => {
              onChange(e.target.value);
            }}
          />
        </TextArea>

        <TextArea className=" mt-5  text-justify ">
          위에서 입력한 사람에게 다음과 같이 말씀하세요.
        </TextArea>
        <TextArea className=" my-5  text-center text-camaBlue font-bold ">
          "나는 지금처럼 앞으로도 <br />
          운동을 꾸준히 하겠습니다!"
        </TextArea>

        <ExcerciseCompleteButton condition={data} onSave={onSave} />
      </MainCard>
      <NextButton onPrev={onPrev} />
    </>
  );
}
