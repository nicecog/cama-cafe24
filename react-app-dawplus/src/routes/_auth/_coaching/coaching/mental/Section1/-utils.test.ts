import { describe, expect, it } from "vitest";
import { evaluateMentalType } from "./-utils";

describe("evaluateMentalType", () => {
  it("matches asis scoring for each mental type bucket", () => {
    expect(evaluateMentalType([0, 0, 3, 0, 0, 0, 0, 0, 0, 0])).toMatchObject({
      dispName: "걱정형",
      type: "불안몰두",
      score: 6,
    });

    expect(evaluateMentalType([3, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toMatchObject({
      dispName: "자포자기형",
      type: "무망감/무력감",
      score: 6,
    });

    expect(evaluateMentalType([0, 0, 0, 0, 3, 0, 0, 0, 0, 0])).toMatchObject({
      dispName: "억압형",
      type: "인지적회피",
      score: 6,
    });

    expect(evaluateMentalType([0, 0, 0, 0, 0, 0, 3, 0, 0, 0])).toMatchObject({
      dispName: "전투형",
      type: "투쟁정신",
      score: 6,
    });

    expect(evaluateMentalType([0, 0, 0, 0, 0, 0, 0, 0, 3, 0])).toMatchObject({
      dispName: "순응형",
      type: "운명론",
      score: 6,
    });
  });

  it("returns the highest scoring mental type", () => {
    const result = evaluateMentalType([0, 0, 3, 2, 0, 0, 1, 1, 0, 0]);

    expect(result.dispName).toBe("걱정형");
    expect(result.type).toBe("불안몰두");
    expect(result.score).toBe(8);
  });

  it("uses asis tie-break order when scores are equal", () => {
    const result = evaluateMentalType([2, 0, 2, 0, 2, 0, 2, 0, 2, 0]);

    expect(result.dispName).toBe("걱정형");
  });
});
