import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

export default function Step4() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="result">
        <span className="text-camaColor">'걱정형'</span>의 {accountName}님!
      </Hello>

      <TextBox className="mt-5 text-justify">
        걱정스러운 마음에 끊임없이 인터넷에서 정보를 검색하고 있나요? <br />
        그럼에도 불안이 계속된다면 주치의에게 직접 궁금한 것들을 물어보세요.
      </TextBox>
      <TextArea className="text-justify">
        그리고 주의를 다른 곳으로 돌려보세요. <br />
        나를 즐겁고 편안하게 만들어주는 일에 집중하는 것이 도움돼요.
      </TextArea>
    </>
  );
}
