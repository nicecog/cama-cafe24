import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";

import Day5Pic from "./day5.png";
import TextArea from "../../component/Layout/TextArea";
import TextBox from "../../component/Layout/TextBox";

export default function Day5Step2(props: {
  onNext: () => void;
  onPrev: () => void;
}) {
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard type="infomation" coachingType="A">
        <InfomationTitle>카페인</InfomationTitle>
        <TextBox className="mt-10">
          <div className="flex justify-center mb-10">
            <img src={Day5Pic} alt="day4" className="rounded-xl" />
          </div>
          자기 전에 마시는 커피가 수면을 방해한다는 것은 이제 많은 사람이 알고
          있는 사실입니다. 하지만 낮에 마시는 커피도 밤에 잠을 자는 것에 방해가
          될 수 있어요.
        </TextBox>

        <TextArea className="mt-10">
          우리가 흔히 마시는 아메리카노 한 잔에는 100~150mg 정도의 카페인이
          포함되어 있는데, 이것이 절반으로 줄어드는 데 걸리는 시간이 6시간이나
          됩니다. 결국 체내에 카페인이 1/4 로 줄어들려면 12시간이 지나야 하는
          것이지요. 그래서 가능하면 커피는 오전에만 마시고, 점심시간 이후로는
          피하는 것이 숙면에 도움이 돼요.
        </TextArea>
        <TextArea className="mt-10">
          커피 이외에도 카페인이 들어가 있는 음식, 음료들이 많이 있어요. 녹차,
          콜라, 에너지 음료, 초콜릿 등에도 카페인이 함유되어 있어요.
        </TextArea>
        <TextArea className="mt-10">
          따라서 카페인에 민감하다면, 평소 먹는 음식이나 음료에 카페인이
          함유되어 있는지 잘 살피고, 먹는 양과 시간을 조절하는 습관을 갖는 것이
          중요합니다.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
