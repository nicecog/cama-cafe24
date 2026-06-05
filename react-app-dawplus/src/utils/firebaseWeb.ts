import type { CamaFirebase } from "@/apis/types/auth.types";

/** 웹 SPA용 Firebase DTO (RN generateFirebaseInfo 대체) */
export async function createWebFirebaseInfo(): Promise<CamaFirebase> {
  const ua =
    typeof navigator !== "undefined" ? navigator.userAgent : "web-browser";
  const isIos = /iPhone|iPad|iPod/i.test(ua);

  return {
    device: "cama-web-spa",
    platform: isIos ? "IOS" : "ANDROID",
    token: "web-no-fcm",
  };
}
