import {
  saveWebviewVitalBatch,
  type VitalRecordRequest,
} from "@/apis/api/webview/vital";
import {
  isReactNativeWebView,
  requestNativeVitalSamples,
} from "@/lib/webview/rnBridge";

export type SyncHeartRateResult =
  | { ok: true; saved: number }
  | {
      ok: false;
      reason:
        | "unavailable"
        | "no_account"
        | "no_samples"
        | "permission_denied"
        | "api_error";
      error?: string | null;
    };

type SyncHeartRateOptions = {
  daysBack?: number;
};

/**
 * Health Connect(Android)에서 심박 샘플을 읽어 서버에 저장합니다.
 */
export async function syncHeartRate(
  accountSeq: number,
  options: SyncHeartRateOptions = {},
): Promise<SyncHeartRateResult> {
  if (!isReactNativeWebView()) {
    return { ok: false, reason: "unavailable" };
  }

  if (!accountSeq) {
    return { ok: false, reason: "no_account" };
  }

  const daysBack = options.daysBack ?? 1;

  try {
    const nativeResult = await requestNativeVitalSamples("HEART_RATE", daysBack);
    if (nativeResult === null) {
      return { ok: false, reason: "unavailable" };
    }

    const samples = nativeResult.samples.filter(
      (sample) =>
        sample.measuredAt &&
        typeof sample.valueNum === "number" &&
        sample.valueNum >= 20 &&
        sample.valueNum <= 300,
    );

    if (samples.length === 0) {
      return { ok: false, reason: "no_samples" };
    }

    const records: VitalRecordRequest[] = samples.map((sample) => ({
      accountSeq,
      measuredAt: sample.measuredAt,
      vitalTypeCd: "HEART_RATE",
      valueNum: Math.round(sample.valueNum),
      unit: sample.unit ?? "bpm",
      sourceCd: sample.sourceCd ?? "WEARABLE",
    }));

    const response = await saveWebviewVitalBatch(records);
    if (!response.success) {
      return {
        ok: false,
        reason: "api_error",
        error: response.error?.message ?? null,
      };
    }

    return {
      ok: true,
      saved: response.response?.saved ?? records.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message.includes("PERMISSION_DENIED")) {
      return { ok: false, reason: "permission_denied", error: message };
    }
    return { ok: false, reason: "api_error", error: message };
  }
}
