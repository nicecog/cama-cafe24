import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import day2Pic from "./day2Pic.png";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import InfomationTitle from "../../component/Layout/Titles/InfomationTitle";
import CheckText from "../../component/CheckText";

export default function Day2Step2(props: any) {
  // Props;
  const { onNext, onPrev } = props;

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        <InfomationTitle>식사습관 점검</InfomationTitle>
        <TextBox className="mt-10 text-justify">
          <div className="flex justify-center mb-10">
            <img src={day2Pic} alt="day2Pic" className="rounded-xl " />
          </div>
          <div className="mb-5 text-[#774F2D]  ">
            식사를 잘한다는 것은 몸이 필요로 하는 여러 영양소를 골고루 섭취하는
            것을 의미해요.
          </div>
        </TextBox>

        <TextArea className="mt-10 text-justify">
          암 치료 중에 잘 먹기 위한 방법으로는 다음과 같은 것들이 있어요.
        </TextArea>

        <TextArea className="mt-5 font-bold !text-camaColor">
          <CheckText>새로운 음식에 도전해 보기</CheckText>
          <CheckText>식물성 음식으로 바꿔 보기</CheckText>
          <CheckText>컬러풀한 과일과 채소를 매일 더 먹기</CheckText>
          <CheckText>신체적으로 활발하게 생활하기</CheckText>
          <CheckText>붉은 고기와 가공된 육류 제한하기</CheckText>
        </TextArea>

        <TextArea className="mt-10 text-justify">
          특히, 단백질 보충과 칼로리를 충분히 섭취하는 것은 매우 중요해요.
          <br />
          이를 위해 다음과 같은 방법들이 도움이 될 수 있어요.
        </TextArea>

        <TextArea className="mt-10 font-bold !text-camaColor">
          <CheckText>
            하루에 3끼를 먹는 대신 적은 양을 여러 끼에 나누어 자주 먹기
          </CheckText>
          <CheckText>
            먹고 싶은 음식, 좋아하는 음식을 언제든지 먹기
            <span className="text-[15px] ml-1">
              (예: 아침 식사용 음식을 저녁에 먹어도 OK)
            </span>
          </CheckText>
          <CheckText> 배고플 때까지 기다리지 말고 몇 시간마다 먹기</CheckText>
          <CheckText> 고열량, 고단백질의 음식 먹기</CheckText>
          <CheckText> 식욕을 돋우기 위해 식사 전에 가벼운 산책하기</CheckText>
          <CheckText>
            셰이크 형태의 환자용 영양 균형식 고열량, 고단백 음료를 마시기
          </CheckText>
        </TextArea>

        <TextArea className="mt-5 text-justify">
          이 중에는 이미 시도해 본 방법들도 있고, 특정 암종이나 개인의 상황에
          따라 실행하기 어려운 것들도 있을 거예요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
