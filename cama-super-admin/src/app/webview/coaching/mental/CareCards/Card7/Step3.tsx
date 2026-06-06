import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { FcAbout } from "react-icons/fc";

export default function Step3() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5 ">
        <MissionTitle className="mt-5 mb-8">
          나는 재발과 관련해 <br />
          무엇이 불안한가요?
        </MissionTitle>
        <p className="font-oneMobile my-2 flex justify-start items-center gap-1.5">
          <span>
            <FcAbout className="text-[22px]" />
          </span>
          힘든 치료 과정을 또 겪어야 한다니…
        </p>
        <p className="font-oneMobile my-2 flex justify-start items-center gap-1.5">
          <span>
            <FcAbout className="text-[22px]" />
          </span>
          재발하면 죽는거 아닌가?
        </p>
        <p className="font-oneMobile my-2 flex justify-start items-center gap-1.5">
          <span>
            <FcAbout className="text-[22px]" />
          </span>
          <span className="">열심히 노력했는데 실패네, 가족들에게 미안해.</span>
        </p>
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
