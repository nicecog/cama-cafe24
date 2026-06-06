import ImageBox from "../../../component/ImageBox";
import TextBox from "../../../component/Layout/TextBox";
import Type1 from "@/assets/images/character/type1.png";
import Footer from "../../component/Footer";
import { useSetAtom } from "jotai";
import { nextStepAtom, prevStepAtom } from "../CardAtom";
import ImporText from "../../component/ImportText";
import TextArea from "../../../component/Layout/TextArea";
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
      <TextBox className="text-justify ">
        앞선 보기에 체크를 많이 할수록 자신의 몸과 마음의 반응을 자각하지 못할
        때가 많을 수 있어요. 그럴 땐{" "}
        <ImporText className="!mx-0 ml-1">명상</ImporText>이 도움돼요.
      </TextBox>

      <TextArea className="mt-5 text-justify">
        {
          {
            ["전투형"]: (
              <>
                특히나 열심히 암과 싸우는 중인{" "}
                <ImporText className="!mx-0">'전투형'</ImporText>의 사람들에게는
                마음의 휴식이 꼭 필요하답니다.
              </>
            ),
            ["순응형"]: (
              <>
                명상은 <ImporText className="!mx-0">'순응형'</ImporText>인 내가
                지금 이 순간에 필요한 것을 찾아 나설 수 있게 용기를 줄 거예요.
              </>
            ),
            ["억압형"]: (
              <>
                생각과 감정을 피하고 눌러두기 일쑤인{" "}
                <ImporText className="!mx-0">'억압형'</ImporText>의 경우,
                스스로에게 주의를 기울이도록 명상이 도와줄 수 있어요.
              </>
            ),
            ["자포자기형"]: (
              <>
                절망감에 휩싸여 꼼짝할 수 없는{" "}
                <ImporText className="!mx-0">'자포자기형'</ImporText>에게는
                무력감에서 벗어나 몸과 마음을 달랠 수 있는 방법이 필요해요.
              </>
            ),
            ["걱정형"]: (
              <>
                특히나 암에 대한 걱정이 많고 불안한{" "}
                <ImporText className="!mx-0">'걱정형'</ImporText>의 사람들에게는
                생각을 비워내는 것이 필요하지요. 신체 감각에 주의를 기울여
                집중하는 명상이 생각을 비워내는 하나의 방법이에요.
              </>
            ),
          }[type]
        }
      </TextArea>

      <Footer onNext={onNext} onPrev={onPrev} />
    </>
  );
}
