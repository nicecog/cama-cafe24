import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import Type1Image from "@/assets/images/mental/61.png";
import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import { prevStepAtom } from "../../session_6/session6Atom";

export default function Step1() {
  // 이때만 7회기꺼
  const onPrev = useSetAtom(prevStepAtom);

  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5">
        <ImageBox imgSrc={Type1Image} className="w-[220px]" />

        <div>
          <p className="font-oneMobile text-camaColor1">
            "왜 이렇게 피곤하고 무기력하지?"
          </p>
          <p className="font-oneMobile text-camaColor1">"재미가 없어."</p>
          <p className="font-oneMobile text-camaColor1">"아… 힘이 없어…" </p>
          <p className="font-oneMobile text-camaColor1">
            "자꾸 깜빡깜빡하게 돼."
          </p>
          <p className="font-oneMobile text-camaColor1">
            "잠을 자도 피로가 풀리지 않아…"
          </p>
        </div>
      </TextBox>
      <TextArea className="mt-5 text-justify">
        혹시 암을 경험하며 유독 피로감을 느끼진 않으신가요? <br />
        피로감 때문에 일상생활에 지장이 있을 정도라 곤혹스러울 수도 있어요.
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
