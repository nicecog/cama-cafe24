import { describe, expect, it } from "vitest";
import { buildMentalSection1SavePayload } from "./-save";

describe("buildMentalSection1SavePayload", () => {
  it("matches the asis payload shape for section1 save", () => {
    const payload = buildMentalSection1SavePayload({
      answers: [0, 1, 2, 3, 0, 1, 3, 3, 2, 1],
      result: { dispName: "전투형", score: 9, type: "투쟁정신" },
      trainingPlans: [
        { wday: "월요일", time: "9" },
        { wday: "수요일", time: "14" },
      ],
      loginId: "user01",
      accountName: "홍길동",
    });

    expect(payload.answerListPayload).toHaveLength(71);
    expect(payload.schedulePayload).toHaveLength(6);
    expect(payload.answerListPayload[0]).toMatchObject({
      progressTypeCd: "D1",
      categoryCd: "D",
      stepDayCd: "Q1",
      loginId: "user01",
      accountName: "홍길동",
      answerChoiceSeq: 0,
    });
    expect(payload.answerListPayload[10]).toMatchObject({
      progressTypeCd: "D2",
      answerChoice: "전투형",
      refVal1: "투쟁정신",
    });
    expect(
      payload.answerListPayload.filter(
        (item) => item.progressTypeCd === "E06" && item.answerChoice !== "",
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ answerChoice: "월요일 - 9" }),
        expect.objectContaining({ answerChoice: "수요일 - 14" }),
      ]),
    );
    expect(payload.schedulePayload[0]).toMatchObject({
      loginId: "user01",
      categoryType: "D",
      memo: "심리",
    });
  });
});
