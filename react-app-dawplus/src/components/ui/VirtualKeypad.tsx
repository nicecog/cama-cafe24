import { useEffect, useMemo, useRef, useState } from "react";

type VirtualKeypadProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  maxLength?: number;
  className?: string;
  placeholder?: string;
  displayFormatter?: (value: string) => string;
  maskValue?: boolean;
  maskChar?: string;
  allowMaskToggle?: boolean;
  disabledKeys?: string[];
  randomizeDigits?: boolean;
  hapticFeedback?: boolean;
  soundFeedback?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  deleteLabel?: string;
  autoConfirmOnMaxLength?: boolean;
  showOtpSlots?: boolean;
  otpSlotLength?: number;
};

export default function VirtualKeypad({
  value,
  defaultValue = "",
  onChange,
  onConfirm,
  onCancel,
  maxLength = 20,
  className = "",
  placeholder = "입력값이 여기에 표시됩니다",
  displayFormatter,
  maskValue = false,
  maskChar = "•",
  allowMaskToggle = false,
  disabledKeys = [],
  randomizeDigits = false,
  hapticFeedback = false,
  soundFeedback = false,
  confirmLabel = "완료",
  cancelLabel = "취소",
  resetLabel = "초기화",
  deleteLabel = "삭제",
  autoConfirmOnMaxLength = false,
  showOtpSlots = false,
  otpSlotLength,
}: VirtualKeypadProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isMasked, setIsMasked] = useState(maskValue);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const lastAutoConfirmedValueRef = useRef<string>("");
  const currentValue = isControlled ? value : internalValue;
  const slotLength = otpSlotLength ?? maxLength;
  const digitLayout = useMemo(() => {
    const base = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    if (!randomizeDigits) {
      return base;
    }

    const shuffled = [...base];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [randomizeDigits]);
  const mainDigits = digitLayout.slice(0, 9);
  const zeroDigit = digitLayout[9];

  useEffect(() => {
    setIsMasked(maskValue);
  }, [maskValue]);

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        window.clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  useEffect(() => {
    if (!autoConfirmOnMaxLength || !onConfirm) {
      return;
    }
    if (disabledKeys.includes("confirm")) {
      return;
    }
    if (currentValue.length !== maxLength) {
      return;
    }
    if (lastAutoConfirmedValueRef.current === currentValue) {
      return;
    }

    lastAutoConfirmedValueRef.current = currentValue;
    onConfirm(currentValue);
  }, [
    autoConfirmOnMaxLength,
    currentValue,
    disabledKeys,
    maxLength,
    onConfirm,
  ]);

  const displayValue = useMemo(() => {
    if (!currentValue) {
      return placeholder;
    }

    const formatted = displayFormatter
      ? displayFormatter(currentValue)
      : currentValue;
    if (!isMasked) {
      return formatted;
    }
    return maskChar.repeat(currentValue.length);
  }, [currentValue, displayFormatter, isMasked, maskChar, placeholder]);

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const emitFeedback = () => {
    if (
      hapticFeedback &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      navigator.vibrate(12);
    }

    if (soundFeedback && typeof window !== "undefined") {
      const audioContext = new window.AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.type = "sine";
      oscillator.frequency.value = 740;
      gainNode.gain.value = 0.05;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.04);
    }
  };

  const isKeyDisabled = (key: string) => disabledKeys.includes(key);

  const appendDigit = (digit: string) => {
    if (isKeyDisabled(digit)) {
      return;
    }

    if (currentValue.length >= maxLength) {
      return;
    }

    emitFeedback();
    updateValue(`${currentValue}${digit}`);
  };

  const removeLast = () => {
    if (isKeyDisabled("delete")) {
      return;
    }

    if (!currentValue.length) {
      return;
    }

    emitFeedback();
    updateValue(currentValue.slice(0, -1));
  };

  const reset = () => {
    if (isKeyDisabled("reset")) {
      return;
    }

    emitFeedback();
    updateValue("");
  };

  const confirm = () => {
    if (isKeyDisabled("confirm")) {
      return;
    }
    emitFeedback();
    onConfirm?.(currentValue);
  };

  const cancel = () => {
    if (isKeyDisabled("cancel")) {
      return;
    }
    emitFeedback();
    onCancel?.();
  };

  const clearLongPressTimer = () => {
    if (longPressTimer) {
      window.clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const onDeletePressStart = () => {
    if (isKeyDisabled("delete")) {
      return;
    }

    const timer = window.setTimeout(() => {
      reset();
    }, 600);
    setLongPressTimer(timer);
  };

  return (
    <div
      className={`w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      role="group"
      aria-label="가상 키패드"
    >
      <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="mb-1 text-xs text-slate-500">입력값</p>
        <p
          className={`min-h-7 break-all text-right text-2xl font-semibold tracking-[0.02em] ${
            currentValue ? "text-slate-900" : "text-slate-400"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          {displayValue}
        </p>

        {showOtpSlots && (
          <div
            className="mt-3 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${slotLength}, minmax(0, 1fr))`,
            }}
            role="group"
            aria-label={`OTP ${slotLength}자리 입력 상태`}
          >
            {Array.from({ length: slotLength }, (_, idx) => {
              const hasValue = idx < currentValue.length;
              return (
                <div
                  key={`otp-slot-${idx}`}
                  className={`flex h-11 items-center justify-center rounded-lg border text-lg font-semibold ${
                    hasValue
                      ? "border-slate-800 bg-slate-800 text-white"
                      : "border-slate-300 bg-white text-slate-400"
                  }`}
                  aria-label={`${idx + 1}번째 자리 ${hasValue ? "입력됨" : "비어있음"}`}
                >
                  {hasValue ? (isMasked ? maskChar : currentValue[idx]) : ""}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {allowMaskToggle && (
        <button
          type="button"
          onClick={() => setIsMasked((prev) => !prev)}
          className="mb-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          aria-label={isMasked ? "입력값 표시" : "입력값 마스킹"}
        >
          {isMasked ? "표시" : "마스킹"}
        </button>
      )}

      <div className="grid grid-cols-3 gap-2">
        {mainDigits.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => appendDigit(digit)}
            disabled={isKeyDisabled(digit)}
            className="rounded-xl border border-slate-200 bg-white py-3 text-lg font-medium text-slate-900 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${digit} 입력`}
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={reset}
          disabled={isKeyDisabled("reset")}
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={resetLabel}
        >
          {resetLabel}
        </button>

        <button
          type="button"
          onClick={() => appendDigit(zeroDigit)}
          disabled={isKeyDisabled(zeroDigit)}
          className="rounded-xl border border-slate-200 bg-white py-3 text-lg font-medium text-slate-900 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`${zeroDigit} 입력`}
        >
          {zeroDigit}
        </button>

        <button
          type="button"
          onClick={removeLast}
          onMouseDown={onDeletePressStart}
          onMouseUp={clearLongPressTimer}
          onMouseLeave={clearLongPressTimer}
          onTouchStart={onDeletePressStart}
          onTouchEnd={clearLongPressTimer}
          disabled={isKeyDisabled("delete")}
          className="rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={deleteLabel}
        >
          {deleteLabel}
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={cancel}
          disabled={isKeyDisabled("cancel")}
          className="rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={cancelLabel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={isKeyDisabled("confirm")}
          className="rounded-xl border border-slate-200 bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={confirmLabel}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export type { VirtualKeypadProps };
