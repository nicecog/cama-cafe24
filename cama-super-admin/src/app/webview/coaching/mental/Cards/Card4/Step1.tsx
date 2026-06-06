import useAlert from "@/hooks/useAlert";
import TextBox from "../../../component/Layout/TextBox";
import CheckAnswers from "../../component/CheckAnswers";
import Footer from "../../component/Footer";
import { getStepAnswerData, nextStepAtom, selectAnswerAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import Bubble from "../../component/Bubble";
import { StepType } from "../CardTypes";
import useAccountName from "@/hooks/useAccountName";
import ImporText from "../../component/ImportText";

const list = [
  { label: <>나는 실패자다.</>, value: "나는 실패자다." },
  {
    label: <>내 인생은 내가 원하는 대로 흘러가고 있지 않다.</>,
    value: "내 인생은 내가 원하는 대로 흘러가고 있지 않다.",
  },
  {
    label: <>도대체 나에게 무엇이 문제란 말인가?</>,
    value: "도대체 나에게 무엇이 문제란 말인가?",
  },
  {
    label: <>나는 미래에 대한 희망이 없다.</>,
    value: "나는 미래에 대한 희망이 없다.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];

// 생각 바꾸기
export default function Step1(props: StepType) {
  //   Confirm
  const { alert } = useAlert();

  const stepAnswer = useAtomValue(getStepAnswerData);

  const onNext = useSetAtom(nextStepAtom);

  const selectAnswer = useSetAtom(selectAnswerAtom);

  //   답안 선택
  const onClick = (e: string) => {
    selectAnswer(e);
  };

  //   다음 선택
  const onNextHandler = () => {
    if (stepAnswer.length === 0) {
      alert("항목을 선택해 주세요.");
      return;
    }
    onNext();
  };

  // 사용자명
  const accountName = useAccountName();
  return (
    <>
      <Bubble className="text-center">{props.title}</Bubble>
      <TextBox className="mt-5">
        평소 <ImporText>{accountName}</ImporText>님의 생각은 어떠신가요?
        <br />
        해당되는 것에 모두 체크해 보아요.
      </TextBox>

      <CheckAnswers list={list} data={stepAnswer} onChange={onClick} />
      <Footer onNext={onNextHandler} />
    </>
  );
}
