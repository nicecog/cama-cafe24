import { describe, expect, it } from "vitest";
import { getQuestionSet } from "./exerciseQuestions";

describe("getQuestionSet", () => {
  it("returns 17 questions for thyroid cancer", () => {
    expect(getQuestionSet("갑상선암")).toHaveLength(17);
  });

  it("returns 16 questions for lung cancer", () => {
    expect(getQuestionSet("폐암")).toHaveLength(16);
  });
});
