import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import { FcAbout } from "react-icons/fc";
import ImporText from "../../component/ImportText";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  return (
    <>
      <TextArea className="mt-5">
        그리고 이런 생각이 숨어 있을 수 있어요.
      </TextArea>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText className="tracking-tighter">
            '힘든 치료과정을 또 겪어야 한다니...'
          </ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          치료 과정이 또 힘들거야. 견뎌낼 수 없을 거야.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'재발하면 죽는거 아닌가?'</ImporText>
        </div>
        <div className="pt-2 tracking-tighter">재발하면 끝이지 뭐.</div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'가족들에게 미안해.'</ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          열심히 노력했는데 실패야. 짐이 되는 것 같아.
        </div>
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
