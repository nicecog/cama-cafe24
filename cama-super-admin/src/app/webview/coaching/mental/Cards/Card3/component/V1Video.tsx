import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import ImporText from "../../../component/ImportText";

// 호흡명상
export default function V1Video() {
  return (
    <>
      <TextArea className="mt-5 text-justify ">
        가만히 눈을 감고 마음의 눈으로 호흡을 관찰합니다.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        코로 숨이 들어가고 나오는 것을 느껴 봅니다.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        들이쉴 때 콧속으로 공기가 들어가고 내쉴 때 나오는 숨의 따뜻함을
        느껴봅니다.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        호흡을 알아차리는 <ImporText>'옳은'</ImporText> 방식은 없다는 사실을
        기억하세요.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        <ImporText>'지금 호흡을 잘하고 있다, 못하고 있다'</ImporText>는 생각이나
        평가 없이, 현재 숨 쉬고 있는 그대로 내버려 두세요.
      </TextArea>
      <TextArea className="mt-5 text-justify ">
        그저 파도가 밀려왔다 가는 것처럼, 호흡이 들어오고 나가는 것을
        느껴봅니다.
      </TextArea>
    </>
  );
}
