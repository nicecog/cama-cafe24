import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MentalChecklistStep } from "./-MentalChecklistStep";

vi.mock("@/hooks/usePageTranslation", () => ({
  usePageTranslation: () => ({
    pt: (key: string) => key,
  }),
}));

describe("MentalChecklistStep", () => {
  it("renders four-point likert options for each question", () => {
    render(
      <MentalChecklistStep
        answers={Array.from({ length: 10 }, () => null)}
        onAnswerChange={() => {}}
      />,
    );

    expect(screen.getAllByText("전혀 아니다").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("radio", { name: "그렇지 않다" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("매우 그렇다").length).toBeGreaterThan(0);
  });

  it("calls onAnswerChange when a likert option is selected", () => {
    const onAnswerChange = vi.fn();

    render(
      <MentalChecklistStep
        answers={Array.from({ length: 10 }, () => null)}
        onAnswerChange={onAnswerChange}
      />,
    );

    fireEvent.click(screen.getAllByRole("radio", { name: "그렇다" })[0]);

    expect(onAnswerChange).toHaveBeenCalledWith(0, 2);
  });
});
