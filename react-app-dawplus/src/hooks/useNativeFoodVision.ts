import { useCallback, useState } from "react";
import {
  createMockFoodAnalysis,
  createMockFoodVisionInfo,
} from "@/lib/nutrition/mockFoodVision";
import type {
  FoodAnalysisOptions,
  FoodImageAnalysisResult,
  FoodVisionInfo,
} from "@/lib/webview/nativeBridge.types";
import {
  isReactNativeWebView,
  requestNativeAnalyzeFoodImage,
  requestNativeFoodVisionInfo,
} from "@/lib/webview/rnBridge";

const MOCK_FLAG_KEY = "cama.foodVision.mock";

/** 네이티브가 추론을 아직 제공하지 않을 때 대체 결과로 처리할 오류 */
const FALLBACK_ERRORS = new Set(["NOT_IMPLEMENTED", "UNAVAILABLE"]);

/**
 * 온디바이스 추론이 붙기 전에도 화면을 검증할 수 있게 목 결과를 허용한다.
 * 배포 빌드에서는 `localStorage.setItem("cama.foodVision.mock", "1")` 로만 켜진다.
 */
export function isFoodVisionMockEnabled(): boolean {
  if (import.meta.env.DEV) {
    return true;
  }
  try {
    return window.localStorage.getItem(MOCK_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export type FoodVisionState = {
  analyzing: boolean;
  /** NATIVE_BRIDGE_ERRORS 코드 또는 null */
  error: string | null;
  /** 마지막 결과가 목 데이터인지 */
  usedMock: boolean;
};

export function useNativeFoodVision() {
  const [state, setState] = useState<FoodVisionState>({
    analyzing: false,
    error: null,
    usedMock: false,
  });

  const analyze = useCallback(
    async (
      options: FoodAnalysisOptions = {},
    ): Promise<FoodImageAnalysisResult | null> => {
      setState({ analyzing: true, error: null, usedMock: false });

      const finish = (
        result: FoodImageAnalysisResult | null,
        error: string | null,
        usedMock: boolean,
      ) => {
        setState({ analyzing: false, error, usedMock });
        return result;
      };

      if (!isReactNativeWebView()) {
        if (isFoodVisionMockEnabled()) {
          return finish(createMockFoodAnalysis(), null, true);
        }
        return finish(null, "UNAVAILABLE", false);
      }

      try {
        const response = await requestNativeAnalyzeFoodImage({
          includeCandidates: true,
          ...options,
        });
        if (response.ok) {
          return finish(response.data as FoodImageAnalysisResult, null, false);
        }
        if (FALLBACK_ERRORS.has(response.error) && isFoodVisionMockEnabled()) {
          return finish(createMockFoodAnalysis(), null, true);
        }
        return finish(null, response.error, false);
      } catch {
        if (isFoodVisionMockEnabled()) {
          return finish(createMockFoodAnalysis(), null, true);
        }
        return finish(null, "UNAVAILABLE", false);
      }
    },
    [],
  );

  const loadInfo = useCallback(async (): Promise<FoodVisionInfo | null> => {
    if (!isReactNativeWebView()) {
      return isFoodVisionMockEnabled() ? createMockFoodVisionInfo() : null;
    }
    try {
      const response = await requestNativeFoodVisionInfo();
      if (response.ok) {
        return response.data as FoodVisionInfo;
      }
      return isFoodVisionMockEnabled() ? createMockFoodVisionInfo() : null;
    } catch {
      return isFoodVisionMockEnabled() ? createMockFoodVisionInfo() : null;
    }
  }, []);

  return {
    analyze,
    loadInfo,
    analyzing: state.analyzing,
    error: state.error,
    usedMock: state.usedMock,
    isWebView: isReactNativeWebView(),
  };
}

/** 사용자에게 보여줄 브릿지 오류 문구 */
export function describeFoodVisionError(code: string | null): string | null {
  switch (code) {
    case null:
      return null;
    case "PERMISSION_DENIED":
      return "카메라 권한이 필요합니다. 설정에서 권한을 허용해 주세요.";
    case "CANCELLED":
      return "촬영을 취소했습니다.";
    case "TIMEOUT":
      return "분석이 지연되고 있습니다. 다시 시도해 주세요.";
    case "NOT_IMPLEMENTED":
      return "이 앱 버전은 음식 인식을 지원하지 않습니다. 앱을 업데이트해 주세요.";
    case "UNAVAILABLE":
      return "앱에서만 사용할 수 있는 기능입니다.";
    default:
      return "음식 분석에 실패했습니다. 다시 시도해 주세요.";
  }
}
