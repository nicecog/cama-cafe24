import { useAtom, useSetAtom } from "jotai";
import Infomation from "@/assets/images/character/infomation.png";
import {
  nextStepCdAtom,
  prevStepCdAtom,
  splitQuestionAtom,
} from "./session1Atom";

import LikertScale from "./LikertScale";
import useAlert from "@/hooks/useAlert";
import MentalButton from "../component/MentalButton";
import Footer from "../component/Footer";

export default function Step2() {
  const onNext = useSetAtom(nextStepCdAtom);
  const onPrev = useSetAtom(prevStepCdAtom);

  // ATOM
  const [atoms] = useAtom(splitQuestionAtom);

  // Confrim
  const { confirm } = useAlert();

  const onNexthandler = () => {
    confirm(
      {
        icon: "question",
        html: `체크리스트에 대한 답변을 <br/>모두 완료하셨나요?`,
      },
      () => {
        onNext();
      }
    );
  };

  return (
    <>
      <div className="px-[15px] py-5 flex justify-center flex-col gap-2">
        <div className="flex justify-center items-center gap-2 bg-white py-4 border-[#E8E8E8]  rounded-2xl border-[3px]">
          <img src={Infomation} alt="mission" className="h-[60px]" />
          <div>
            <p className=" font-gmarket text-[#969696] text-center">
              내 유형 확인하기
            </p>
            <p className=" font-oneMobile -mt-1 text-center text-camaColorLight">
              체크리스트에 답변해주세요
            </p>
          </div>
        </div>

        {atoms.map((item: any, index: number) => (
          <LikertScale index={index} key={index} itemAtom={item} />
        ))}

        <MentalButton onClick={onNexthandler}>유형 확인하기</MentalButton>
      </div>

      <Footer onPrev={onPrev} />
    </>
  );
}
