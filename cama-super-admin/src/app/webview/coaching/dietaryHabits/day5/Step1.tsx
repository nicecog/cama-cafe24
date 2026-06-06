import NextButton from "@/app/webview/coaching/component/Layout/NextButton";
import MainCard from "@/app/webview/coaching/component/Layout/MainCard";
import TextBox from "@/app/webview/coaching/component/Layout/TextBox";
import ConfrimAnswerButton from "@/app/webview/coaching/component/Layout/Buttons/ConfirmAnswerButton";
import useAccountName from "@/hooks/useAccountName";
import TextArea from "@/app/webview/coaching/component/Layout/TextArea";
import Message from "@/app/webview/coaching/component/Message";
import { useState } from "react";
import useAlert from "@/hooks/useAlert";
import ImporText from "../../mental/component/ImportText";
// Day1
export default function Day2Step1(props: any) {
  // Props
  const { data, onChange, onNext } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const { alert } = useAlert();

  // 다음 선택
  const onNextHandler = () => {
    if (!data) {
      alert("답변을 선택해 주십시오.");
      return;
    }
    setVisible(true);
  };

  const accountName = useAccountName();

  return (
    <>
      <MainCard type="question" coachingType="B">
        <TextBox className="mt-5 text-justify">
          오늘은 규칙적인 식사에 대해서 알아보기로 해요.
        </TextBox>
        <TextArea className="my-10 text-justify tracking-tighter">
          최근 1주일을 돌아봤을 때{" "}
          <ImporText className="mr-0">{accountName}</ImporText>님은 하루 세번의
          식사를 규칙적으로 하고 있나요 ?
        </TextArea>
        <ConfrimAnswerButton onChange={onChange} value={data} />
      </MainCard>

      <NextButton onNext={onNextHandler} />
      <Message
        visible={visible}
        onClose={() => setVisible(false)}
        height={data === "예" ? "h-[33dvh]" : "h-[54dvh]"}
        onOk={onNext}
      >
        {data === "예" ? (
          <>
            <h1 className="text-[#774F2D] font-bold text-[20px] text-center mb-10 mt-5 ">
              규칙적으로 식사를 하고 <br />
              있다니 다행이에요.
            </h1>
            <div className="text-[19px] font-bold">
              규칙적인 식사가 어떤 점에서 좋은지 한 번 살펴볼게요.
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[#774F2D] font-bold text-[20px] text-center mb-5 mt-5 ">
              식사를 규칙적으로 하시는 게 어려우신가 봐요.
            </h1>
            <div className="text-[19px] font-bold">
              하지만 규칙적인 식사는 건강 회복에 매우 중요하답니다. <br />
              <br />
              하루에 세 끼를 먹기 어렵거나 많이 먹지 못할 때는 정해진 횟수보다는
              자주, 언제든지, 좋아하는 음식을 드시는 데 초점을 맞추는 게 좋아요.
            </div>
          </>
        )}
      </Message>
    </>
  );
}
