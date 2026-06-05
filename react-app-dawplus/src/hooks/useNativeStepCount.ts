import { useCallback, useState } from "react";
import {
  isReactNativeWebView,
  requestNativeStepCount,
} from "@/lib/webview/rnBridge";

export function useNativeStepCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async (): Promise<number | null> => {
    if (!isReactNativeWebView()) {
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const steps = await requestNativeStepCount();
      if (steps === null) {
        setError("native_unavailable");
      }
      return steps;
    } catch {
      setError("native_failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchSteps, loading, error, isWebView: isReactNativeWebView() };
}
