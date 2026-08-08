import type {
  FoodImageAnalysisResult,
  FoodVisionInfo,
} from "@/lib/webview/nativeBridge.types";

/**
 * 네이티브 추론이 아직 붙지 않은 환경(브라우저 개발, NOT_IMPLEMENTED 응답)에서
 * review 화면을 검증하기 위한 대체 결과.
 *
 * classKey 는 `deploy/sql/cafe24-nutrition-food-class-seed.sql` 에 실제로 적재된 값이라
 * 서버 estimate 호출까지 그대로 통과한다.
 */

export const MOCK_MODEL_VERSION = "mock-food-vision@0.0.0";

export function createMockFoodVisionInfo(): FoodVisionInfo {
  return {
    modelVersion: MOCK_MODEL_VERSION,
    catalogVersion: "mock",
    profile: "416-int8",
    classCount: 100,
  };
}

export function createMockFoodAnalysis(): FoodImageAnalysisResult {
  return {
    modelVersion: MOCK_MODEL_VERSION,
    catalogVersion: "mock",
    profile: "416-int8",
    inferenceMs: 640,
    capturedAt: new Date().toISOString(),
    imageWidth: 1280,
    imageHeight: 960,
    items: [
      {
        classKey: "white_rice",
        nameKo: "쌀밥",
        confidence: 0.94,
        quantity: 1,
        servingG: 210,
        kcalPreview: 305,
        bbox: [0.12, 0.55, 0.3, 0.32],
      },
      {
        classKey: "kimchi_jjigae",
        nameKo: "김치찌개",
        confidence: 0.81,
        quantity: 1,
        servingG: 400,
        kcalPreview: 240,
        bbox: [0.48, 0.42, 0.34, 0.36],
        candidates: [
          { classKey: "kimchi_jjigae", nameKo: "김치찌개", confidence: 0.81 },
          { classKey: "budae_jjigae", nameKo: "부대찌개", confidence: 0.11 },
          {
            classKey: "sundubu_jjigae",
            nameKo: "순두부찌개",
            confidence: 0.05,
          },
        ],
      },
      {
        classKey: "kimchi",
        nameKo: "김치",
        confidence: 0.42,
        quantity: 1,
        servingG: 40,
        kcalPreview: 12,
        bbox: [0.2, 0.18, 0.18, 0.16],
        candidates: [
          { classKey: "kimchi", nameKo: "김치", confidence: 0.42 },
          { classKey: "salad", nameKo: "샐러드", confidence: 0.22 },
        ],
      },
    ],
  };
}
