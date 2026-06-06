import Footer from "../../component/Footer";
import { useAtomValue, useSetAtom } from "jotai";
import {
  answersAtom,
  getStepAnswerData,
  prevStepAtom,
  selectAnswerRadioAtom,
} from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";
import MissionTitle from "../../../component/Layout/MissionTitle";
import { ChangeEvent, useMemo } from "react";
import TextArea from "../../../component/Layout/TextArea";
import Inputs from "../../../component/Inputs";
import MentalButton from "../../component/MentalButton";
import { CardType } from "../CardTypes";
import useAlert from "@/hooks/useAlert";

const listData = [
  {
    value: "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    component: (
      <>
        검사 결과가 대체로 좋지만, <br />
        수치 하나는 경과를 지켜보자고 할 때
      </>
    ),
  },
  {
    value: "퇴원을 앞두고 혼자라는 생각이 들 때",
    component: (
      <>
        퇴원을 앞두고 혼자라는 <br />
        생각이 들 때
      </>
    ),
  },
  {
    value: " 암 진단을 받았을 때",
    component: <> 암 진단을 받았을 때</>,
  },
  {
    value: "책을 읽다가 '재발'이라는 단어를 봤을 때",
    component: (
      <>
        책을 읽다가 '재발'이라는 <br />
        단어를 봤을 때
      </>
    ),
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의 의 표정이 어두울 때</>,
  },
];

// 나 말하기 기법
export default function Step21(props: CardType) {
  const { alert } = useAlert();
  const onPrev = useSetAtom(prevStepAtom);
  const answer = useAtomValue(answersAtom);

  const checkedAnswer = useMemo(() => {
    const selectedAnswer =
      answer.find((r) => r.progressTypeCd === "20")?.answerChoice || "";

    return listData.find((list) => list.value === selectedAnswer);
  }, [answer, listData]);

  const selectAnswer = useSetAtom(selectAnswerRadioAtom);
  const stepAnswer = useAtomValue(getStepAnswerData);

  //   답안 선택
  const onChangeHandler = (value: string) => {
    selectAnswer(value);
  };

  const onSave = () => {
    if (!stepAnswer[0] || stepAnswer[0] === "") {
      alert("내용을 입력해 주세요 ");
      return;
    }

    props.onSave([]);
  };

  return (
    <>
      <TextBox className="mt-5 text-justify">
        <MissionTitle className="mb-2">{checkedAnswer?.component}</MissionTitle>
        이러한 상황에서 어떠한 생각을 마음에 기억해두면 좋을까요?
      </TextBox>
      <TextArea className="mt-5 text-center font-bold">
        긍정적이고 현실적인 생각을 <br />
        아래에 적어보아요.
      </TextArea>
      <Inputs
        className="!py-2 border-camaColor1 !text-[#555555]"
        value={stepAnswer[0] || ""}
        readonly
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChangeHandler(e.target.value);
        }}
      />
      <MentalButton onClick={onSave}>완료 </MentalButton>
      <Footer onPrev={onPrev} />
    </>
  );
}
