import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentalTypeAdviceStep } from "./-MentalTypeAdviceStep";

describe("MentalTypeAdviceStep", () => {
  it("matches the asis advice copy for 전투형", () => {
    render(
      <MentalTypeAdviceStep
        result={{ dispName: "전투형", score: 6, type: "투쟁정신" }}
        accountName="홍길동"
      />,
    );

    expect(
      screen.getByText((_, element) =>
        element?.tagName.toLowerCase() === "p" &&
        element.textContent === "'전투형'의 홍길동님!",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/늘 애쓰고 노력하는 모습이 아니어도 괜찮아요/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2보 전진을 위한 1보 후퇴/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/잠시 쉬어가도 괜찮아요/i)).toBeInTheDocument();
  });
});
