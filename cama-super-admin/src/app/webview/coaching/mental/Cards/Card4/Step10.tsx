import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextArea from "../../../component/Layout/TextArea";
import TextAreaTitle from "../../../component/Layout/Titles/TextAreaTitle";
import ImageBox from "../../../component/ImageBox";
import Advice from "@/assets/images/character/advice1.png";
import useMentalType from "@/hooks/useMentalType";
import ImporText from "../../component/ImportText";
// 생각 바꾸기
export default function Step10() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();
  return (
    <>
      <ImageBox
        imgSrc={Advice}
        className="w-[110px] mt-5"
        containerClassName="!mb-5"
      />

      {
        {
          ["전투형"]: (
            <>
              <TextArea className=" text-justify tracking-tighter">
                <TextAreaTitle>부정적 결과를 예상하기</TextAreaTitle>
                주치의는 경과를 지켜보자고 했을 뿐인데, 결과를 '좋지 않다',
                '실패'라고 해석했지요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>과장하기/축소하기</TextAreaTitle>
                그리고 대체로 <ImporText>'결과가 좋다'</ImporText>는 평가는
                축소하고 있어요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>흑백논리</TextAreaTitle>
                설사 하나의 검사 결과가 나쁘다고 해도, 그동안의 노력이 모두
                실패인 것은 아니에요.
              </TextArea>
            </>
          ),
          ["순응형"]: (
            <>
              <TextArea className=" text-justify tracking-tighter">
                <TextAreaTitle>흑백논리</TextAreaTitle>
                암에 걸리냐 걸리지 않느냐로만 보는 시각이에요. 암에 걸리기
                이전으로 되돌아갈 수 없어도, 암을 잘 치료하고 행복한 삶을 살아갈
                수 있어요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>지나친 일반화</TextAreaTitle>
                암에 걸린 일은 내 노력으로 통제할 수 없었지만, 내가 할 수 있는
                다른 일들이 있어요.
              </TextArea>
            </>
          ),
          ["억압형"]: (
            <>
              <TextArea className=" text-justify tracking-tighter">
                <TextAreaTitle>부정적 결과를 예상하기/지레짐작</TextAreaTitle>
                주치의는 경과를 지켜보자고 했을 뿐인데, 그 결과를 나쁠거라고
                예상하지요. 또 어떤 면에서는 아직 결과를 확인하지 않고
                지레짐작하는 것일 수도 있어요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>과장하기/축소하기</TextAreaTitle>
                그리고 대체로 <ImporText>'결과가 좋다'</ImporText>는 평가는
                축소하고 있어요.
              </TextArea>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextArea className=" text-justify tracking-tighter">
                <TextAreaTitle>부정적 결과를 예상하기</TextAreaTitle>
                주치의는 경과를 지켜보자고 했을 뿐인데, 결과를 '좋지 않다',
                '실패'라고 해석했지요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>과장하기/축소하기</TextAreaTitle>
                그리고 대체로 <ImporText>'결과가 좋다'</ImporText>는 평가는
                축소하고 있어요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>흑백논리</TextAreaTitle>
                설사 하나의 검사 결과가 나쁘다고 해도, 그동안의 노력이 모두
                실패인 것은 아니에요.
              </TextArea>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextArea className=" text-justify tracking-tighter">
                <TextAreaTitle>부정적 결과를 예상하기</TextAreaTitle>
                주치의는 경과를 지켜보자고 했을 뿐인데, 결과를 '좋지 않다',
                '실패'라고 해석했지요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>과장하기/축소하기</TextAreaTitle>
                그리고 대체로 <ImporText>'결과가 좋다'</ImporText>는 평가는
                축소하고 있어요.
              </TextArea>
              <TextArea className="mt-5 text-justify tracking-tighter">
                <TextAreaTitle>흑백논리</TextAreaTitle>
                설사 하나의 검사 결과가 나쁘다고 해도, 그동안의 노력이 모두
                실패인 것은 아니에요.
              </TextArea>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
