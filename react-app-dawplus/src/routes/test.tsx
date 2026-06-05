import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import VirtualKeypad from "@/components/ui/VirtualKeypad";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const [value, setValue] = useState("");
  const [isMasked, setIsMasked] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-3">
        <h1 className="text-xl font-bold text-slate-900">OTP 키패드 테스트</h1>
        <VirtualKeypad
          value={value}
          onChange={setValue}
          maxLength={6}
          autoConfirmOnMaxLength
          showOtpSlots
          otpSlotLength={6}
          maskValue={isMasked}
          allowMaskToggle
          randomizeDigits
          hapticFeedback
          soundFeedback
          onCancel={() => setValue("")}
          onConfirm={(otpValue) => {
            window.alert(`입력된 OTP: ${otpValue}`);
          }}
          confirmLabel="인증"
          cancelLabel="취소"
          resetLabel="전체삭제"
          deleteLabel="지움"
          disabledKeys={value.length === 6 ? [] : ["confirm"]}
        />
        <button
          type="button"
          onClick={() => setIsMasked((prev) => !prev)}
          className="w-fit rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700"
        >
          외부 마스킹 토글: {isMasked ? "ON" : "OFF"}
        </button>
        <p className="text-sm text-slate-600">
          현재 값: {value || "(비어있음)"}
        </p>
      </div>
    </div>
  );
}
