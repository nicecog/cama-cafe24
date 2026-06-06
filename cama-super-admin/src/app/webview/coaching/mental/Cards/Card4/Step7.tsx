import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";

import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
import Advice from "@/assets/images/character/advice1.png";
import ImageBox from "../../../component/ImageBox";

// 생각 바꾸기
export default function Step7() {
  //   Confirm

  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  return (
    <>
      <TextBox className="mt-5 text-justify ">
        <ImageBox
          imgSrc={Advice}
          className="w-[110px] mt-5"
          containerClassName="!mb-5"
        />
        어쩌면 다른 생각이 떠올랐을 수도 있어요. 중요한 건{" "}
        <ImporText className="!mx-0">머릿속에 생각이 떠올랐었다는 것</ImporText>
        을 알아차리는 거에요.
        <br />
      </TextBox>
      <TextArea className="mt-5 text-justify">
        매 순간 생각은 자동적으로 떠오르지만, 우리는 알아차리지 못할 때가 더
        많아요.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        그런데 같은 상황에서도 어떤 생각이 떠오르냐에 따라 기분이 매우 달라질 수
        있어요.
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
