import { motion } from "framer-motion";
import { Pause, Play, Settings2, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useTTS } from "@/hooks/useTTS";
import { cn } from "@/lib/utils";

interface TTSButtonProps {
  text: string;
  className?: string;
  rate?: number; // 읽기 속도
  showLabel?: boolean; // 라벨 표시 여부
  showVoiceSelector?: boolean; // 음성 선택 UI 표시 여부
}

export default function TTSButton({
  text,
  className,
  rate = 1.0,
  showLabel = true,
  showVoiceSelector = false,
}: TTSButtonProps) {
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    koreanVoices,
    selectedVoice,
    setSelectedVoice,
  } = useTTS();

  const [showSettings, setShowSettings] = useState(false);

  if (!isSupported) {
    return null; // TTS 미지원 브라우저에서는 버튼 숨김
  }

  const handleClick = () => {
    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text, { rate });
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  const handleVoiceChange = (voiceName: string) => {
    const voice = koreanVoices.find((v) => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* 재생/일시정지 버튼 */}
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          "group relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5",
          "transition-all duration-200 ease-out",
          "text-primary hover:bg-primary/10",
          isSpeaking && "bg-primary text-white hover:bg-primary",
        )}
        aria-label={isSpeaking ? "일시정지" : "읽어주기"}
      >
        {isSpeaking && !isPaused && (
          <span className="absolute inset-0 -z-10 rounded-full bg-primary/10 animate-pulse" />
        )}
        {isSpeaking ? (
          isPaused ? (
            <Play
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          ) : (
            <Pause
              size={16}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          )
        ) : (
          <Volume2
            size={16}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        )}
        {showLabel && (
          <span className="text-xs font-medium">
            {isSpeaking ? (isPaused ? "계속" : "일시정지") : "읽어주기"}
          </span>
        )}
      </motion.button>

      {/* 중지 버튼 */}
      {isSpeaking && (
        <motion.button
          type="button"
          onClick={handleStop}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
          aria-label="중지"
        >
          <VolumeX
            size={16}
            className="transition-transform duration-200 group-hover:scale-110"
          />
        </motion.button>
      )}

      {/* 음성 선택 버튼 */}
      {showVoiceSelector && koreanVoices.length > 1 && (
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            className="rounded-full p-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            aria-label="음성 설정"
          >
            <Settings2
              size={16}
              className="transition-transform duration-200 hover:rotate-45"
            />
          </motion.button>

          {/* 음성 선택 드롭다운 */}
          {showSettings && (
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px] z-50">
              <p className="text-xs font-semibold text-gray-500 px-2 py-1">
                음성 선택
              </p>
              <div className="max-h-[200px] overflow-y-auto">
                {koreanVoices.map((voice) => (
                  <button
                    key={voice.name}
                    type="button"
                    onClick={() => {
                      handleVoiceChange(voice.name);
                      setShowSettings(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors text-sm",
                      selectedVoice?.name === voice.name &&
                        "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{voice.name}</span>
                      {voice.name.includes("Google") && (
                        <span className="text-xs text-green-600 ml-2">
                          추천
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {voice.lang} • {voice.localService ? "로컬" : "온라인"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
