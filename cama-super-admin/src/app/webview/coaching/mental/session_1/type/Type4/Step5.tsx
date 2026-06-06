import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";

export default function Step5() {
  return (
    <>
      <TextBox className="text-justify">
        카마코치가 절망과 무력감을 느끼는 당신에게 희망의 에너지를 드릴게요.
        긍정적인 마음을 가질 수 있도록 도와드리겠습니다.
      </TextBox>
      <TextArea className="mt-5 text-justify">
        <p className="my-1.5">마음근육 프로그램은 총 7회로 진행됩니다.</p>
        <p className="my-1.5">앞으로 3주 동안, 두 번씩 만나게 됩니다.</p>
        6회 동안은 카마코치와 함께 마음 근육을 단단히 하는 방법을 배워볼 거예요.
        마지막 7회차에는 암종별로 생길 수 있는 어려움에 대처하는 방법을 연습해
        볼게요.
      </TextArea>
    </>
  );
}
