import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import { FcAbout } from "react-icons/fc";
import Advice from "@/assets/images/character/advice1.png";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import ImageBox from "../../../component/ImageBox";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step8() {
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
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'결과가 대체로 좋다니 성공이야.'</ImporText>
                </div>
                라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요.
              </TextBox>

              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'또 기다려야한다니.'</ImporText>
                </div>
                라는 생각은 낙담하거나 실망감, 지치는 느낌, 불안하고 초조함 등을
                느끼게 할 수 있어요.
              </TextBox>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>
                    '하나가 좋지 않다니, 내 노력이 모두 실패한거야.'
                  </ImporText>
                </div>
                라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수도
                있어요.
              </TextBox>
            </>
          ),
          ["순응형"]: (
            <>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>
                    '어쩔 수 없지만 앞으로 어떻게 할지 찾아봐야겠어.'
                  </ImporText>
                </div>
                라고 생각하면 의욕적이고 희망적인 기분이 들 수 있어요.
              </TextBox>

              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'이미 암에 걸린걸 되돌릴 수 없잖아'</ImporText>
                </div>
                라는 생각이 들면 낙담하거나 포기하고 싶어질 수 있어요.
              </TextBox>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>
                    암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어.
                  </ImporText>
                </div>
                라는 생각은 절망스럽거나 좌절감, 무력한 기분을 느끼게 할 수
                있어요.
              </TextBox>
            </>
          ),
          ["억압형"]: (
            <>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'결과가 대체로 좋다니 성공이야.'</ImporText>
                </div>
                라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요.
              </TextBox>

              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'나쁜 이야기일거야 듣고 싶지 않아.'</ImporText>
                </div>
                라는 생각은 걱정하게 하거나 불안하고 초조해지게 만들 수 있어요.
              </TextBox>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>치료가 실패했나봐.</ImporText>
                </div>
                라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수 있어요.
              </TextBox>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'결과가 대체로 좋다니 성공이야.'</ImporText>
                </div>
                라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요.
              </TextBox>

              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'또 기다려야한다니.'</ImporText>
                </div>
                라는 생각은 낙담하거나 실망감, 지치는 느낌, 불안하고 초조함 등을
                느끼게 할 수 있어요.
              </TextBox>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>
                    '하나가 좋지 않다니, 내 노력이 모두 실패한거야.'
                  </ImporText>
                </div>
                라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수도
                있어요.
              </TextBox>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'결과가 대체로 좋다니 성공이야.'</ImporText>
                </div>
                라는 생각이 들면 안심되거나 희망적인 기분이 들 수 있어요.
              </TextBox>

              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>'또 기다려야한다니.'</ImporText>
                </div>
                라는 생각은 낙담하거나 실망감, 지치는 느낌, 불안하고 초조함 등을
                느끼게 할 수 있어요.
              </TextBox>
              <TextBox className="mt-5 text-justify ">
                <div className="flex items-center gap-1 ">
                  <FcAbout className="text-f7 mr-1" />
                  <ImporText>
                    '하나가 좋지 않다니, 내 노력이 모두 실패한거야.'
                  </ImporText>
                </div>
                라고 생각하면 슬퍼지거나 화가 나기도 하고 절망스러울 수도
                있어요.
              </TextBox>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
