import TextBox from "../../../component/Layout/TextBox";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextArea from "../../../component/Layout/TextArea";
import ImporText from "../../component/ImportText";
import Bubble from "../../component/Bubble";
import useMentalType from "@/hooks/useMentalType";
// 나 말하기 기법
export default function Step6() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();

  return (
    <>
      <Bubble type="type3">카마코치의 요약</Bubble>
      <TextBox className="mt-5">
        {
          {
            ["전투형"]: (
              <>
                늘 전투태세인 <ImporText>'전투형'</ImporText> 당신에게 꼭 필요한
                건 마음의 휴식!
              </>
            ),
            ["순응형"]: <>오늘은 복식호흡 훈련을 해보았어요.</>,
            ["억압형"]: (
              <>스트레스를 피하려고 애쓰는 억압형에게 휴식과 이완은 중요해요.</>
            ),
            ["자포자기형"]: (
              <>
                무기력한 당신을 위해, 마음이 쉴 수 있는 복식호흡 훈련을
                해보았어요.
              </>
            ),
            ["걱정형"]: (
              <>
                늘 긴장중인 <ImporText>'걱정형'</ImporText> 당신에게 꼭 필요한
                건 편안한 느낌!
              </>
            ),
          }[type]
        }
      </TextBox>
      <TextArea className="mt-5">
        {type !== "자포자기형" && (
          <>
            오늘은 <ImporText className="!mx-0">복식호흡</ImporText> 훈련을
            해보았어요.
          </>
        )}
      </TextArea>
      <TextArea className="mt-5 text-justify">
        마음이 편안해지는 것을 느끼셨나요?
        <br /> 잘 못하셔도 괜찮아요.
        <br /> <ImporText className="!mx-0 !ml-0">복식호흡</ImporText>이
        익숙해지는 그 날까지, 카마코치가 함께할게요.
      </TextArea>
      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
