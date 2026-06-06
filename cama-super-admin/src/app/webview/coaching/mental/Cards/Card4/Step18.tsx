import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
import TextArea from "../../../component/Layout/TextArea";
import { FcAbout, FcRight } from "react-icons/fc";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { useEffect } from "react";
// 생각 바꾸기
export default function Step18() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        <p className="mb-1">주치의의 표정을 보고</p>
        <p>어떤 생각이 떠올랐을까요?</p>
      </Bubble>

      <TextBox className="mt-5 text-justify">
        <MissionTitle className="!text-left  !text-camaColor">
          '결과가 안 좋은가?'
        </MissionTitle>
        <MissionTitle className="!text-left mt-1 !text-camaColor">
          '수치가 나빠진 게 틀림 없어.'
        </MissionTitle>
      </TextBox>
      <TextBox className="mt-2">카마코치와 함게 생각을 바꿔보아요.</TextBox>

      <TextArea className="mt-5">
        <div className="">
          <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
            <FcAbout className="text-f6" />
            <span className="mt-0.5">'결과가 안 좋은가?'</span>
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
          <FcRight className="text-f6" />
          <p className="text-camaColor1 mt-1.5">
            '주치의가 오늘 좀 피곤한가봐.'
          </p>
        </div>
      </TextArea>
      <TextArea className="mt-5">
        <div className="">
          <p className="flex items-center justify-start gap-1.5 text-camaColor font-oneMobile border-b pb-2">
            <FcAbout className="text-f6" />
            <span className="mt-0.5">'수치가 나빠진 게 틀림 없어.'</span>
          </p>
        </div>
        <div className="text-justify font-oneMobile flex items-center justify-start gap-2">
          <FcRight className="text-f6" />
          <p className="text-camaColor1 mt-1.5">
            '수치가 조금 안 좋아졌더라도 회복 할 수 있을거야.'
          </p>
        </div>
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
