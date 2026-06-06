import { atom } from "jotai";
import { AnswersType } from "./CardTypes";

export const mapping: {
  [key: string]: string;
} = {
  ["전투형"]: "E",
  ["순응형"]: "F",
  ["억압형"]: "G",
  ["자포자기형"]: "H",
  ["걱정형"]: "J",
};

//  Current Step
export const stepAtom = atom(1);

// 답변
export const answersAtom = atom<AnswersType[]>([]);

export const maxStepAtom = atom(7);

// 초기화
export const initAtom = atom(null, (_, set) => {
  set(stepAtom, 1);
  set(answersAtom, []);
});

//  현재 스텝의 답안을 모두 가져옴 가져옴
export const getStepAnswer = atom<AnswersType[]>((get) => {
  const _step = get(stepAtom);
  const filteredData = get(answersAtom).filter(
    (r) => r.progressTypeCd === String(_step).padStart(2, "0")
  );
  return filteredData;
});
//  현재 스텝의 답안을 데이터만
export const getStepAnswerData = atom<string[]>((get) => {
  const _step = get(stepAtom);
  const filteredData = get(answersAtom)
    .filter((r) => r.progressTypeCd === String(_step).padStart(2, "0"))
    .map((item) => item.answerChoice);
  return filteredData;
});

// 답안 선택 atom
export const selectAnswerRadioAtom = atom(null, (get, set, e: string) => {
  const _step = get(stepAtom);
  const progressTypeCd = String(_step).padStart(2, "0");
  const currentAnswers = get(answersAtom);

  // 새로운 답안을 추가하면서 기존 답안을 제거
  const _newValue = currentAnswers
    .filter((r) => r.progressTypeCd !== progressTypeCd) // 현재 단계의 기존 답안을 제거
    .concat({
      progressTypeCd: progressTypeCd,
      answerChoice: e,
    }); // 새로운 답안을 추가

  // answersAtom을 새로운 값으로 설정
  set(answersAtom, _newValue);
});

// 답안 선택 atom
export const selectAnswerAtom = atom(null, (get, set, e: string) => {
  const _step = get(stepAtom);
  const progressTypeCd = String(_step).padStart(2, "0");
  const currentAnswers = get(answersAtom);

  // 현재 단계의 답안을 필터링
  const _check = currentAnswers
    .filter((r) => r.progressTypeCd === progressTypeCd)
    .map((r) => r.answerChoice);

  // 새로운 답안을 추가하거나 제거
  const _newValue = _check.includes(e)
    ? currentAnswers.filter(
        (r) => r.progressTypeCd !== progressTypeCd || r.answerChoice !== e
      )
    : currentAnswers.concat({
        progressTypeCd: progressTypeCd,
        answerChoice: e,
      });

  // answersAtom을 새로운 값으로 설정
  set(answersAtom, _newValue);
});

// 이전 페이지
export const nextStepAtom = atom(null, (get, set) => {
  //  현재 스템
  const current = get(stepAtom);

  const max = get(maxStepAtom);

  if (current < max) {
    set(stepAtom, current + 1);
  }
});

// 다음 페이지
export const prevStepAtom = atom(null, (get, set) => {
  const current = get(stepAtom);
  if (current > 1) {
    set(stepAtom, current - 1);
  }
});
