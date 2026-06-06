import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import Advice from "@/assets/images/character/advice1.png";
import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import MissionTitle from "../../../component/Layout/MissionTitle";
export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5  text-justify  mb-5">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        암 진단부터 치료 과정 동안, 당신은 이미 많은 두려움과 고통에 맞서
        여기까지 왔을 거에요.
      </TextBox>
      <MissionTitle>고생 많으셨어요!</MissionTitle>
      <TextArea className="mt-5 text-justify  ">
        그래도 한편엔 안심할 수 없는 마음이 늘 살아 있으시지요.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        앞으로는 내게 그러한 위협이 없길 바라며, 사소한 재발의 증거에도 촉각을
        곤두세우며 민감하게 나를 지키려는 마음이에요.
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
