import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Wait from "../Component/Wait";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <Wait type="advice3" className="mt-5" />
      <TextBox className="mt-5   text-justify">
        만약 잠에 들기 어렵거나, 자다 중간에 자꾸 깨거나, 아침에 일어나는 게
        몹시 힘든 날이 계속된다면 <ImporText>전문가</ImporText>의 도움을
        받아보세요.
      </TextBox>
      <TextArea className="mt-5  text-justify">
        <MissionTitle>단지 피로의 문제가 아닐 수 있어요!</MissionTitle>
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
