import Footer from "../../component/Footer";
import { useAtomValue, useSetAtom } from "jotai";
import {
  getStepAnswerData,
  nextStepAtom,
  prevStepAtom,
  selectAnswerRadioAtom,
} from "../CardAtom";
import TextBox from "../../../component/Layout/TextBox";

import TextArea from "../../../component/Layout/TextArea";
import MissionTitle from "../../../component/Layout/MissionTitle";
import Radio from "../../component/Radio";
import { ChangeEvent, useMemo } from "react";
import useAlert from "@/hooks/useAlert";
import useMentalType from "@/hooks/useMentalType";

const type1 = [
  {
    value: "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    component: (
      <>검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때</>
    ),
  },
  {
    value: "퇴원을 앞두고 혼자라는 생각이 들 때",
    component: <>퇴원을 앞두고 혼자라는 생각이 들 때</>,
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의의 표정이 어두울 때</>,
  },
];
const type2 = [
  {
    value: " 암 진단을 받았을 때",
    component: <> 암 진단을 받았을 때</>,
  },
  {
    value: "책을 읽다가 '재발'이라는 단어를 봤을 때",
    component: <>책을 읽다가 '재발'이라는 단어를 봤을 때</>,
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의의 표정이 어두울 때</>,
  },
];
const type3 = [
  {
    value: "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    component: (
      <>검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때</>
    ),
  },
  {
    value: "책을 읽다가 '재발'이라는 단어를 봤을 때",
    component: <>책을 읽다가 '재발' 이라는 단어를 봤을 때</>,
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의의 표정이 어두울 때</>,
  },
];
const type4 = [
  {
    value: "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    component: (
      <>검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때</>
    ),
  },
  {
    value: "퇴원을 앞두고 혼자라는 생각이 들 때",
    component: <>퇴원을 앞두고 혼자라는 생각이 들 때</>,
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의의 표정이 어두울 때</>,
  },
];
const type5 = [
  {
    value: "검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때",
    component: (
      <>검사 결과가 대체로 좋지만, 수치 하나는 경과를 지켜보자고 할 때</>
    ),
  },
  {
    value: "책을 읽다가 '재발'이라는 단어를 봤을 때",
    component: <>책을 읽다가 '재발'이라는 단어를 봤을 때</>,
  },
  {
    value: "검사 결과를 확인하는 주치의의 표정이 어두울 때",
    component: <>검사 결과를 확인하는 주치의의 표정이 어두울 때</>,
  },
];

// 생각 바꾸기
export default function Step20() {
  const onNext = useSetAtom(nextStepAtom);
  const onPrev = useSetAtom(prevStepAtom);

  const selectAnswer = useSetAtom(selectAnswerRadioAtom);
  const stepAnswer = useAtomValue(getStepAnswerData);

  const { alert } = useAlert();

  //   답안 선택
  const onChangeHandler =
    (value: string) => (_: ChangeEvent<HTMLInputElement>) => {
      selectAnswer(value);
    };

  const onNextHandler = () => {
    if (stepAnswer.length === 0) {
      alert("상황을 선택해 주세요 ");
      return;
    }
    onNext();
  };

  const type: string = useMentalType();

  const listData = useMemo(() => {
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
    return [];
  }, [type]);

  return (
    <>
      <TextBox className="mt-5">
        <MissionTitle className="tracking-tighter !text-camaColor">
          예시 중에서 가장 와닿았던 <br />
          상황은 무엇인가요?
        </MissionTitle>
      </TextBox>
      <TextArea className="mt-5 tracking-tighter">
        <div className="mt-2">
          {listData.map((item, idx) => (
            <Radio
              key={idx}
              className="my-2  !border-[#e1e1e1]"
              name="radio1"
              checked={stepAnswer.includes(item.value)}
              onChange={onChangeHandler(item.value)}
            >
              <div className="tracking-tighter text-f3">{item.component}</div>
            </Radio>
          ))}
        </div>
      </TextArea>
      <Footer onNext={onNextHandler} onPrev={onPrev} />
    </>
  );
}
