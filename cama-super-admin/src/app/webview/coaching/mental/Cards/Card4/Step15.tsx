import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
import ImporText from "../../component/ImportText";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step15() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  const type: string = useMentalType();
  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        자, 다른 예도 살펴볼까요?
      </Bubble>

      {
        {
          ["전투형"]: (
            <>
              <TextBox className="mt-5 text-black font-semibold">
                치료를 잘 마치고 퇴원을 앞두고 있습니다. 그동안 의료진과
                함께여서 안심했었는데 이제는 혼자서 암과 싸워 나가야 한다니
                불현듯 기분이 우울해지고 맙니다.
              </TextBox>
            </>
          ),
          ["순응형"]: (
            <>
              <TextBox className="mt-5 text-black font-semibold">
                책을 읽다가 <ImporText className="font-thin">'재발'</ImporText>
                이라는 단어를 본 당신, 우울한 느낌에 책을 덮습니다.
              </TextBox>
            </>
          ),
          ["억압형"]: (
            <>
              <TextBox className="mt-5 text-black font-semibold">
                책을 읽다가 <ImporText className="font-thin">'재발'</ImporText>
                이라는 단어를 본 당신, 불안하고 초조한 마음이 들어 책을
                덮습니다.
              </TextBox>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextBox className="mt-5 text-black font-semibold">
                치료를 잘 마치고 퇴원을 앞두고 있습니다. 그동안 의료진과
                함께여서 안심했었는데 이제는 혼자서 암과 싸워 나가야 한다니
                불현듯 기분이 우울해지고 맙니다.
              </TextBox>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextBox className="mt-5 text-black font-semibold">
                책을 읽다가 <ImporText className="font-thin">'재발'</ImporText>
                이라는 단어를 본 당신, 불안하고 초조한 마음이 들어 책을
                덮습니다.
              </TextBox>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
