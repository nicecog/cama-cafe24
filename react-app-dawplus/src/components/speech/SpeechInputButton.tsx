import { Loader2, Mic, Square } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useDialog } from "@/hooks/useDialog";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { cn } from "@/lib/utils";

type SpeechInputButtonProps = {
  /** Append final transcript into the target field */
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
  /** Shown while listening under the control row */
  showStatus?: boolean;
};

/**
 * textarea 옆 직관적 STT 버튼.
 * - idle: 마이크
 * - listening: 중지(빨간 pulse)
 */
export function SpeechInputButton({
  onTranscript,
  disabled = false,
  className,
  showStatus = true,
}: SpeechInputButtonProps) {
  const { confirm, alert } = useDialog();
  const {
    isSupported,
    isListening,
    partialText,
    error,
    start,
    stop,
    clearError,
  } = useSpeechToText({
    onFinal: onTranscript,
    prompt: "문의사항을 말씀해 주세요",
  });

  useEffect(() => {
    if (!error) return;

    if (error === "PERMISSION_DENIED") {
      void confirm(
        {
          title: "마이크 권한이 필요합니다",
          body: "말로 입력하려면 마이크 권한을 허용해 주세요.\n설정에서 권한을 허용한 뒤 다시 시도해 주세요.",
          actionButton: "확인",
          cancelButton: "닫기",
        },
        () => clearError(),
        () => clearError(),
      );
      return;
    }

    void alert(error).then(() => clearError());
  }, [alert, clearError, confirm, error]);

  if (!isSupported) {
    return null;
  }

  const handlePress = () => {
    if (disabled) return;
    if (isListening) {
      stop();
      return;
    }
    start();
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Button
        type="button"
        variant="outline"
        aria-label={isListening ? "음성 입력 중지" : "말로 입력하기"}
        title={isListening ? "중지" : "말로 입력"}
        disabled={disabled}
        onClick={handlePress}
        className={cn(
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-gray-200 p-0",
          isListening &&
            "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
          !isListening && "text-[#ED7101] hover:bg-[#FFF1E6] hover:text-[#D96500]",
        )}
      >
        {isListening ? (
          <>
            <span className="absolute inset-0 animate-ping rounded-xl bg-red-200/60" />
            <Square className="relative h-4 w-4 fill-current" />
          </>
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>
      {showStatus && isListening ? (
        <span className="flex max-w-[4.5rem] items-center gap-0.5 text-center text-[10px] leading-tight text-red-600">
          <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
          {partialText ? "인식 중" : "듣는 중"}
        </span>
      ) : null}
    </div>
  );
}

/** Append STT result to existing textarea value */
export function appendSpeechTranscript(current: string, transcript: string): string {
  const next = transcript.trim();
  if (!next) return current;
  const base = current.trimEnd();
  if (!base) return next;
  // 문장 사이에 공백/줄바꿈
  const needsSpace = !/[\s\n]$/.test(base);
  return `${base}${needsSpace ? "\n" : ""}${next}`;
}
