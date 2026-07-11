import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { syncTodaySteps } from "@/lib/health/syncTodaySteps";
import { queryKeys } from "@/lib/queryClient";
import { isReactNativeWebView } from "@/lib/webview/rnBridge";

const FOREGROUND_SYNC_MIN_INTERVAL_MS = 60_000;

/**
 * WebView 로그인 세션에서 걸음수를 서버와 자동 동기화합니다.
 * - 최초 진입(mount) 시 1회
 * - 앱/탭 포그라운드 복귀 시 (1분 throttle)
 */
export function useForegroundStepSync(accountSeq: number | undefined) {
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
        const result = await syncTodaySteps(accountSeq);
        if (result.ok) {
          lastSyncAt.current = Date.now();
          await queryClient.invalidateQueries({
            queryKey: queryKeys.webview.track.stepList(String(accountSeq)),
          });
        } else if (import.meta.env.DEV) {
          console.debug("[step-sync]", result);
        }
      } finally {
        syncInFlight.current = false;
      }
    },
    [accountSeq, queryClient],
  );

  useEffect(() => {
    void runSync("mount");
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
