import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentalTypeSummaryStep } from "./-MentalTypeSummaryStep";

describe("MentalTypeSummaryStep", () => {
  it("matches the asis type-specific copy for 전투형", () => {
    render(
      <MentalTypeSummaryStep
        result={{ dispName: "전투형", score: 6, type: "투쟁정신" }}
      />,
    );

    expect(screen.getByText("전투형")).toBeInTheDocument();
    expect(
      screen.getByText("나는 싸운다! 나는 승리한다!"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /암과의 싸움에서 두려움을 무릅쓰고 당당히 맞서기 위해 용기를 낸 당신/i,
      ),
    ).toBeInTheDocument();
  });
});
