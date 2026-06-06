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
      <TextArea className="mt-5">암 재발이 내게는 이런 의미이군요.</TextArea>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText className="tracking-tighter">
            '힘든 치료과정을 또 겪어야 한다니...'
          </ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          치료 과정이 정말 힘들었어. 다시는 하고 싶지 않아.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'재발하면 죽는거 아닌가?'</ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          죽을지도 모른다는 사실이 두려워.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <FcAbout className="text-f7 mr-1" />
          <ImporText>'가족들에게 미안해.'</ImporText>
        </div>
        <div className="pt-2 tracking-tighter">
          <p className="tracking-tighter">
            가족들의 고생이 안타깝고 희망을 전하고 싶어.
          </p>
          <p className="tracking-tighter pt-2">
            그건 내가 가족들을 많이 사랑한다는 뜻이야.
          </p>
        </div>
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
