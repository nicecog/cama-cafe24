import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import { CardSummaryType } from "../Types/CardSummaryType";
import MentalButton from "../../component/MentalButton";
import useAlert from "@/hooks/useAlert";
import useCardSummary from "../useCardSummaryTitle";
import MissionTitle from "../../../component/Layout/MissionTitle";
import infoImage from "@/assets/images/character/infoTitle.png";
import ImporText from "../../component/ImportText";
import { FcPortraitMode } from "react-icons/fc";

// 생각바꾸기 요약
export default function Card4Summary(props: CardSummaryType) {
  // Confirm
  const { confirm } = useAlert();

  // 완료 버튼
  const onClickHandler = () => {
    confirm({ html: `생각바꾸기를 이해하는 데 <br/>도움이 되셨나요?` }, () => {
      props.onComplete();
    });
  };

  const bubbles = useCardSummary({ CardType: "card4" });

  return (
    <>
      <div> {bubbles}</div>
      <TextBox className="mt-5 text-justify">
        건강하고 균형 잡힌 생각은 유연하고 합리적입니다. 반면에 경직되고
        비합리적인 생각은 균형이 맞지 않습니다. 긍정적인 마음가짐을 위해서는
        생각의 균형을 맞추는 것이 필요합니다.
      </TextBox>
      <TextArea>
        <MissionTitle className="mt-10   flex gap-3 items-center justify-center">
          <img src={infoImage} className="w-[28px]" />
          생각을 바꾸는 게 어떤 <br />
          도움이 되나요?
        </MissionTitle>
      </TextArea>
      <TextBox className="mt-5 text-justify">
        인간의 감정, 생각, 행동은 톱니바퀴처럼 긴밀하게 연결되어 있어요. 따라서
        하나가 바뀌면 나머지도 영향을 받게 되지요.
        <br /> 즉, <ImporText>생각을 바꾸면</ImporText> 기분이 좋아지고 기분이
        좋아지면 행동에 자신감이 생깁니다.
      </TextBox>

      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5">카마 코치의 조언</MissionTitle>
        <p className="font-oneMobile mb-1">
          긍정적인 면과 부정적인 면을 모두 살펴보세요.
        </p>
        <p className="font-oneMobile mb-1">다양한 가능성을 고려하세요. </p>
        <p className="font-oneMobile mb-1">
          생각이 맞는지 증거를 찾고, 틀린지 증거를 찾으세요.
        </p>
      </TextBox>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5">균형잡힌 생각의 예</MissionTitle>
        <p className="font-oneMobile">
          "한 가지가 좋지 않으면 모든 노력이 실패한 것이다."
        </p>
      </TextBox>
      <TextArea className="mt-3">
        <div className="flex items-center  gap-5 py-1">
          <FcPortraitMode className="text-[28px]" />
          <p className="tracking-tighter text-justify leading-6">
            나머지는 좋았으니 다음 결과도 좋을 것이다.
          </p>
        </div>

        <div className="flex items-center gap-5 py-1">
          <FcPortraitMode className="text-[28px]" />
          <p className="tracking-tighter leading-2">
            많은 것이 개선되었으니 희망적이다.
          </p>
        </div>
        <div className="flex items-center gap-5 py-1 ">
          <FcPortraitMode className="text-[28px]" />
          <p className="tracking-tighter text-justify  leading-6">
            아쉽지만 최선을 다했으니 그 덕분에 결과가 좋다.
          </p>
        </div>
      </TextArea>

      <TextArea className="mt-5 text-justify">
        생각을 다르게 함으로써 기분을 바꿀 수 있습니다. 생각이 고집스럽고 한
        번에 바뀌지 않을 수 있지만 괜찮습니다.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        계속 노력하면 곧 생각의 균형을 맞추는 전문가가 될 것입니다.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        그때까지 카마코치가 함께할게요!
      </TextArea>
      <MentalButton onClick={onClickHandler}>완료</MentalButton>
    </>
  );
}
