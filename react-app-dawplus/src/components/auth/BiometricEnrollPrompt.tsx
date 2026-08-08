import { useEffect, useState } from "react";
import {
  getBiometricStatus,
} from "@/apis/api/webview/biometric";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import {
  declineDeviceBiometric,
  enrollDeviceBiometric,
} from "@/lib/biometric/enrollDeviceBiometric";
import {
  isReactNativeWebView,
  requestNativeBiometricAvailability,
  requestNativeDeviceId,
} from "@/lib/webview/rnBridge";

type BiometricEnrollPromptProps = {
  loginId: string;
  reEnroll?: boolean;
  onDone: () => void;
};

export function BiometricEnrollPrompt({
  loginId,
  reEnroll = false,
  onDone,
}: BiometricEnrollPromptProps) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!isReactNativeWebView()) {
        onDone();
        return;
      }
      const availability = await requestNativeBiometricAvailability();
      if (!availability.ok || !availability.data.available || !availability.data.enrolled) {
        onDone();
        return;
      }
      const device = await requestNativeDeviceId();
      const deviceId =
        device.ok && typeof device.data.deviceId === "string"
          ? device.data.deviceId
          : null;
      if (!deviceId) {
        onDone();
        return;
      }
      try {
        const status = (await getBiometricStatus({ loginId, deviceId })).response;
        if (
          !status ||
          status.passwordMustChange ||
          status.deviceRegistered ||
          (!reEnroll && status.biometricPromptDeclined)
        ) {
          onDone();
          return;
        }
        if (!cancelled) setVisible(true);
      } catch {
        onDone();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loginId, onDone, reEnroll]);

  const close = () => {
    setVisible(false);
    onDone();
  };

  const onLater = async () => {
    setBusy(true);
    try {
      await declineDeviceBiometric(loginId);
    } finally {
      setBusy(false);
      close();
    }
  };

  const onUse = async () => {
    setBusy(true);
    try {
      const result = await enrollDeviceBiometric(loginId);
      if (result.ok) {
        toast({
          title: "생체 로그인 등록 완료",
          description: "다음부터 얼굴/지문으로 로그인할 수 있습니다.",
        });
      } else if (result.cancelled) {
        toast({
          title: "생체 인증 취소",
          description: "나중에 마이페이지에서 다시 등록할 수 있습니다.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "생체 등록 실패",
          description: result.message,
        });
      }
      close();
    } finally {
      setBusy(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">
          {reEnroll ? "생체 로그인 다시 등록" : "생체 로그인 사용"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          얼굴 또는 지문으로 빠르게 로그인할 수 있습니다. 생체 정보는 이 휴대폰
          밖으로 전송되지 않습니다.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button type="button" disabled={busy} onClick={() => void onUse()}>
            사용하기
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void onLater()}
          >
            나중에
          </Button>
        </div>
      </div>
    </div>
  );
}
