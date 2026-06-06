import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

export default function Step4() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="result">
        <span className="text-camaColor">'순응형'</span>의 {accountName}님!
      </Hello>

      <TextArea className="mt-5 text-justify">
        암 진단은 어쩔 수 없지만, 내가 해낼 수 있는 것들이 있어요. 노력하면
        좋아질 수 있는 부분을 찾아 변화시켜 보아요.
      </TextArea>
      <TextBox className="text-justify">
        <p className="font-oneMobile text-camaColor1">* 운동 </p>
        <p className="font-oneMobile text-camaColor1">* 음식 조절 </p>
        <p className="font-oneMobile text-camaColor1">
          * 치료로 인한 부작용 관리 등
        </p>
      </TextBox>
    </>
  );
}
