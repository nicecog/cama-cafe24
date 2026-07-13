import { useCallback, useEffect, useRef, useState } from "react";
import {
  cancelNativeSpeechRecognition,
  checkNativeSpeechRecognitionAvailable,
  isReactNativeWebView,
  startNativeSpeechRecognition,
  stopNativeSpeechRecognition,
} from "@/lib/webview/rnBridge";

type SpeechRecognitionEventDetail = {
  type?: string;
  requestId?: string;
  ok?: boolean;
  event?: string;
  transcript?: string;
  error?: string;
  message?: string;
  available?: boolean;
  implemented?: boolean;
};

type UseSpeechToTextOptions = {
  locale?: string;
  maxDurationMs?: number;
  prompt?: string;
  onFinal?: (text: string) => void;
};

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const activeRequestId = useRef<string | null>(null);
  const onFinalRef = useRef(options.onFinal);
  onFinalRef.current = options.onFinal;

  useEffect(() => {
    if (!isReactNativeWebView()) {
      setIsSupported(false);
      return;
    }
    let cancelled = false;
    void checkNativeSpeechRecognitionAvailable().then((status) => {
      if (!cancelled) {
        setIsSupported(status.available && status.implemented);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isReactNativeWebView()) {
      return undefined;
    }

    const onNative = (event: Event) => {
      const detail = (event as CustomEvent<SpeechRecognitionEventDetail>).detail;
      if (!detail || detail.type !== "speechRecognition") {
        return;
      }

      // Ignore availability probe responses while idle
      if (detail.event === "availability") {
        return;
      }

      // Failed start (permission / unavailable) — no event field
      if (detail.ok === false && !detail.event) {
        setIsListening(false);
        activeRequestId.current = null;
        const code = detail.error ?? "UNKNOWN";
        if (code === "PERMISSION_DENIED") {
          setError("PERMISSION_DENIED");
        } else if (code === "UNAVAILABLE" || code === "NOT_IMPLEMENTED") {
          setError("이 기기에서는 음성 입력을 사용할 수 없습니다.");
        } else {
          setError(detail.message ?? "음성 인식을 시작할 수 없습니다.");
        }
        return;
      }

      switch (detail.event) {
        case "started":
          setIsListening(true);
          setError(null);
          setPartialText("");
          break;
        case "partial":
          if (detail.transcript) {
            setPartialText(detail.transcript);
          }
          break;
        case "final":
          if (detail.transcript) {
            setPartialText("");
            onFinalRef.current?.(detail.transcript);
          }
          break;
        case "error": {
          const code = detail.error ?? "UNKNOWN";
          // Soft errors: keep listening state until ended
          if (code === "NO_MATCH" || code === "TIMEOUT") {
            setError(code === "NO_MATCH" ? "음성을 인식하지 못했습니다. 다시 말씀해 주세요." : "말씀 시간이 초과되었습니다.");
          } else if (code === "PERMISSION_DENIED") {
            setError("PERMISSION_DENIED");
            setIsListening(false);
            activeRequestId.current = null;
          } else if (code === "UNAVAILABLE") {
            setError("이 기기에서는 음성 입력을 사용할 수 없습니다.");
            setIsListening(false);
            activeRequestId.current = null;
          } else {
            setError(detail.message ?? "음성 인식 중 오류가 발생했습니다.");
          }
          break;
        }
        case "ended":
        case "stopping":
          setIsListening(false);
          activeRequestId.current = null;
          break;
        default:
          break;
      }
    };

    window.addEventListener("cama-native", onNative as EventListener);
    return () => {
      window.removeEventListener("cama-native", onNative as EventListener);
    };
  }, []);

  const start = useCallback(() => {
    if (!isSupported || isListening) {
      return false;
    }
    setError(null);
    setPartialText("");
    const requestId = startNativeSpeechRecognition({
      locale: options.locale ?? "ko-KR",
      maxDurationMs: options.maxDurationMs ?? 60_000,
      partialResults: true,
      prompt: options.prompt ?? "말씀해 주세요",
    });
    if (!requestId) {
      setError("앱에서만 음성 입력을 사용할 수 있습니다.");
      return false;
    }
    activeRequestId.current = requestId;
    setIsListening(true);
    return true;
  }, [
    isListening,
    isSupported,
    options.locale,
    options.maxDurationMs,
    options.prompt,
  ]);

  const stop = useCallback(() => {
    stopNativeSpeechRecognition();
  }, []);

  const cancel = useCallback(() => {
    cancelNativeSpeechRecognition();
    setIsListening(false);
    setPartialText("");
    activeRequestId.current = null;
  }, []);

  return {
    isSupported,
    isListening,
    partialText,
    error,
    start,
    stop,
    cancel,
    clearError: () => setError(null),
  };
}
