import useAlert from "@/hooks/useAlert";
import TextBox from "../../../component/Layout/TextBox";
import CheckAnswers from "../../component/CheckAnswers";
import Footer from "../../component/Footer";
import { getStepAnswerData, nextStepAtom, selectAnswerAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import Bubble from "../../component/Bubble";
import { StepType } from "../CardTypes";

const list = [
  {
    label: <>스스로에게 엄격하고 깐깐하다.</>,
    value: "스스로에게 엄격하고 깐깐하다.",
  },
  { label: <>늘 조급하거나 산만하다.</>, value: "늘 조급하거나 산만하다." },
  {
    label: <>의도와 다르게 버럭 화를 낸다.</>,
    value: "의도와 다르게 버럭 화를 낸다.",
  },
  {
    label: <>생각이 많아 집중하기가 어렵다.</>,
    value: "생각이 많아 집중하기가 어렵다.",
  },
  {
    label: <>내가 뭘 원하는지 잘 모르겠다.</>,
    value: "내가 뭘 원하는지 잘 모르겠다.",
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

  return (
    <>
      <Bubble className="text-center">{props.title}</Bubble>
      <TextBox className="mt-5">
        평소 당신은 어떤가요? <br />
        해당되는 것에 모두 체크해 보세요.
      </TextBox>

      <CheckAnswers list={list} data={stepAnswer} onChange={onClick} />
      <Footer onPrev={props.onPrev} onNext={onNextHandler} />
    </>
  );
}
