import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import TextBox from "../../../component/Layout/TextBox";
import { FcAbout, FcRight } from "react-icons/fc";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  text-justify tracking-tighter">
        그럼 이번엔 대안적인 사고를 떠올려봐요. 함께해요!
      </TextArea>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <div>
            <FcAbout className="text-f7" />
          </div>
          <ImporText className="tracking-tighter">
            '힘든 치료과정을 또 겪어야 한다니...'
          </ImporText>
        </div>
        <div className="pt-2 flex items-center gap-1.5">
          <div>
            <FcRight className="text-[21px]" />
          </div>
          힘들지만 견뎌낼 수 있을거야.
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <div>
            <FcAbout className="text-f7" />
          </div>
          <ImporText>'재발하면 죽는거 아닌가?'</ImporText>
        </div>
        <div className="pt-2 flex items-stretch gap-1.5 justify-start">
          <div className="w-[25px] pt-1">
            <FcRight className="text-[21px]" />
          </div>
          <div className="flex flex-col  gap-1.5">
            <p className="">재발이라는 증거는 확실하지 않아.</p>
            <p>재발하더라도 치료할 수 있는 방법이 있어.</p>
          </div>
        </div>
      </TextBox>
      <TextBox className="mt-5 text-justify ">
        <div className="flex items-center gap-1  border-b pb-2">
          <div>
            <FcAbout className="text-f7" />
          </div>
          <ImporText>'가족들에게 미안해.'</ImporText>
        </div>
        <div className="pt-2 flex items-stretch gap-1.5">
          <div className="w-[25px] pt-1">
            <FcRight className="text-[21px]" />
          </div>
          <div className="flex flex-col   gap-1.5">
            <p>안타깝지만 우리 모두 열심히 노력했어.</p>
            <p>가족들이 날 위해 애쓰는 건 나를 사랑한다는 거야.</p>
          </div>
        </div>
      </TextBox>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
