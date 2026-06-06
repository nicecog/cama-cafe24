import useAlert from "@/hooks/useAlert";
import TextBox from "../../../component/Layout/TextBox";
import CheckAnswers from "../../component/CheckAnswers";
import Footer from "../../component/Footer";
import { getStepAnswerData, nextStepAtom, selectAnswerAtom } from "../CardAtom";
import { useAtomValue, useSetAtom } from "jotai";
import Bubble from "../../component/Bubble";
import { StepType } from "../CardTypes";

const list = [
  { label: <>늘 긴장되어 있다.</>, value: "늘 긴장되어 있다." },
  { label: <>신경성 두통이 있다.</>, value: "신경성 두통이 있다." },
  { label: <>목뒤와 어깨가 뻐근하다.</>, value: "목뒤와 어깨가 뻐근하다." },
  {
    label: <>스트레스를 받으면 소화가 잘 안된다.</>,
    value: "스트레스를 받으면 소화가 잘 안된다.",
  },
  { label: <>눈이 뻑뻑하다.</>, value: "눈이 뻑뻑하다." },
  { label: <>해당없음.</>, value: "해당없음." },
];

export default function Type1(props: StepType) {
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
        평소 당신의 몸은 어떠신가요 ? <br />
        해당되는 것에 모두 체크해 주세요.
      </TextBox>

      <CheckAnswers list={list} data={stepAnswer} onChange={onClick} />
      <Footer onPrev={props.onPrev} onNext={onNextHandler} />
    </>
  );
}
