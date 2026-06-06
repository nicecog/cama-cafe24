import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import Day6Pic from "./day6.png";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

export default function Day6Step2(props: any) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>TV와 스마트폰</InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day6Pic} alt="day6" className="rounded-xl" />
          </div>
          TV와 스마트폰, 태블릿, 컴퓨터 등의 전자 기기를 사용하는 것은 수면에
          나쁜영향을 미칠 수 있어요.
        </TextBox>

        <TextArea className="mt-10">
          우리 뇌에서는 저녁 시간이 되면 수면을 도와주는 멜라토닌이라는 물질이
          분비돼요. 그런데, 전자 기기의 화면에서 발산되는 블루라이트는
          멜라토닌의 생성을 방해해요. 멜라토닌이 충분히 나오지 않으면, 몸은 잠을
          잘 준비를 하지 못하게 되고 결국 숙면을 취하지 못하게 돼요.
        </TextArea>
        <TextArea className="mt-10">
          따라서, 잠자기 1~2시간 전에는 가능한 전자 기기 사용을 줄이고, 꼭 써야
          한다면 블루라이트를 차단하는 안경이나 스마트폰의 블루라이트 차단
          기능을 사용하는 것이 좋아요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
