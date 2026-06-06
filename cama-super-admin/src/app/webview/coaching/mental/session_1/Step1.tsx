import ImageBox from "../../component/ImageBox";

import Mental from "@/assets/images/mental/50.png";
import TextBox from "../../component/Layout/TextBox";
import MissionTitle from "../../component/Layout/MissionTitle";
import TextArea from "../../component/Layout/TextArea";
import { useSetAtom } from "jotai";
import { nextStepCdAtom } from "./session1Atom";
import MentalButton from "../component/MentalButton";

export default function Step1() {
  const nextStep = useSetAtom(nextStepCdAtom);

  return (
    <>
      <div className="px-[28px] py-5">
        <div>
          <TextBox className="mt-5  text-camaColor">
            <ImageBox
              imgSrc={Mental}
              className="w-[230px]"
              containerClassName="!mb-3"
            />
            <MissionTitle className="text-center mb-5">
              '내가 암이라니...'
            </MissionTitle>
            암 진단을 받고 어떠셨나요?
            <div className="mt-3 text-justify">
              혼란스럽고 슬프거나 화가 났을지도 모릅니다. 앞이 깜깜해 아무 것도
              할 수 없었을 수도 있고, 마음을 다잡은 채 치료 방법을 찾아 나섰을
              수도 있어요.
            </div>
            <div className="mt-3 text-justify">
              사람들은 암이라는 상황에 맞닥뜨리면 서로 다른 방식으로 반응하곤
              해요.
            </div>
            <div className="mt-3 text-justify">
              예상치 못한 스트레스 사건(암)을 다루기 위해 나만의 '대처 방식'을
              발휘한 결과이지요.
            </div>
          </TextBox>
          <TextArea className="text-justify mt-5">
            나는 어떻게 대처하는 사람인지, 암에 대한 나의 대처 유형을
            알아볼까요?
          </TextArea>

          <MentalButton onClick={nextStep}>유형 알아보기</MentalButton>
        </div>
      </div>
    </>
  );
}
