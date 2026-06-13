import { describe, expect, it } from "vitest";
import { evaluateExerciseProgram } from "./evaluateExerciseProgram";

describe("evaluateExerciseProgram", () => {
  it("returns A3 for colon cancer when high-function answers are all Y", () => {
    const answers = [
      "Y",
      "N",
      "Y",
      "N",
      "Y",
      "N",
      "Y",
      "Y",
      "N",
      "Y",
      "Y",
      "N",
      "N",
      "N",
      "N",
      "N",
    ];

    expect(evaluateExerciseProgram("대장암", answers)).toEqual({
      program: "A3",
      aerobic: "N",
      therapy: "",
    });
  });

  it("returns T2 for lung cancer when sputum item is Y", () => {
    const answers = [
      "Y",
      "N",
      "Y",
      "N",
      "Y",
      "N",
      "Y",
      "Y",
      "N",
      "Y",
      "Y",
      "N",
      "N",
      "N",
      "Y",
      "N",
    ];

    expect(evaluateExerciseProgram("폐암", answers).therapy).toBe("T2");
  });
});
