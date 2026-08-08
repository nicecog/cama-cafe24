import {
  declineBiometricPrompt,
  enrollBiometricDevice,
} from "@/apis/api/webview/biometric";
import {
  isReactNativeWebView,
  requestNativeBiometricAuth,
  requestNativeBiometricAvailability,
  requestNativeDeviceId,
  requestNativeStoreBiometricSecret,
} from "@/lib/webview/rnBridge";

export type EnrollDeviceBiometricResult = {
  ok: boolean;
  cancelled?: boolean;
  message: string;
};

export async function enrollDeviceBiometric(
  loginId: string,
): Promise<EnrollDeviceBiometricResult> {
  if (!isReactNativeWebView()) {
    return { ok: false, message: "앱에서만 생체 로그인을 사용할 수 있습니다." };
  }

  const availability = await requestNativeBiometricAvailability();
  if (!availability.ok || !availability.data.available) {
    return {
      ok: false,
      message: "이 기기에서는 생체 인증을 사용할 수 없습니다.",
    };
  }
  if (!availability.data.enrolled) {
    return {
      ok: false,
      message:
        "기기에 얼굴/지문이 등록되어 있지 않습니다. 휴대폰 설정에서 먼저 등록해 주세요.",
    };
  }

  const auth = await requestNativeBiometricAuth({
    reason: "생체인식 진행합니다.",
    title: "생체 인증",
  });
  if (!auth.ok || !auth.data.authenticated) {
    return {
      ok: false,
      cancelled: true,
      message: "생체 인증이 취소되었습니다.",
    };
  }

  const device = await requestNativeDeviceId();
  const deviceId =
    device.ok && typeof device.data.deviceId === "string"
      ? device.data.deviceId
      : null;
  if (!deviceId) {
    return { ok: false, message: "기기 식별자를 확인할 수 없습니다." };
  }

  const enrolled = await enrollBiometricDevice({
    loginId,
    deviceId,
    platform: /iphone|ipad|ios/i.test(navigator.userAgent) ? "ios" : "android",
  });

  if (enrolled.error || !enrolled.response?.deviceRefreshToken) {
    return {
      ok: false,
      message:
        enrolled.error?.message || "생체 로그인 등록에 실패했습니다.",
    };
  }

  const stored = await requestNativeStoreBiometricSecret(
    enrolled.response.deviceRefreshToken,
  );
  if (!stored.ok) {
    return { ok: false, message: "기기 금고에 저장하지 못했습니다." };
  }

  return {
    ok: true,
    message:
      enrolled.response.message ||
      "생체 로그인이 등록되었습니다. 다음부터 얼굴/지문으로 로그인할 수 있습니다.",
  };
}

export async function declineDeviceBiometric(loginId: string) {
  try {
    await declineBiometricPrompt(loginId);
  } catch {
    // ignore
  }
}
