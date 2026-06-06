import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import Advice from "@/assets/images/character/advice1.png";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import useMentalType from "@/hooks/useMentalType";
// 나 말하기 기법
export default function Step5() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();

  return (
    <>
      <TextBox className="mt-5 text-justify ">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        그런데 생각은 때때로 <ImporText className="!mx-0">오류</ImporText>를
        범해요.
        <br />
        예시를 다시 살펴볼게요.
      </TextBox>

      <TextArea className="mt-5 text-justify">
        {
          {
            ["전투형"]: (
              <>
                <MissionTitle className="!pt-3 mb-2">
                  "하나가 좋지 않다니, <br />내 노력이 모두 실패한거야."
                </MissionTitle>
                이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께 오류를
                찾아 보아요.
              </>
            ),
            ["순응형"]: (
              <>
                <MissionTitle className="!pt-3 mb-2">
                  "암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어."
                </MissionTitle>
                이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께 오류를
                찾아 보아요.
              </>
            ),
            ["억압형"]: (
              <>
                <MissionTitle className="!pt-3 mb-2">
                  "나쁜 이야기일거야, <br />
                  듣고 싶지 않아."
                </MissionTitle>
                이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께 오류를
                찾아 보아요.
              </>
            ),
            ["자포자기형"]: (
              <>
                <MissionTitle className="!pt-3 mb-2">
                  "하나가 좋지 않다니, <br />내 노력이 모두 실패한거야."
                </MissionTitle>
                이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께 오류를
                찾아 보아요.
              </>
            ),
            ["걱정형"]: (
              <>
                <MissionTitle className="!pt-3 mb-2">
                  "하나가 좋지 않다니, <br />내 노력이 모두 실패한거야."
                </MissionTitle>
                이 생각에는 어떤 오류들이 숨어있을까요? 카마 코치와 함께 오류를
                찾아 보아요.
              </>
            ),
          }[type]
        }
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
