import Footer from "../../component/Footer";
import TextArea from "../../../component/Layout/TextArea";
import Bubble from "../../component/Bubble";
import MentalButton from "../../component/MentalButton";
import MissionTitle from "../../../component/Layout/MissionTitle";

export default function Step13(props: { onSave: () => void }) {
  return (
    <>
      <Bubble className="mt-5 mb-5" type={"type3"}>
        <p className="mb-1.5">카마 코치의 요약</p>
      </Bubble>
      <MissionTitle>수고하셨어요.</MissionTitle>

      <TextArea className="mt-5 text-justify">
        장루는 이롭기도 하지만 스트레스를 주기도 해요. 장루 관리법을 잘 이해하고
        스트레스를 조절할 수 있다면 더욱 멋진 삶을 살 수 있을거에요! <br />
        그때까지 언제나 카마코치가 함께할게요
      </TextArea>
      <MentalButton onClick={props.onSave}>완료</MentalButton>

      <Footer />
    </>
  );
}
