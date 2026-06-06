import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ImporText from "../../../component/ImportText";

export default function Step2() {
  const accountName = useAccountName();

  return (
    <>
      <TextArea className="mt-5 text-justify">
        <ImporText>{accountName}</ImporText>
        님은 정면돌파하는 유형이에요.
      </TextArea>
      <TextArea className="text-justify">
        이런 긍정적이고 적극적인 태도는 투병 과정과 예후에 좋은 영향을 줘요.
      </TextArea>
      <TextArea className="text-justify">
        하지만 암 치료는 낯설고 어렵기 때문에 힘들 때도 있고 좌절하거나 지칠수도
        있어요.
      </TextArea>
    </>
  );
}
