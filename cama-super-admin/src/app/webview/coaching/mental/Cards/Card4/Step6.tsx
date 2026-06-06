import Footer from "../../component/Footer";
import { useAtomValue, useSetAtom } from "jotai";
import {
  getStepAnswerData,
  nextStepAtom,
  prevStepAtom,
  selectAnswerAtom,
} from "../CardAtom";

import CheckAnswers from "../../component/CheckAnswers";
import useAlert from "@/hooks/useAlert";
import Bubble from "../../component/Bubble";
import useMentalType from "@/hooks/useMentalType";
import { useMemo } from "react";

const type1 = [
  {
    label: <>결과가 대체로 좋다니 성공이야.</>,
    value: "결과가 대체로 좋다니 성공이야.",
  },
  { label: <>또 기다려야한다니.</>, value: "또 기다려야한다니." },
  {
    label: <>하나가 좋지 않다니, 내 노력이 모두 실패한거야.</>,
    value: "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];

// 순응형
const type2 = [
  {
    label: <>어쩔 수 없지만 앞으로 어떻게 할지 찾아봐야겠어.</>,
    value: "어쩔 수 없지만 앞으로 어떻게 할지 찾아봐야겠어.",
  },
  {
    label: <>이미 암에 걸린걸 되돌릴 수 없잖아.</>,
    value: "이미 암에 걸린걸 되돌릴 수 없잖아.",
  },
  {
    label: <>암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어.</>,
    value: "암을 낫게 할 수도 없는데 내가 할 수 있는 건 아무 것도 없어.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];

// 억압형
const type3 = [
  {
    label: <>결과가 대체로 좋다니 성공이야.</>,
    value: "결과가 대체로 좋다니 성공이야.",
  },
  {
    label: <>나쁜 이야기일 거야 듣고 싶지 않아.</>,
    value: "나쁜 이야기일 거야 듣고 싶지 않아.",
  },
  {
    label: <>치료가 실패했나봐.</>,
    value: "치료가 실패했나봐.",
  },

  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];

// 자포자기형
const type4 = [
  {
    label: <>결과가 대체로 좋다니 성공이야.</>,
    value: "결과가 대체로 좋다니 성공이야.",
  },
  { label: <>또 기다려야한다니.</>, value: "또 기다려야한다니." },
  {
    label: <>하나가 좋지 않다니, 내 노력이 모두 실패한거야.</>,
    value: "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];

// 걱정형
const type5 = [
  {
    label: <>결과가 대체로 좋다니 성공이야.</>,
    value: "결과가 대체로 좋다니 성공이야.",
  },
  { label: <>또 기다려야한다니.</>, value: "또 기다려야한다니." },
  {
    label: <>하나가 좋지 않다니, 내 노력이 모두 실패한거야.</>,
    value: "하나가 좋지 않다니, 내 노력이 모두 실패한거야.",
  },
  {
    label: <>해당없음.</>,
    value: "해당없음.",
  },
];
// 생각 바꾸기
export default function Step6() {
  //   Confirm
  const { alert } = useAlert();

  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const stepAnswer = useAtomValue(getStepAnswerData);

  const selectAnswer = useSetAtom(selectAnswerAtom);

  const type: string = useMentalType();
  //   답안 선택
  const onClick = (e: string) => {
    selectAnswer(e);
  };

  //   다음 선택
  const onNextHandler = () => {
    if (stepAnswer.length === 0) {
      alert("항목을 선택해 주세요 ");
      return;
    }
    onNext();
  };

  const listOptions = useMemo(() => {
    if (type === "전투형") {
      return type1;
    }

    if (type === "순응형") {
      return type2;
    }

    if (type === "억압형") {
      return type3;
    }

    if (type === "자포자기형") {
      return type4;
    }
    if (type === "걱정형") {
      return type5;
    }
  }, [type]);

  return (
    <>
      <Bubble className="my-5">
        <p className="mb-1">이때 내 머릿속을 스쳐간</p>
        <p>생각은 무엇일까요?</p>
        <p className="mt-4">체크해 보세요.</p>
      </Bubble>
      <CheckAnswers list={listOptions} data={stepAnswer} onChange={onClick} />

      <Footer onNext={onNextHandler} onPrev={onPrev} />
    </>
  );
}
