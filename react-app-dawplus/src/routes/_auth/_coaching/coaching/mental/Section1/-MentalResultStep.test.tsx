import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MentalResultStep } from "./-MentalResultStep";

vi.mock("@/hooks/usePageTranslation", () => ({
  usePageTranslation: () => ({
    pt: (key: string) => key,
  }),
}));

describe("MentalResultStep", () => {
  it("matches the asis generic type confirmation copy", () => {
    render(
      <MentalResultStep
        result={{ dispName: "전투형", score: 6, type: "투쟁정신" }}
      />,
    );

    expect(screen.getByText("당신은")).toBeInTheDocument();
    expect(screen.getByText("전투형")).toBeInTheDocument();
    expect(screen.getByText(/이군요!/)).toBeInTheDocument();
    expect(screen.getByText("지피지기면 백전백승!")).toBeInTheDocument();
    expect(
      screen.getByText(/암에 대한 나의 대처 유형을 알면 스스로를 이해하고/i),
    ).toBeInTheDocument();
  });
});
