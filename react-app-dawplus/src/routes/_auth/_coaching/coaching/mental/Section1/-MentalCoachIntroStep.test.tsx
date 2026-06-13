import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentalCoachIntroStep } from "./-MentalCoachIntroStep";

describe("MentalCoachIntroStep", () => {
  it("matches the asis coach intro copy", () => {
    render(<MentalCoachIntroStep accountName="홍길동" />);

    expect(screen.getByText(/안녕하세요/i)).toBeInTheDocument();
    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText(/마음근육을 키워줄 카마코치에요/i)).toBeInTheDocument();
    expect(
      screen.getByText(/건강한 마음으로 암 여정을 슬기롭게 헤쳐 나가 보아요/i),
    ).toBeInTheDocument();
  });
});
