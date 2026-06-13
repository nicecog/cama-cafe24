import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MentalIntroStep } from "./-MentalIntroStep";

vi.mock("@/hooks/usePageTranslation", () => ({
  usePageTranslation: () => ({
    pt: (key: string) => key,
  }),
}));

describe("MentalIntroStep", () => {
  it("renders the section1 intro copy", () => {
    render(<MentalIntroStep />);

    expect(screen.getByText("'내가 암이라니...'")).toBeInTheDocument();
    expect(
      screen.getByText(/나의 대처 유형을 알아볼까요/i),
    ).toBeInTheDocument();
  });
});
