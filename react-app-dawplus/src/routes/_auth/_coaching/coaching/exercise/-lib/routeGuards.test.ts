import { describe, expect, it } from "vitest";
import { canEnterExerciseVideo } from "./routeGuards";

describe("canEnterExerciseVideo", () => {
  it("blocks entry when no selected workout exists", () => {
    expect(canEnterExerciseVideo(null)).toBe(false);
  });
});
