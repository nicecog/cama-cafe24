import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";
import ImporText from "../../../component/ImportText";

export default function Step4() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="result">
        <span className="text-camaColor">'전투형'</span>의 {accountName}님!
      </Hello>

      <TextArea className="mt-5 text-justify">
        늘 애쓰고 노력하는 모습이 아니어도 괜찮아요. 아무리 뛰어난 전사라도
        휴식과 위로가 필요하거든요.
      </TextArea>
      <TextArea className="text-justify">
        <ImporText className="!mx-0">2보 전진을 위한 1보 후퇴</ImporText>처럼,
        전략적으로 나를 돌보세요.
      </TextArea>
      <TextArea className="text-justify tracking-tighter">
        몸과 마음이 지칠 땐 잠시 쉬어가도 괜찮아요.
      </TextArea>
    </>
  );
}
