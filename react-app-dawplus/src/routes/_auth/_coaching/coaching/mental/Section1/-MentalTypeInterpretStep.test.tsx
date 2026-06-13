import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentalTypeInterpretStep } from "./-MentalTypeInterpretStep";

describe("MentalTypeInterpretStep", () => {
  it("matches the asis interpretation copy for 전투형", () => {
    render(
      <MentalTypeInterpretStep
        result={{ dispName: "전투형", score: 6, type: "투쟁정신" }}
        accountName="홍길동"
      />,
    );

    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText(/정면돌파하는 유형이에요/i)).toBeInTheDocument();
    expect(
      screen.getByText(/이런 긍정적이고 적극적인 태도는 투병 과정과 예후에 좋은 영향을 줘요/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/힘들 때도 있고 좌절하거나 지칠수도 있어요/i),
    ).toBeInTheDocument();
  });
});
