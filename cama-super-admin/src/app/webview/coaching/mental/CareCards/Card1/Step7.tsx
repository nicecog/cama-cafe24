import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import ImporText from "../../component/ImportText";
import Wait from "../Component/Wait";
import TextBox from "../../../component/Layout/TextBox";

export default function Step7() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextArea className="mt-5  tracking-tighter">
        <MissionTitle className="mb-2 !text-left">
          활동 일기를 써 보는 것은 어떨까요?
        </MissionTitle>
        꼭 해야 할 일을 적고, 정한 만큼만 하는거에요. 휴식 시간도 꼭 포함해야
        한다는 것, <br />
        잊지마세요!
      </TextArea>

      <Wait type="advice1" className="mt-3" />
      <TextBox className="mt-5 text-justify">
        휴식한다는 게 꼭 낮잠을 뜻하지는 않아요. <br />
        밤에 잘 자기 위해선 <ImporText>낮잠은 30분</ImporText> <br />
        이내가 좋아요.
      </TextBox>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
