import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Hello from "../Component/Hello";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";

export default function Step4() {
  const accountName = useAccountName();

  return (
    <>
      <Hello type="result">
        <span className="text-camaColor">'억압형'</span>의 {accountName}님!
      </Hello>

      <TextArea className="mt-5 text-justify">
        불안하더라도 현재 상황을 있는 그대로 받아들이는 게 좋아요. 그리고 나면
        도움이 되는 것들을 하나씩 해 나갈 수 있어요.
      </TextArea>
      <TextBox className="text-justify">
        <p className="font-oneMobile text-camaColor1">
          * 치료에 필요한 정보 찾기{" "}
        </p>
        <p className="font-oneMobile text-camaColor1">* 조언 얻기 </p>
        <p className="font-oneMobile text-camaColor1">* 문제 해결하기</p>
        <p className="font-oneMobile text-camaColor1">* 기분 다스리기 등</p>
      </TextBox>
    </>
  );
}
