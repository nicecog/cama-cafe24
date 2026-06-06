import Footer from "../../component/Footer";
import { nextStepAtom, prevStepAtom } from "../CareCardAtom";
import { useSetAtom } from "jotai";
import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step8() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <MissionTitle>2. 규칙적으로 생활하기</MissionTitle>
      <TextArea className="mt-5">
        잠이 보약이라고 하지요. <br />
        잠을 잘 못 자면 피로가 악화될 수 있어요.
        <br />
      </TextArea>
      <TextArea className=" tracking-tighter">
        잠을 잘자기 위해서는 수면 습관이 중요해요.
      </TextArea>
      <TextArea className="mt-5 text-justify text-camaColor1">
        <p className="font-oneMobile">- 일정한 시각에 일어나고 잠들기</p>
        <p className="font-oneMobile">- 빛과 소음을 차단하기</p>
        <p className="font-oneMobile pl-2"> (암막 커튼 이용, 백색 소음 끄기)</p>
        <p className="font-oneMobile">- 카페인, 알코올, 담배 피하기</p>
        <p className="font-oneMobile">
          - 잠들기 전에 물은 너무 많이 마시지 않기
        </p>
        <p className="font-oneMobile">- 잠자리에는 졸릴 때만 눕기</p>
        <p className="font-oneMobile">
          - 잠들기 전에 흥분될 정도로 재밌는 활동
        </p>
        <p className="font-oneMobile pl-3.5">하지않기</p>
      </TextArea>
      <Footer onPrev={onPrev} onNext={onNext} />
    </>
  );
}
