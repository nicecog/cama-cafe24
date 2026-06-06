import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import Bubble from "../../component/Bubble";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { FcPortraitMode } from "react-icons/fc";
import TextArea from "../../../component/Layout/TextArea";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step13() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();
  return (
    <>
      <Bubble className="mt-5" type={"advice2"}>
        <p>균형 잡힌 생각으로</p>
        <p className="mt-1">바꿔볼까요?</p>
      </Bubble>

      {
        {
          ["전투형"]: (
            <>
              <TextBox className="mt-4">
                <MissionTitle>
                  "하나가 좋지 않다니, 내 노력이 모두 실패한거야."
                </MissionTitle>
              </TextBox>

              <TextArea className="mt-3">
                <div className="flex items-center  gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    나머지가 좋았으니, 다음 결과도 좋을거야.
                  </p>
                </div>

                <div className="flex items-center gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter">
                    많은 것들이 좋아졌다니 희망적이야.
                  </p>
                </div>
                <div className="flex items-center gap-5 py-1 ">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.
                  </p>
                </div>
              </TextArea>
            </>
          ),
          ["순응형"]: (
            <>
              <TextBox className="mt-4">
                <MissionTitle>
                  "암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어."
                </MissionTitle>
              </TextBox>

              <TextArea className="mt-3">
                <div className="flex items-center  gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    내가 치료받을 병원을 결정하고, 치료 방법을 선택할 수 있어.
                  </p>
                </div>

                <div className="flex items-center gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  암환자이기도 하지만 나는 여전히 소중한 내 아이의 엄마/아빠야.
                </div>
              </TextArea>
            </>
          ),
          ["억압형"]: (
            <>
              <TextBox className="mt-4">
                <MissionTitle>
                  "나쁜 이야기일거야, 듣고 싶지 않아."
                </MissionTitle>
              </TextBox>

              <TextArea className="mt-3">
                <div className="flex items-center  gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    결과를 들어봐야 알 수 있어.
                  </p>
                </div>

                <div className="flex items-center gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter">
                    나머지가 좋았으니, 다음 결과도 좋을거야.{" "}
                  </p>
                </div>
                <div className="flex items-center gap-5 py-1 ">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    많은 것들이 좋아졌다니 희망적이야.
                  </p>
                </div>
              </TextArea>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextBox className="mt-4">
                <MissionTitle>
                  "하나가 좋지 않다니, 내 노력이 모두 실패한거야."
                </MissionTitle>
              </TextBox>

              <TextArea className="mt-3">
                <div className="flex items-center  gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    나머지가 좋았으니, 다음 결과도 좋을거야.
                  </p>
                </div>

                <div className="flex items-center gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter">
                    많은 것들이 좋아졌다니 희망적이야.
                  </p>
                </div>
                <div className="flex items-center gap-5 py-1 ">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.
                  </p>
                </div>
              </TextArea>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextBox className="mt-4">
                <MissionTitle>
                  "하나가 좋지 않다니, <br />내 노력이 모두 실패한거야."
                </MissionTitle>
              </TextBox>

              <TextArea className="mt-3">
                <div className="flex items-center  gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    나머지가 좋았으니, 다음 결과도 좋을거야.
                  </p>
                </div>

                <div className="flex items-center gap-5 py-1">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter">
                    많은 것들이 좋아졌다니 희망적이야.
                  </p>
                </div>
                <div className="flex items-center gap-5 py-1 ">
                  <FcPortraitMode className="text-[28px]" />
                  <p className="tracking-tighter text-justify  leading-6">
                    아쉽지만 최선을 다했어. 그 덕분에 결과가 좋네.
                  </p>
                </div>
              </TextArea>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
