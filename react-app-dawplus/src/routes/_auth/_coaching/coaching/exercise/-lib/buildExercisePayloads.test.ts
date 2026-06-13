import { describe, expect, it } from "vitest";
import {
  buildExerciseCompletionPayload,
  buildExerciseSeedPayload,
  buildExerciseSurveyResult,
  buildExerciseUserClassPayload,
} from "./buildExercisePayloads";

describe("buildExerciseSeedPayload", () => {
  it("creates the same seed payload shape as asis", () => {
    expect(
      buildExerciseSeedPayload({
        accountName: "홍길동",
        loginId: "user01",
        refs: ["1E2A2"],
      }),
    ).toEqual([
      {
        accountName: "홍길동",
        answerChoice: "N",
        answerChoiceSeq: 0,
        categoryCd: "E",
        loginId: "user01",
        progressTypeCd: "A1",
        refVal1: "1E2A2",
        stepDayCd: "00",
      },
    ]);
  });
});

describe("buildExerciseUserClassPayload", () => {
  it("preserves the asis saveExerciseUserClass shape", () => {
    expect(
      buildExerciseUserClassPayload({
        loginId: "user01",
        cancerTypeCd: "E2",
        exerciseProgramCd: "A2",
        aerobic: "Y",
        therapyCd: "T2",
        surveyResult: [{ seq: 0, question: "Q", answer: "Y" }],
      }),
    ).toEqual({
      loginId: "user01",
      cancerTypeCd: "E2",
      exerciseProgramCd: "A2",
      aerobic: "Y",
      therapyCd: "T2",
      surveyResult: [{ seq: 0, question: "Q", answer: "Y" }],
    });
  });
});

describe("buildExerciseSurveyResult", () => {
  it("zips questions and answers using asis shape", () => {
    expect(
      buildExerciseSurveyResult({
        questions: ["Q1", "Q2"],
        answers: ["Y", "N"],
      }),
    ).toEqual([
      { seq: 0, question: "Q1", answer: "Y" },
      { seq: 1, question: "Q2", answer: "N" },
    ]);
  });
});

describe("buildExerciseCompletionPayload", () => {
  it("preserves the answer item shape and updates only the selected recommendation", () => {
    const result = buildExerciseCompletionPayload({
      accountName: "홍길동",
      answerList: [
        {
          seq: 1,
          loginId: "u1",
          categoryCd: "E",
          categoryNm: "운동",
          stepDayCd: "00",
          progressTypeCd: "A1",
          answerChoiceSeq: 0,
          answerChoice: "N",
          refVal1: "1E2A2",
          refVal2: null,
          questionCd: "",
          questionNm: "",
          answerCd: "",
          answerNm: "",
          answerVal: null,
          createdAt: "",
          updatedAt: "",
        },
        {
          seq: 2,
          loginId: "u1",
          categoryCd: "E",
          categoryNm: "운동",
          stepDayCd: "00",
          progressTypeCd: "A1",
          answerChoiceSeq: 0,
          answerChoice: "N",
          refVal1: "1E5A2",
          refVal2: null,
          questionCd: "",
          questionNm: "",
          answerCd: "",
          answerNm: "",
          answerVal: null,
          createdAt: "",
          updatedAt: "",
        },
      ],
      loginId: "user01",
      selectedRef: "1E5A2",
    });

    expect(result.map((item) => item.answerChoice)).toEqual(["N", "Y"]);
    expect(result[0]).toMatchObject({
      seq: 1,
      loginId: "user01",
      categoryNm: "운동",
      questionCd: "",
      answerCd: "",
    });
  });
});
