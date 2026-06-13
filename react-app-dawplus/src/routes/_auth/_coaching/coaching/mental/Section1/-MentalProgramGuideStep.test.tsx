import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MentalProgramGuideStep } from "./-MentalProgramGuideStep";

describe("MentalProgramGuideStep", () => {
  it("matches the asis program guide copy for 전투형", () => {
    render(
      <MentalProgramGuideStep
        result={{ dispName: "전투형", score: 6, type: "투쟁정신" }}
        trainingPlans={[
          { wday: "월요일", time: "9" },
          { wday: "화요일", time: "14" },
        ]}
        onTrainingPlanChange={() => {}}
      />,
    );

    expect(
      screen.getByText(/암과 맞서 싸우는 당신에게 지친 마음을 쉬게 하고/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/마음근육 프로그램은 총 7회로 진행됩니다/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/앞으로 3주 동안, 두 번씩 만나게 됩니다/i)).toBeInTheDocument();
    expect(
      screen.getByText(/마지막 7회차에는 암종별로 생길 수 있는 어려움에 대처하는 방법/i),
    ).toBeInTheDocument();
  });
});
