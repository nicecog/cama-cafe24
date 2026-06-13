import { describe, expect, it } from "vitest";
import { buildExerciseRecommendationRefs } from "./buildExerciseRecommendations";

const sampleContentList = [
  {
    difficultyCd: "A2",
    engName: "lung",
    exerciseTypeCd: "E2",
    indexNum: 1,
    korName: "폐암 운동",
    loginId: null,
    url: "https://example.com/1",
  },
  {
    difficultyCd: "A2",
    engName: "core",
    exerciseTypeCd: "E5",
    indexNum: 1,
    korName: "코어 운동",
    loginId: null,
    url: "https://example.com/2",
  },
  {
    difficultyCd: "A2",
    engName: "aerobic",
    exerciseTypeCd: "E6",
    indexNum: 1,
    korName: "유산소 운동",
    loginId: null,
    url: "https://example.com/3",
  },
  {
    difficultyCd: "A1",
    engName: "breathing",
    exerciseTypeCd: "E7",
    indexNum: 1,
    korName: "호흡 운동",
    loginId: null,
    url: "https://example.com/4",
  },
] as const;

describe("buildExerciseRecommendationRefs", () => {
  it("includes cancer, core, aerobic, and therapy items in asis order", () => {
    expect(
      buildExerciseRecommendationRefs({
        contentList: [...sampleContentList],
        cancerTypeCd: "E2",
        exerciseProgramCd: "A2",
        aerobic: "Y",
        therapyCd: "T2",
      }),
    ).toEqual(["1E2A2", "1E5A2", "1E6A2", "1E7A1"]);
  });
});
