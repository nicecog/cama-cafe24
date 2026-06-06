import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <MissionTitle className="mt-5">
        폐 수술 후 가슴의 통증을 느껴 <br />
        힘드시죠.
      </MissionTitle>
      <TextArea className="mt-5 text-justify">
        전보다 쉽게 숨이 차는 등 폐 기능이 저하되었다고 느낄 수 있어요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        이러한 기능 저하는 폐 절제로 생기는 변화입니다. 하지만, 시간이 경과하여
        잘 적응하면 일상생활은 문제 없이 하실 수 있어요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        카마앱에 있는 <ImporText className="!mx-0 !mr-1">복식호흡</ImporText>을
        연습해 보세요.
        <br />폐 기능을 살려주는 데 도움이 됩니다.
      </TextArea>
      <Footer onNext={onNext} />
    </>
  );
}
