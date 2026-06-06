import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import TextArea from "../../../component/Layout/TextArea";
import ImageBox from "../../../component/ImageBox";
import Images from "@/assets/images/mental/60.png";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import useMentalType from "@/hooks/useMentalType";
// 생각 바꾸기
export default function Step11() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();

  return (
    <>
      {
        {
          ["전투형"]: (
            <>
              <TextBox className="mt-5 text-center">
                <ImageBox
                  imgSrc={Images}
                  className="w-[200px]"
                  containerClassName="!mb-0"
                />
                중요한 건,
                <br />
                <ImporText className="!mx-0">
                  "생각에 오류가 있을 수 있다는 것"
                </ImporText>
                <br />을 아는 거에요. <br />
              </TextBox>
              <TextArea className="mt-5  tracking-tighter ">
                카마코치와 함께 생각의 균형을 잡아 보아요.
              </TextArea>
            </>
          ),
          ["순응형"]: (
            <>
              <TextBox className="mt-5 text-center">
                <ImageBox
                  imgSrc={Images}
                  className="w-[200px]"
                  containerClassName="!mb-0"
                />
                이렇게 생각에 오류가 있을 수 있다는 것을 깨닫는 것이 중요해요.
              </TextBox>
              <TextArea className="mt-5  tracking-tighter ">
                그럼 어떻게 바꿔볼 수 있을까요? <br />
                카마코치와 함께 생각의 균형을 잡아 보아요.
              </TextArea>
            </>
          ),
          ["억압형"]: (
            <>
              <TextBox className="mt-5 text-center">
                <ImageBox
                  imgSrc={Images}
                  className="w-[200px]"
                  containerClassName="!mb-0"
                />
                이렇게 생각에 오류가 있을 수 있다는 것을 깨닫는 것이 중요해요.
              </TextBox>
              <TextArea className="mt-5  tracking-tighter ">
                그럼 어떻게 바꿔볼 수 있을까요? <br />
                카마코치와 함께 생각의 균형을 잡아 보아요.
              </TextArea>
            </>
          ),
          ["자포자기형"]: (
            <>
              <TextBox className="mt-5 text-center">
                <ImageBox
                  imgSrc={Images}
                  className="w-[200px]"
                  containerClassName="!mb-0"
                />
                중요한 건,
                <br />
                <ImporText className="!mx-0">
                  "생각에 오류가 있을 수 있다는 것"
                </ImporText>
                <br />을 아는 거에요. <br />
              </TextBox>
              <TextArea className="mt-5  tracking-tighter ">
                카마코치와 함께 생각의 균형을 잡아 보아요.
              </TextArea>
            </>
          ),
          ["걱정형"]: (
            <>
              <TextBox className="mt-5 text-center">
                <ImageBox
                  imgSrc={Images}
                  className="w-[200px]"
                  containerClassName="!mb-0"
                />
                중요한 건,
                <br />
                <ImporText className="!mx-0">
                  "생각에 오류가 있을 수 있다는 것"
                </ImporText>
                <br />을 아는 거에요. <br />
              </TextBox>
              <TextArea className="mt-5  tracking-tighter ">
                카마코치와 함께 생각의 균형을 잡아 보아요.
              </TextArea>
            </>
          ),
        }[type]
      }

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
