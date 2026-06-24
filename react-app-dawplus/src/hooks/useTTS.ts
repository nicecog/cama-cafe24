import { useCallback, useEffect, useState } from "react";
import {
  postNativeSpeechCommand,
  shouldUseNativeSpeechSynthesis,
} from "@/lib/webview/nativeBridgeClient";

interface TTSOptions {
  lang?: string;
  rate?: number; // 속도 (0.1 ~ 10, 기본 1.0)
  pitch?: number; // 음높이 (0 ~ 2, 기본 1.0)
  volume?: number; // 볼륨 (0 ~ 1, 기본 1.0)
  voiceName?: string; // 특정 음성 이름
}

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const useNativeBridge = shouldUseNativeSpeechSynthesis();

  useEffect(() => {
    if (useNativeBridge) {
      setIsSupported(true);
      return;
    }

    setIsSupported("speechSynthesis" in window);

    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        const koreanVoices = availableVoices.filter((voice) =>
          voice.lang.startsWith("ko"),
        );

        if (koreanVoices.length > 0) {
          const preferredVoice =
            koreanVoices.find((v) => v.name.includes("Google")) ||
            koreanVoices.find((v) => v.name.includes("Microsoft")) ||
            koreanVoices.find((v) => v.name.includes("Female")) ||
            koreanVoices[0];

          setSelectedVoice(preferredVoice);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [useNativeBridge]);

  useEffect(() => {
    if (!useNativeBridge) {
      return undefined;
    }

    const onNativeSpeech = (event: Event) => {
      const detail = (event as CustomEvent<{
        type?: string;
        event?: string;
      }>).detail;

      if (!detail || detail.type !== "speech") {
        return;
      }

      switch (detail.event) {
        case "started":
          setIsSpeaking(true);
          setIsPaused(false);
          break;
        case "ended":
          setIsSpeaking(false);
          setIsPaused(false);
          break;
        case "paused":
          setIsPaused(true);
          break;
        case "resumed":
          setIsPaused(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener("cama-native", onNativeSpeech as EventListener);
    return () => {
      window.removeEventListener("cama-native", onNativeSpeech as EventListener);
    };
  }, [useNativeBridge]);

  const getKoreanVoices = useCallback(() => {
    return voices.filter((voice) => voice.lang.startsWith("ko"));
  }, [voices]);

  const speak = useCallback(
    (text: string, options?: TTSOptions) => {
      if (!isSupported) {
        console.warn("TTS가 지원되지 않는 브라우저입니다.");
        return;
      }

      if (useNativeBridge) {
        postNativeSpeechCommand({
          type: "speakText",
          text,
          rate: options?.rate ?? 1.0,
        });
        return;
      }

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      if (options?.voiceName) {
        const voice = voices.find((v) => v.name === options.voiceName);
        if (voice) utterance.voice = voice;
      } else if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.lang = options?.lang || "ko-KR";
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        if (event.error !== "interrupted" && event.error !== "canceled") {
          console.error("TTS 오류:", event.error);
        }
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, useNativeBridge, voices, selectedVoice],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    if (useNativeBridge) {
      postNativeSpeechCommand({ type: "stopSpeech" });
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported, useNativeBridge]);

  const pause = useCallback(() => {
    if (!isSupported) return;

    if (useNativeBridge) {
      postNativeSpeechCommand({ type: "pauseSpeech" });
      return;
    }

    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, useNativeBridge]);

  const resume = useCallback(() => {
    if (!isSupported) return;

    if (useNativeBridge) {
      postNativeSpeechCommand({ type: "resumeSpeech" });
      return;
    }

    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, useNativeBridge]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    koreanVoices: getKoreanVoices(),
    selectedVoice,
    setSelectedVoice,
  };
};
