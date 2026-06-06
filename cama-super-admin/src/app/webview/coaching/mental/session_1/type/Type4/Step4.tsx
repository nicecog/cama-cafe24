import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ImporText from "../../../component/ImportText";

export default function Step4() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="result">
        <span className="text-camaColor">'자포자기형'</span>의 {accountName}님!
      </Hello>

      <TextBox className="mt-5 text-justify">
        <ImporText className="!ml-0">
          '하늘이 무너져도 솟아날 구멍이 있다'
        </ImporText>
        고 하지요.
      </TextBox>
      <TextArea className="text-justify">
        당장은 막막하더라도 내가 할 수 있는 것이 있어요, 카마코치와 함께 하나씩
        찾아보세요.
      </TextArea>
    </>
  );
}
