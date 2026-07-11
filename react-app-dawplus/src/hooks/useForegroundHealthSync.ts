import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { syncHeartRate } from "@/lib/health/syncHeartRate";
import { syncTodaySteps } from "@/lib/health/syncTodaySteps";
import { queryKeys } from "@/lib/queryClient";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

const FOREGROUND_SYNC_MIN_INTERVAL_MS = 60_000;
const FOREGROUND_SYNC_START_DELAY_MS = 3_000;

/**
 * WebView 로그인 세션에서 걸음수·심박수를 서버와 자동 동기화합니다.
 * - 최초 진입(mount) 시 WebView 렌더 완료 후 1회 (지연)
 * - 앱/탭 포그라운드 복귀 시 (1분 throttle)
 */
export function useForegroundHealthSync(accountSeq: number | undefined) {
  const queryClient = useQueryClient();
  const syncInFlight = useRef(false);
  const lastSyncAt = useRef(0);

  const runSync = useCallback(
    async (source: "mount" | "foreground") => {
      if (!isReactNativeWebView() || !accountSeq) {
        return;
      }

      if (syncInFlight.current) {
        return;
      }

      if (
        source === "foreground" &&
        Date.now() - lastSyncAt.current < FOREGROUND_SYNC_MIN_INTERVAL_MS
      ) {
        return;
      }

      syncInFlight.current = true;
      try {
        const accountSeqStr = String(accountSeq);
        const [stepResult, heartResult] = await Promise.all([
          syncTodaySteps(accountSeq),
          syncHeartRate(accountSeq, { daysBack: 1 }),
        ]);

        if (stepResult.ok || heartResult.ok) {
          lastSyncAt.current = Date.now();
        }

        if (stepResult.ok) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.webview.track.stepList(accountSeqStr),
          });
        }

        if (import.meta.env.DEV) {
          if (!stepResult.ok) console.debug("[step-sync]", stepResult);
          if (!heartResult.ok) console.debug("[heart-sync]", heartResult);
        }
      } finally {
        syncInFlight.current = false;
      }
    },
    [accountSeq, queryClient],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void runSync("mount");
    }, FOREGROUND_SYNC_START_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [runSync]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void runSync("foreground");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [runSync]);
}
