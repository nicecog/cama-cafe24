import { atom } from "jotai";
import { splitAtom } from "jotai/utils";

import { ReactNode } from "react";

export type QuestionType = {
  label: ReactNode;
  text: string;
  value: number;
};

export type WeekDay =
  | "월요일"
  | "화요일"
  | "수요일"
  | "목요일"
  | "금요일"
  | "토요일"
  | "일요일";

export interface DaySelection {
  wday: WeekDay;
  time: string;
}

const questionInitialState: QuestionType[] = [
  {
    label: <>나는 내 삶에 희망이 없다고 느낀다. </>,
    text: "나는 내 삶에 희망이 없다고 느낀다.",
    value: 0,
  },
  {
    label: <>나는 지금 내 상황에 대처할 수가 없다.</>,
    text: "나는 지금 내 상황에 대처할 수가 없다.",
    value: 0,
  },
  { label: <>나는 좀 겁이 난다.</>, text: "나는 좀 겁이 난다.", value: 0 },
  {
    label: <>나는 암과 관련된 걱정이 많아 괴롭다.</>,
    text: "나는 암과 관련된 걱정이 많아 괴롭다.",
    value: 0,
  },
  {
    label: <>나는 의도적으로 암에 대한 생각을 떨쳐 버리려고 노력한다.</>,
    text: "나는 의도적으로 암에 대한 생각을 떨쳐 버리려고 노력한다.",
    value: 0,
  },
  {
    label: <>나는 내 병에 대해 생각하지 않으려고 애쓴다.</>,
    text: "나는 내 병에 대해 생각하지 않으려고 애쓴다",
    value: 0,
  },
  {
    label: <>나는 이 병이 나에게 주어진 도전이라고 생각한다.</>,
    text: " 나는 이 병이 나에게 주어진 도전이라고 생각한다.",
    value: 0,
  },
  {
    label: <>나는 매우 낙관적이다.</>,
    text: "나는 매우 낙관적이다.",
    value: 0,
  },
  {
    label: (
      <>나는 지금까지 잘 살아 왔다. 남은 삶은, 선물이라고 생각하고 살겠다.</>
    ),
    text: "나는 지금까지 잘 살아 왔다. 남은 삶은, 선물이라고 생각하고 살겠다.",
    value: 0,
  },
  {
    label: <>나는 내가 가진 것에 감사한다.</>,
    text: "나는 내가 가진 것에 감사한다.",
    value: 0,
  },
];

//  Current Step
export const stepCdAtom = atom(1);

// 질문 Atom
export const questionsAtom = atom(questionInitialState);
// 질문 split
export const splitQuestionAtom = splitAtom(questionsAtom);
// 훈련일정
export const trainingPlanAtom = atom<DaySelection>({
  wday: "월요일",
  time: "1",
});
// 훈련일정 - 2
export const trainingPlanAtom2 = atom<DaySelection>({
  wday: "월요일",
  time: "1",
});

// 초기화
export const initAtom = atom(null, (_, set) => {
  set(stepCdAtom, 1);
  set(questionsAtom, questionInitialState);
});

// 유형 확인
export const questionResult = atom((get) => {
  const result = get(questionsAtom);

  // 각 항목별 점수 계산
  const scores = [
    {
      type: "불안몰두",
      score: result[2].value * 2 + result[3].value,
      dispName: "걱정형",
    },
    {
      type: "무망감/무력감",
      score: result[0].value * 2 + result[1].value,
      dispName: "자포자기형",
    },
    {
      type: "인지적회피",
      score: result[4].value * 2 + result[5].value,
      dispName: "억압형",
    },
    {
      type: "투쟁정신",
      score: result[6].value * 2 + result[7].value,
      dispName: "전투형",
    },
    {
      type: "운명론",
      score: result[8].value * 2 + result[9].value,
      dispName: "순응형",
    },
  ];

  // 점수에 따라 정렬하고, 점수가 같은 경우 원래 배열의 순서(index)에 따라 정렬
  const maxScoreObject = scores
    .map((score, index) => ({ ...score, index }))
    .sort((a, b) =>
      b.score !== a.score ? b.score - a.score : a.index - b.index
    )[0];

  return maxScoreObject;
});

// 이전 페이지
export const nextStepCdAtom = atom(null, (get, set) => {
  const current = get(stepCdAtom);

  if (current < 7) {
    set(stepCdAtom, current + 1);
  }
});

// 다음 페이지
export const prevStepCdAtom = atom(null, (get, set) => {
  const current = get(stepCdAtom);

  if (current > 1) {
    set(stepCdAtom, current - 1);
  }
});
