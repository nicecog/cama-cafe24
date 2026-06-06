import MainCard from "@/app/webview/coaching/component/Layout/MainCard";

import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import TextAreaTitle from "@/app/webview/coaching/component/Layout/Titles/TextAreaTitle";
import useAccountName from "@/hooks/useAccountName";
import Day11Pic from "./day11Pic.png";
import ImageBox from "../../component/ImageBox";
import ImporText from "../../mental/component/ImportText";

export default function Day10Step2(props: any) {
  // Props;
  const { onNext, onPrev, step1 } = props;

  const accountName = useAccountName();

  return (
    <>
      <MainCard coachingType="B" type="infomation">
        {step1 === "예" ? (
          <>
            <TextBox className="mt-10  text-justify">
              <ImageBox imgSrc={Day11Pic} />
              <div className="mb-5 tracking-tighter">
                <ImporText className="ml-0">{accountName}</ImporText>님만의
                주의사항이 있으시네요!
              </div>
              아래 내용을 읽어보시고 추가하고 싶은 내용이 있으면 확인해 보세요.
            </TextBox>
          </>
        ) : (
          <>
            <TextBox className="mt-10 text-justify">
              <ImageBox imgSrc={Day11Pic} className={"!w-[220px]"} />
              <div className="mb-5 ">
                암 환자분들은 면역력이 약해져 있어 외식할 때 조금 더 주의를
                기울이는 것이 좋아요.
              </div>
              외부 환경에서는 식품의 안전성을 완전히 보장하기 어려운 경우가 많기
              때문이에요.
            </TextBox>
          </>
        )}

        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 외식 시간대</TextAreaTitle>
          되도록 사람이 적은 이른 시간이나 늦은 시간에 식당을 이용하세요. 이는
          감염 위험을 줄이는 데 도움이 돼요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 요리 주문</TextAreaTitle>1 인분으로 나오는 요리를
          주문하고, 뷔페식은 가능한 한 피하세요. 뷔페는 여러 사람이 같은 조리
          도구를 사용하여 감염 위험이 더 클 수 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 주스 확인</TextAreaTitle>
          저온 살균된 주스를 선택하고, 생과일주스는 피하세요. 생과일주스는
          미생물에 오염될 위험이 있어요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 식기 확인</TextAreaTitle>
          숟가락, 젓가락, 포크 등 식사 도구가 깨끗하고 테이블 매트나 냅킨 위에
          놓여 있는지 확인하세요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 남은 음식 포장</TextAreaTitle>
          남은 음식을 포장하고 싶다면, 가능한 한 직접 용기에 담아 미생물에 의한
          오염을 최소화하세요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 메뉴 선택</TextAreaTitle>
          가능하다면 완전히 익힌 음식을 선택하고, 날것이나 반죽 상태의 음식은
          피하세요.
        </TextArea>
        <TextArea className="mt-10 text-justify">
          <TextAreaTitle>✔ 음료 선택</TextAreaTitle>
          가능한 차와 같은 뜨거운 음료나 병에 든 음료를 선택하고, 필요하다면
          개인 물병을 가지고 다니는 것이 좋아요.
        </TextArea>
      </MainCard>
      <NextButton onNext={onNext} onPrev={onPrev} />
    </>
  );
}
