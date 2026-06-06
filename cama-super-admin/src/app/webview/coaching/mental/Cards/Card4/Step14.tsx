import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step14() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);
  const type: string = useMentalType();
  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        <p className="mb-1.5">어떠신가요?</p>
        <p>생각이 바뀌면 기분도</p>
        <p className="mt-1">달라지는 것을 느끼셨나요?</p>
      </Bubble>
      {
        {
          ["전투형"]: (
            <>
              <TextBox className="mt-5 text-justify">
                다른 방식으로 생각하면 기분을 바꿀 수 있어요.
              </TextBox>
            </>
          ),
          ["순응형"]: (
            <>
              <TextBox className="mt-5 text-justify">
                대안적으로 생각하면 기분을 바꿀 수 있습니다.
              </TextBox>
            </>
          ),
          ["억압형"]: (
            <>
              <TextBox className="mt-5 text-justify">
                대안적으로 생각하면 기분을 바꿀 수 있습니다.
              </TextBox>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextBox className="mt-5 text-justify">
                다른 방식으로 생각하면 기분을 바꿀 수 있어요.
              </TextBox>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextBox className="mt-5 text-justify">
                대안적으로 생각하면 기분을 바꿀 수 있습니다.
              </TextBox>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
