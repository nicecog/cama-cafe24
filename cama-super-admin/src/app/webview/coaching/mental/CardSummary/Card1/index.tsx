// 복식호흡 요약
import ReactPlayer from "react-player";
import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Card1Image from "@/assets/images/mental/56.png";
import { CardSummaryType } from "../Types/CardSummaryType";
import MentalButton from "../../component/MentalButton";
import useAlert from "@/hooks/useAlert";
import useCardSummary from "../useCardSummaryTitle";

export default function Card1Summary(props: CardSummaryType) {
  // Confirm
  const { confirm } = useAlert();

  // 완료 버튼
  const onClickHandler = () => {
    confirm({ html: `복식호흡을 이해하는 데 <br/>도움이 되셨나요?` }, () => {
      props.onComplete();
    });
  };

  const bubbles = useCardSummary({ CardType: "card1" });

  return (
    <>
      <div> {bubbles}</div>
      <TextBox className="mt-5 text-justify">
        <ImageBox
          imgSrc={Card1Image}
          className="mt-5"
          containerClassName="!mb-5"
        />
        마음은 신체의 감각과 긴밀하게 연결되어 있어요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        불안해지면 심장이 더 빨리 뛰고, 땀이 나고, 호흡이 가빠지는 것처럼요.
        특히 암과 같은 어려운 상황에 직면할 때 신체는 긴장되고 근육에는 힘이
        들어가지요.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        하지만 이 상태가 계속되면 브레이크가 고장난 자동차처럼 엔진이 과열될 수
        있어요. 이때 브레이크 역할을 해주는 게 복식호흡 훈련이에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        복식호흡은 몸을 이완시키고 평온함을 찾도록 도와주지요. 몸과 마음을
        놀랍도록 편안하게 해주는 간단하면서도 마법 같은 방법이에요. 복식호흡을
        꾸준히 실천하는 습관을 들이고, 전반적인 건강에 미치는 변화를 느껴보세요.
        우선, 편안한 자세로 자리에 앉거나 누워보세요. 준비되셨으면 시작할게요.
      </TextArea>

      <div className="w-full h-[300px] mt-5 text-justify">
        <ReactPlayer
          url={import.meta.env.VITE_CARD1_URL}
          width="100%"
          height="100%"
          controls={true}
        />
      </div>

      <MentalButton onClick={onClickHandler}>완료</MentalButton>
    </>
  );
}
