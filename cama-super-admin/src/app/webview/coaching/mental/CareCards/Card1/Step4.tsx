import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step1() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <MissionTitle>1. 에너지를 효율적으로 쓰기</MissionTitle>
      <TextArea className="mt-5  tracking-tighter">
        핸드폰으로 이것 저것 조금 검색했더니 금방 배터리가 닳아버릴 때가 있지요?
      </TextArea>
      <TextArea className="mt-5 text-justify">
        배터리를 아끼기 위해선 꼭 필요한 것들만 하고, 불필요한 것들을 삭제하고,
        충분히 충전해야하는 것처럼 우리 몸과 마음도 마찬가지에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        몸과 마음의 에너지가 고갈되지 않도록 자원을 효율적으로 써야하는
        것이지요.
      </TextArea>

      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
