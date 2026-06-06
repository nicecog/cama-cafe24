import useAccountName from "@/hooks/useAccountName";
import ImporText from "../../../component/ImportText";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";

export default function Step3() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="intro">안녕하세요!</Hello>

      <TextArea className="mt-5 text-justify">
        전 <ImporText className="!mx-0">{accountName}</ImporText>님의 마음근육을
        키워줄 카마코치에요.
      </TextArea>
      <TextArea className="text-justify">
        저와 함께 건강한 마음으로 암 여정을 슬기롭게 헤쳐 나가 보아요.
      </TextArea>
    </>
  );
}
