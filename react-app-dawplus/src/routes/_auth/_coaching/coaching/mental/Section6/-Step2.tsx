import { useSetAtom } from "jotai";
import useDiseaseName from "@/hooks/useDiseaseName";
import TextBox from "../../component/Layout/-TextBox";
import Bubble from "../component/-Bubble";
import Footer from "../component/-Footer";
import { prevStepAtom, setCareTypeAtom } from "./-session6Atoms";

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

type DiseaseName = "갑상선암" | "대장암" | "유방암" | "폐암";

const buttonConfig: Record<DiseaseName, ButtonLabel[]> = {
  갑상선암: ["피로감", "암 재발 불안", "우울감"],
  대장암: ["장루", "암 재발 불안", "우울감"],
  유방암: ["신체이미지", "성생활의 불편함", "암 재발 불안", "우울감"],
  폐암: ["수술 후 호흡 불편함", "신체기능 저하", "암 재발 불안", "우울감"],
};

export default function Step2() {
  // 테스트 모드 플래그 (배포 시 false로 변경하면 원래 설정으로 자동 원복됩니다)
  const IS_TEST = false;

  const diseaseName = useDiseaseName() as DiseaseName;
  const onPrev = useSetAtom(prevStepAtom);
  const setCare = useSetAtom(setCareTypeAtom);

  const allButtons: ButtonLabel[] = [
    "피로감",
    "장루",
    "신체이미지",
    "성생활의 불편함",
    "수술 후 호흡 불편함",
    "신체기능 저하",
    "우울감",
    "암 재발 불안",
  ];

  const buttonsToRender = IS_TEST
    ? allButtons
    : buttonConfig[diseaseName] || [
        "암 재발 불안",
        "우울감",
        "수술 후 호흡 불편함",
      ];

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
      <div className="flex w-full items-center justify-center">
        <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
          {buttonsToRender.map((buttonLabel) => (
            <button
              key={buttonLabel}
              type="button"
              className="w-full rounded-2xl border-2 border-primary bg-white p-3 text-base font-extrabold text-primary transition-colors hover:bg-primary hover:text-white"
              onClick={() => setCare(buttonLabel)}
            >
              {buttonLabel}
            </button>
          ))}
        </div>
      </div>
      <Footer onPrev={onPrev} showNext={false} />
    </>
  );
}
