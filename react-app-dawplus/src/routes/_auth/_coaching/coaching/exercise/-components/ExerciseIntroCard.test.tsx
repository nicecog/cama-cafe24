import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExerciseIntroCard } from "./ExerciseIntroCard";

vi.mock("@/hooks/usePageTranslation", () => ({
  usePageTranslation: () => ({
    pt: (key: string) =>
      (
        ({
          title: "운동평가",
          description:
            "본 설문은 중앙대학교병원 디지털암센터에서 암 환자의 일상생활 신체 활동 수행 능력을 평가하기 위하여 개발한 척도입니다.",
          summary:
            "귀하의 평가 결과에 따라 적절한 수준의 운동프로그램을 제안하여 신체 활동 능력 증진에 도움을 드리고자 합니다.",
          start: "평가시작",
        }) as const
      )[key],
  }),
}));

describe("ExerciseIntroCard", () => {
  it("renders the asis evaluation intro copy", () => {
    render(<ExerciseIntroCard onStart={() => {}} />);

    expect(screen.getByText("운동평가")).toBeInTheDocument();
    expect(
      screen.getByText(/암 환자의 일상생활 신체 활동 수행 능력을 평가/i),
    ).toBeInTheDocument();
  });
});
