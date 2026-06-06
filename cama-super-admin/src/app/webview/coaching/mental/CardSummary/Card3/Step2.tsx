import VideoComponent from "./component/index";
import { CardSummaryType } from "../Types/CardSummaryType";
import MissionTitle from "../../../component/Layout/MissionTitle";
import TextBox from "../../../component/Layout/TextBox";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import { useAtomValue } from "jotai";
import { checkAtom, subStepAtom } from "./Card3Atom";

// 복식호흡 복습
export default function Step2(props: CardSummaryType) {
  const isCheck = useAtomValue(checkAtom);
  const subStep = useAtomValue(subStepAtom);

  return (
    <>
      {!isCheck && subStep === 1 && (
        <>
          <MissionTitle>"평소에 어떻게 지내시나요?</MissionTitle>
          <TextBox className="mt-5">
            <p className="font-oneMobile">
              ✔ 내가 무엇을 원하는지 잘 모르겠다.
            </p>
            <p className="font-oneMobile">✔ 스스로에게 엄격하고 엄격하다.</p>
            <p className="font-oneMobile">✔ 항상 조급하거나 산만하다.</p>
            <p className="font-oneMobile">✔ 의도와 다르게 화를 낸다.</p>
            <p className="font-oneMobile">✔ 생각이 많아 집중하기 어렵다.</p>
          </TextBox>
          <TextArea className="mt-5 text-justify">
            이 항목에 많이 체크할수록, 몸과 마음의 반응을 인식하지 못할 가능성이
            큽니다. 이런 경우, <ImporText className="!mx-0">명상</ImporText>이
            도움이 됩니다.{" "}
          </TextArea>
          <TextArea className="mt-5 text-justify">
            혹은 해당 사항이 많지 않더라도,{" "}
            <ImporText className="!mx-0">명상</ImporText>은 마음을 잘 다스리고
            필요한 것을 찾을 용기를 줄 것입니다.
          </TextArea>
          <TextArea className="mt-5 text-justify">
            <ImporText className="!mx-0">명상</ImporText>은 몸의 반응, 떠오르는
            생각, 느끼는 감정, 주변 환경을 인식하게 도와줍니다. 또한 마음을
            진정시키는 데 도움을 줍니다.
          </TextArea>
        </>
      )}
      <VideoComponent onComplete={props.onComplete} />
    </>
  );
}
