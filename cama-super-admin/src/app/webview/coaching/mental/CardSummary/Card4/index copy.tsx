import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import { CardSummaryType } from "../Types/CardSummaryType";
import MentalButton from "../../component/MentalButton";
import useAlert from "@/hooks/useAlert";
import useCardSummary from "../useCardSummaryTitle";
import MissionTitle from "../../../component/Layout/MissionTitle";
import infoImage from "@/assets/images/character/infoTitle.png";
import ImporText from "../../component/ImportText";
import { FcAbout, FcPortraitMode } from "react-icons/fc";
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

      <TextArea className="mt-5">
        <MissionTitle className="">예를 들어 봅시다.</MissionTitle>
      </TextArea>
      <TextBox className="mt-5 text-justify">
        검사 결과를 확인하는 날, 주치의가
        <br />
        <ImporText className="!mx-0 !mr-1">
          '결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'
        </ImporText>
        라고 말 했을때,
        <br />
        어떤 생각이 떠오르셨나요?
      </TextBox>
      <TextArea className="mt-5">
        <p className="font-oneMobile">1.결과가 대체로 좋으면 성공이다.</p>
        <p className="font-oneMobile">2.다시 기다려야 한다니 믿을 수 없다.</p>

        <p className="font-oneMobile">3.한 가지가 좋지 않으면 모든 노력이</p>
        <p className="font-oneMobile ml-4">실패한 것이다.</p>
      </TextArea>
      <TextArea className="mt-5 text-justify tracking-tighter">
        중요한 것은 <ImporText>머릿속에 생각이 떠올랐는지</ImporText> 인식하는
        것입니다. 생각은 자동으로 떠오르지만, 우리는 종종 이를 인식하지
        못합니다.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        같은 상황에서도 어떤 생각이 떠오르느냐에 따라 기분은 크게 달라질 수
        있습니다.
      </TextArea>

      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1 ">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'결과가 대체로 좋다니 성공이야.'</ImporText>
        </div>
        라고 생각하면 안심되거나 희망적일 수 있습니다
      </TextBox>

      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1 ">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'또 기다려야한다니.'</ImporText>
        </div>
        라고 생각하면 낙담하거나 실망할 수 있습니다.
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1 ">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>
            '하나가 좋지 않다니,
            <br /> 내 노력이 모두 실패한거야.'
          </ImporText>
        </div>
        라고 생각하면 슬프거나 화가 날 수 있습니다.
      </TextBox>

      <TextArea className="mt-5 text-justify">
        하지만 생각은 때때로 실수를 합니다. <br />
        의사는 경과를 지켜보자고 했지만, 결과를
        <ImporText>'좋지 않다'</ImporText> 또는
        <ImporText>'실패'</ImporText>라고 해석했습니다. 그리고
        <ImporText>'결과가 좋다'</ImporText>는 일반적인 결과를 무시했습니다.
      </TextArea>

      <TextArea className="mt-5 text-justify">
        한 가지 결과가 좋지 않다고 해서 모든 <br />
        노력이 실패한 것은 아닙니다.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        <TextBox className="mt-5 text-center">
          중요한 건,
          <br />
          <ImporText className="!mx-0">
            "생각에 오류가 있을 수 있다는 것"
          </ImporText>
          <br />
          아는 것입니다.
          <br />
        </TextBox>
        <p className="mt-5 text-center font-bold">생각의 균형을 맞추세요.</p>
      </TextArea>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5">카마 코치의 조언</MissionTitle>
        <p className="font-oneMobile mb-1">
          긍정적인 면과 부정적인 면을 <br />
          모두 살펴보세요.
        </p>
        <p className="font-oneMobile mb-1">다양한 가능성을 고려하세요. </p>
        <p className="font-oneMobile mb-1">
          생각이 맞는지 증거를 찾고, 틀린지 <br />
          증거를 찾으세요.
        </p>
      </TextBox>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-5">균형잡힌 생각의 예</MissionTitle>
        <p className="font-oneMobile">
          "한 가지가 좋지 않으면 모든 노력이 <br /> 실패한 것이다."
        </p>
      </TextBox>
      <TextArea className="mt-3">
        <div className="flex items-center  gap-5 py-1">
          <FcPortraitMode className="text-[28px]" />
          <p className="tracking-tighter text-justify leading-6">
            나머지는 좋았으니 <br /> 다음 결과도 좋을 것이다.
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
            아쉽지만 최선을 다했으니
            <br /> 그 덕분에 결과가 좋다.
          </p>
        </div>
      </TextArea>

      <TextArea className="mt-5 text-justify">
        <MissionTitle>어떻게 느끼시나요?</MissionTitle>
        생각이 바뀌면 기분도 바뀐다는 것을 느낀 적이 있나요?
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
