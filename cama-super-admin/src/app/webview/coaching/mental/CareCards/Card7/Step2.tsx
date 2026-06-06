import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import MissionTitle from "../../../component/Layout/MissionTitle";
export default function Step2() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  text-justify">
        이런 불안 덕분에 검진이나 건강 관리도 열심히 하고, 미리 대비할 수 있는
        긍정적인 효과도 있어요.
      </TextArea>
      <TextArea className="mt-5  text-justify">
        다만, 재발 불안 때문에 일상생활에 지장이 생긴다면 정작 내게 중요하고
        의미있는 것을 놓칠 수 있지요.
      </TextArea>
      <TextBox className="mt-5 text-justify  ">
        <MissionTitle className="my-5">
          불안이 엄습할 때 대처하는 <br />
          나만의 방법을 알고 있나요?
        </MissionTitle>
        불안을 잘 다스리면, 몸도 마음도 편안하고 일상에서 의미있고 중요한 일에
        집중하며 더 가치 있는 삶을 살아갈 수 있어요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
