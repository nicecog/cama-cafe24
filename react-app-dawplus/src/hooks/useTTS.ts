import { useCallback, useEffect, useState } from "react";

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

  // 음성 목록 로드
  useEffect(() => {
    setIsSupported("speechSynthesis" in window);

    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // 한국어 음성 중 가장 좋은 음성 자동 선택
        const koreanVoices = availableVoices.filter((voice) =>
          voice.lang.startsWith("ko"),
        );

        if (koreanVoices.length > 0) {
          // 우선순위: Google > Microsoft > 기타
          const preferredVoice =
            koreanVoices.find((v) => v.name.includes("Google")) ||
            koreanVoices.find((v) => v.name.includes("Microsoft")) ||
            koreanVoices.find((v) => v.name.includes("Female")) || // 여성 음성 선호
            koreanVoices[0];

          setSelectedVoice(preferredVoice);
        }
      };

      // 음성 목록이 비동기로 로드될 수 있음
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // 한국어 음성 목록 가져오기
  const getKoreanVoices = useCallback(() => {
    return voices.filter((voice) => voice.lang.startsWith("ko"));
  }, [voices]);

  const speak = useCallback(
    (text: string, options?: TTSOptions) => {
      if (!isSupported) {
        console.warn("TTS가 지원되지 않는 브라우저입니다.");
        return;
      }

      // 이미 말하고 있으면 중지
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // 음성 설정 (선택된 음성 또는 옵션의 음성)
      if (options?.voiceName) {
        const voice = voices.find((v) => v.name === options.voiceName);
        if (voice) utterance.voice = voice;
      } else if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // 한국어 설정
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
        // 사용자가 중지한 경우는 에러로 처리하지 않음
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
    [isSupported, voices, selectedVoice],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

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
