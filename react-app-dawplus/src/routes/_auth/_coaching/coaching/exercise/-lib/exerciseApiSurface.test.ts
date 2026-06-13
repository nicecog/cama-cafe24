import { describe, expect, it } from "vitest";
import {
  fetchExerciseContentList,
  saveExerciseSurveyResult,
  saveExerciseUserClass,
} from "@/apis/api/webview/coaching";

describe("exercise coaching api surface", () => {
  it("exports exercise-specific fetch and save functions", () => {
    expect(fetchExerciseContentList).toBeTypeOf("function");
    expect(saveExerciseUserClass).toBeTypeOf("function");
    expect(saveExerciseSurveyResult).toBeTypeOf("function");
  });
});
