import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import Advice from "@/assets/images/character/advice1.png";
import ImageBox from "../../../component/ImageBox";
import { FcAbout, FcDownRight } from "react-icons/fc";

export default function Step1() {
  const onPrev = useSetAtom(prevStepAtom);
  const onNext = useSetAtom(nextStepAtom);

  return (
    <>
      <TextBox className="mt-5 tracking-tighter">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        마음근육훈련에서 배운 방법으로 생각을 바꿔볼까요?
      </TextBox>
      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            '사람들이 냄새난다고 싫어할거야.'
          </p>
        </div>

        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcDownRight className="text-f7" />
          <p className="text-camaColor1">
            "가까운 사람들은 사정을 알면 <br />
            이해해줄거야."
          </p>
        </div>
      </TextBox>
      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            '터지면 어떡하지, <br />
            외출을 안 하는게 나아.'
          </p>
        </div>

        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcDownRight className="text-f7" />
          <p className="text-camaColor1">
            "미리 관리를 잘 하면 터지지 <br /> 않을 수 있어."
          </p>
        </div>
      </TextBox>
      <TextBox className="mt-5">
        <div className="mb-2 ">
          <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
            <FcAbout className="text-f7" />
            '장루 때문에 성적으로 매력이 <br /> 없을거야.'
          </p>
        </div>

        <div className="text-justify font-oneMobile flex items-center justify-start gap-1.5">
          <FcDownRight className="text-f7" />
          <p className="text-camaColor1">
            "장루도 내 몸의 일부이니 자연스럽게 봐 줄거야."
          </p>
        </div>
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
