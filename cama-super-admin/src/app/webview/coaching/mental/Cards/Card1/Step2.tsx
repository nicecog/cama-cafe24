import ImageBox from "../../../component/ImageBox";
import TextArea from "../../../component/Layout/TextArea";
import TextBox from "../../../component/Layout/TextBox";
import Type1 from "@/assets/images/character/type1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import useMentalType from "@/hooks/useMentalType";
export default function Step2() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const type: string = useMentalType();

  return (
    <>
      <ImageBox
        imgSrc={Type1}
        className="w-[110px] mt-5"
        containerClassName="!mb-5"
      />
      <TextBox className="text-justify tracking-tighter ">
        앞선 보기에 많이 해당할수록 평소에 더 많이 긴장하거나 불안해하고 있다는
        뜻이에요.
      </TextBox>

      <TextArea className="text-justify tracking-tighter mt-5">
        {
          {
            ["전투형"]: (
              <>내 몸이 전투태세를 갖추느라 늘 긴장상태를 유지하는 것이지요.</>
            ),
            ["순응형"]: (
              <>
                모르는 척 하고 있어도, 몸과 마음은 스트레스를 받고 있는 것이지요
              </>
            ),
            ["억압형"]: (
              <>
                모르는 척 하고 있어도, 몸과 마음은 스트레스를 받고 있는
                것이지요.
              </>
            ),
            ["자포자기형"]: (
              <>
                혼란스럽고 낙담하게 되는 진단과 치료, 몸과 마음을 이완시켜 줄
                복식호흡을 소개할게요.
              </>
            ),
            ["걱정형"]: (
              <>
                암에 대한 걱정으로 마음이 꽉 차 있는 만큼, 몸도 늘 긴장하고 있는
                거예요.
              </>
            ),
          }[type]
        }
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
