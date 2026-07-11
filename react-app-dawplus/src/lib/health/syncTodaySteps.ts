import { format } from "date-fns";
import { saveWebviewStep } from "@/apis/api/webview/track";
import {
  isReactNativeWebView,
  requestNativeStepCount,
} from "@/lib/webview/rnBridge";

export type SyncTodayStepsResult =
  | { ok: true; stepNum: number }
  | {
      ok: false;
      reason: "unavailable" | "no_account" | "no_steps" | "api_error";
      error?: string | null;
    };

/**
 * 네이티브에서 오늘 걸음수를 읽어 서버에 upsert합니다.
 * WebView(RN) 환경에서만 동작하며, 실패 시 조용히 반환합니다.
 */
export async function syncTodaySteps(
  accountSeq: number,
): Promise<SyncTodayStepsResult> {
  if (!isReactNativeWebView()) {
    return { ok: false, reason: "unavailable" };
  }

  if (!accountSeq) {
    return { ok: false, reason: "no_account" };
  }

  const steps = await requestNativeStepCount();
  if (steps === null) {
    return { ok: false, reason: "no_steps" };
  }

  const executionDate = format(new Date(), "yyyy-MM-dd");

  try {
    const response = await saveWebviewStep({
      accountSeq,
      executionDate,
      stepNum: steps,
    });

    if (!response.success) {
      return {
        ok: false,
        reason: "api_error",
        error: response.error?.message ?? null,
      };
    }

    return { ok: true, stepNum: steps };
  } catch (error) {
    return {
      ok: false,
      reason: "api_error",
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}
