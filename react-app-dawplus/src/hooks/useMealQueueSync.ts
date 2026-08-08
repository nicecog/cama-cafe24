import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { mealQueueSize } from "@/lib/nutrition/mealQueue";
import { flushMealQueue } from "@/lib/nutrition/syncMealQueue";
import { queryKeys } from "@/lib/queryClient";

const FLUSH_MIN_INTERVAL_MS = 10_000;
const FLUSH_START_DELAY_MS = 1_500;

/**
 * 오프라인 큐에 남은 식사 기록을 서버로 밀어 넣는다.
 * - 마운트 직후 1회
 * - 앱/탭 포그라운드 복귀 시
 * - 온라인 전환 시
 */
export function useMealQueueSync() {
  const queryClient = useQueryClient();
  const [pendingCount, setPendingCount] = useState(() => mealQueueSize());
  const inFlight = useRef(false);
  const lastFlushAt = useRef(0);

  const flush = useCallback(
    async (force = false) => {
      if (inFlight.current) {
        return;
      }
      if (!force && Date.now() - lastFlushAt.current < FLUSH_MIN_INTERVAL_MS) {
        return;
      }
      if (mealQueueSize() === 0) {
        setPendingCount(0);
        return;
      }

      inFlight.current = true;
      try {
        const result = await flushMealQueue();
        lastFlushAt.current = Date.now();
        setPendingCount(result.remaining);
        if (result.saved > 0) {
          await queryClient.invalidateQueries({
            queryKey: queryKeys.webview.nutrition.all,
          });
        }
      } finally {
        inFlight.current = false;
      }
    },
    [queryClient],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void flush(true);
    }, FLUSH_START_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [flush]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void flush();
      }
    };
    const onOnline = () => {
      void flush(true);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("online", onOnline);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("online", onOnline);
    };
  }, [flush]);

  return {
    pendingCount,
    flush,
    refreshCount: () => setPendingCount(mealQueueSize()),
  };
}
