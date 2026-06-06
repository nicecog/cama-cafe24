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
  {
    label: <>거절하기가 어려워 참는 편이다.</>,
    value: "거절하기가 어려워 참는 편이다.",
  },
  {
    label: <>말을 하려고 하면 다툼이 일어난다.</>,
    value: "말을 하려고 하면 다툼이 일어난다.",
  },
  {
    label: <>상대방이 싫어할까봐 말하기 어렵다.</>,
    value: "상대방이 싫어할까봐 말하기 어렵다.",
  },
  {
    label: <>상처받아도 괜찮다며 묻어둔다.</>,
    value: "상처받아도 괜찮다며 묻어둔다.",
  },
  {
    label: <>상대방의 눈치가 보여 궁금한 것을 묻지 못한다.</>,
    value: "상대방의 눈치가 보여 궁금한 것을 묻지 못한다.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];
export default function Step1(props: StepType) {
  //   Confirm
  const { confirm } = useAlert();

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
      confirm("해당되는 항목이 없으신가요 ? ", () => {
        onNext();
      });
    } else {
      onNext();
    }
  };

  const accountName = useAccountName();

  return (
    <>
      <Bubble className="text-center">{props.title}</Bubble>
      <TextBox className="mt-5">
        평소 <ImporText>{accountName}</ImporText>님의 생각은 어떠신가요? <br />
        해당되는 것에 모두 체크해보아요.
      </TextBox>

      <CheckAnswers list={list} data={stepAnswer} onChange={onClick} />
      <Footer onNext={onNextHandler} />
    </>
  );
}
