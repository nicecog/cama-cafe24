import { useSetAtom } from "jotai";
import TextBox from "../../component/Layout/TextBox";
import Bubble from "../component/Bubble";
import Footer from "../component/Footer";
import { prevStepAtom, setCareTypeAtom } from "./session6Atom";
import useDiseaseName from "@/hooks/useDiseaseName";

// 버튼 라벨 타입
type ButtonLabel =
  | "피로감"
  | "암 재발 불안"
  | "우울감"
  | "불편감"
  | "장루"
  | "신체이미지"
  | "성생활의 불편함"
  | "수술 후 호흡 불편함"
  | "신체기능 저하";

// 질병 타입
type DiseaseName = "갑상선암" | "대장암" | "유방암" | "폐암";

// 버튼 구성 객체 타입
type ButtonConfig = {
  [key in DiseaseName]: ButtonLabel[];
};

const buttonConfig: ButtonConfig = {
  갑상선암: ["피로감", "암 재발 불안", "우울감"],
  대장암: ["장루", "암 재발 불안", "우울감"],
  유방암: ["신체이미지", "성생활의 불편함", "암 재발 불안", "우울감"],
  폐암: ["수술 후 호흡 불편함", "신체기능 저하", "암 재발 불안", "우울감"],
};
export default function Step2() {
  const diseaseName = useDiseaseName() as DiseaseName;

  const onPrev = useSetAtom(prevStepAtom);

  const setCare = useSetAtom(setCareTypeAtom);

  const buttonsToRender = buttonConfig[diseaseName] || [
    "암 재발 불안",
    "우울감",
    "수술 후 호흡 불편함",
  ];

  const onClick = (type: string) => () => {
    setCare(type);
  };

  return (
    <>
      <Bubble>
        <p>더 알아보고 싶은 내용을 </p>
        <p className="mt-1">선택해주세요.</p>
      </Bubble>

      <TextBox className="mt-5 text-justify">
        이제 실전에서 실제로 나와 같은 암을 겪는 사람들이 많이 겪는 심리적
        어려움들을 살펴보고, 마음근육을 활용해 보아요.
      </TextBox>
      <div className="flex justify-center items-center w-full">
        <div className="grid grid-cols-2 gap-2.5 mt-5 w-full">
          {buttonsToRender.map((buttonLabel) => (
            <button
              key={buttonLabel}
              className={
                "p-2 rounded-md bg-white  w-full   font-oneMobile text-camaColor1 border-camaColor1 border-2 text-[17.5px] hover:bg-camaColor1 hover:text-white "
              }
              onClick={onClick(buttonLabel)}
            >
              {buttonLabel}
            </button>
          ))}
        </div>
      </div>
      <Footer onPrev={onPrev} />
    </>
  );
}
