import { atom } from "jotai";

import {
  defaultQuestionList,
  cancer1,
  cancer2,
  cancer3,
  cancer4,
  defaultQuestionListValue,
  cancer1Value,
  cancer2Value,
  cancer3Value,
  cancer4Value,
} from "./questionList";

// 암종
const cancer = atom("");
// 답변 목록
const answerList = atom<string[]>([]);

export const initAtom = atom(null, (_, set) => {
  set(cancer, "");
  set(answerList, []);
});

// 암종 Atom
export const cancerAtom = atom(
  (get) => get(cancer),
  (_, set, update: string) => {
    // 암종 setting
    set(cancer, update);
    // 암종별 질문 목록 - 갑상선암만 17개 질문
    set(answerList, Array(update === "갑상선암" ? 17 : 16).fill(""));
  }
);

// 답변 Atom
export const answerAtom = atom(
  (get) => get(answerList),
  (_, set, update: string[]) => {
    set(answerList, update);
  }
);

// 질문목록
export const questionListAtom = atom((get) => {
  // 암종
  const _cancer = get(cancer);

  return [
    ...defaultQuestionList,
    ...(_cancer === "갑상선암" ? cancer1 : []),
    ...(_cancer === "대장암" ? cancer2 : []),
    ...(_cancer === "폐암" ? cancer3 : []),
    ...(_cancer === "유방암" ? cancer4 : []),
  ];
});

// 질문목록
export const questionListValueAtom = atom((get) => {
  // 암종
  const _cancer = get(cancer);

  return [
    ...defaultQuestionListValue,
    ...(_cancer === "갑상선암" ? cancer1Value : []),
    ...(_cancer === "대장암" ? cancer2Value : []),
    ...(_cancer === "폐암" ? cancer3Value : []),
    ...(_cancer === "유방암" ? cancer4Value : []),
  ];
});

export const initEval = atom(null, (_, set) => {
  set(cancer, "");
  set(answerList, []);
});
