import Footer from "../../component/Footer";
import TextArea from "../../../component/Layout/TextArea";
import Bubble from "../../component/Bubble";
import MentalButton from "../../component/MentalButton";
import TextBox from "../../../component/Layout/TextBox";
import ImporText from "../../component/ImportText";
import useAccountName from "@/hooks/useAccountName";

export default function Step5(props: { onSave: () => void }) {
  const accountName = useAccountName();
  return (
    <>
      <Bubble className="mt-5 mb-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>

      <TextBox className="mt-5 text-justify">
        유방암으로 인해 <ImporText className="!mx-0">'여성'</ImporText>
        으로서의 성기능이나 파트너와의 친밀감이 약해져 우울하고 위축될 수
        있어요.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        하지만 <ImporText className="!mx-0">{accountName}</ImporText>님은 늘
        존중받을만하고 여전히 소중한 사람이에요.
      </TextArea>
      <TextArea className="mt-5 text-justify">
        마음근육훈련의 <ImporText className="!mx-0">"나 말하기 기법"</ImporText>
        으로 관계가 더욱 돈독해지길 언제나 카마코치가 응원합니다.
      </TextArea>

      <MentalButton onClick={props.onSave}>완료</MentalButton>

      <Footer />
    </>
  );
}
