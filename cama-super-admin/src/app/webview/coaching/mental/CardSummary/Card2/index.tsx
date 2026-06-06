import { CardSummaryType } from "../Types/CardSummaryType";
import TextBox from "../../../component/Layout/TextBox";
import ImageBox from "../../../component/ImageBox";
import CardImage from "@/assets/images/mental/57.png";
import useAlert from "@/hooks/useAlert";
import useCardSummary from "../useCardSummaryTitle";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";

import infoImage from "@/assets/images/character/infoTitle.png";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { FcIdea } from "react-icons/fc";
import MessageExample from "../../Cards/Card2/component/MessageExample";
import MentalButton from "../../component/MentalButton";
// 나말하기 기법

export default function Card2Summary(props: CardSummaryType) {
  // Confirm
  const { confirm } = useAlert();

  // 완료 버튼
  const onClickHandler = () => {
    confirm(
      { html: `나 말하기 기법을 이해하는 데 <br/>도움이 되셨나요?` },
      () => {
        props.onComplete();
      }
    );
  };

  const bubbles = useCardSummary({ CardType: "card2" });

  return (
    <>
      <div> {bubbles}</div>
      <TextArea className="mt-5 text-justify">
        때때로 상대방과 소통하면서 자신의 욕구나 감정이 충족되지 못할때가
        있어요.
        <br />
        이럴 때 화내거나 싸우지 않고, 일방적으로 참거나 양보하지 않더라도 내
        욕구를 충분히 채울 수 있어요.
      </TextArea>
      <TextArea>
        마음건강에 도움이 되는 소통의 비법,
        <ImporText>'나 말하기 기법'</ImporText>을 소개할게요.
      </TextArea>
      <TextArea className="mt-10">
        <MissionTitle className="mt-5 mb-10 flex gap-3 items-center justify-center">
          <img src={infoImage} className="w-[28px]" />나 말하기 기법(I-message)
        </MissionTitle>
      </TextArea>
      <ImageBox
        imgSrc={CardImage}
        className="w-[250px]"
        containerClassName="!mb-3"
      />
      <TextBox className="mt-3 text-left">
        <p className="font-oneMobile my-0.5">
          1. 상대방의 <span className="text-camaColor1 mx-0.5">행동</span>에
          대해서 이야기한다.
        </p>
        <p className="font-oneMobile my-0.5">
          2. 그로 인한 나의 <span className="text-camaColor1 mx-0.5">감정</span>
          을 이야기한다.
        </p>
        <p className="font-oneMobile my-0.5">
          3.<span className="text-camaColor1 mx-0.5">바라는 것</span>을
          구체적으로 이야기한다.
        </p>
      </TextBox>

      <TextArea className="mt-5 mb-2 text-center font-bold">
        예시를 살펴볼까요 ?
      </TextArea>

      <TextBox className="text-justify">
        <p className="  text-camaColor border-b pb-3 text-f8 my-3 flex items-center justify-start gap-1.5 font-oneMobile">
          <FcIdea className="text-f10" /> 상황
        </p>
        원하지 않는 음식이 몸에 좋다며 자꾸 권하는 가족에게
        <span className="font-oneMobile text-camaColor1 mx-1 ">
          "나 말하기 기법"
        </span>
        을 사용한다면, 어떻게 말할 수 있을까요?
      </TextBox>
      <TextArea>
        <MessageExample type={1} className="mt-5">
          "지금 먹고 싶지 않은데 자꾸 권하네"
        </MessageExample>
        <MessageExample type={2} className="mt-5">
          "미안하기도 하고 부담스럽기도 해"
        </MessageExample>
        <MessageExample type={3} className="mt-5">
          "다음에 먹고 싶다고 할 때 갖다 주면 좋겠어."
        </MessageExample>
      </TextArea>

      <MentalButton onClick={onClickHandler}>완료</MentalButton>
    </>
  );
}
