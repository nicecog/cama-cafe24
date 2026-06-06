import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";

import MissionTitle from "../../../component/Layout/MissionTitle";
import infoImage from "@/assets/images/character/infoTitle.png";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step5() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();
  return (
    <>
      <MissionTitle className="mt-5 mb-10 flex gap-3 items-center justify-center">
        <img src={infoImage} className="w-[28px]" />
        예를 한 번 살펴볼까요?
      </MissionTitle>

      <TextBox className="mt-5 text-justify">
        {
          {
            ["전투형"]: (
              <>
                검사 결과를 확인하는 날, 주치의가
                <ImporText>
                  '결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'
                </ImporText>
                라고 말했어요.
                <br />그 이야기를 들은 나는 기분이 울적해졌어요.
              </>
            ),
            ["순응형"]: (
              <>
                검사 결과를 확인한 주치의는 내게
                <ImporText className="!mr-0">암</ImporText>
                이라고 말합니다. <br />
                어쩔 수 없는 일이라고 생각하며 내가 할 수 있는 건 없다고
                체념합니다.
              </>
            ),
            ["억압형"]: (
              <>
                검사 결과를 확인하는 날, 주치의는
                <ImporText>
                  결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같다{" "}
                </ImporText>
                고 말합니다.
                <br />
                다음 진료 때 병원에 오기가 싫어집니다.
              </>
            ),
            ["자포자기형"]: (
              <>
                검사 결과를 확인하는 날, 주치의가
                <ImporText>
                  '결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'
                </ImporText>
                라고 말했어요.
                <br />그 이야기를 들은 나는 기분이 울적해졌어요.
              </>
            ),
            ["걱정형"]: (
              <>
                검사 결과를 확인하는 날, 주치의가
                <ImporText>
                  '결과가 대체로 좋지만, 수치 한 가지는 경과를 봐야할 것 같아요'
                </ImporText>
                라고 말했어요.
                <br />그 이야기를 들은 나는 기분이 울적해졌어요.
              </>
            ),
          }[type]
        }
      </TextBox>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
