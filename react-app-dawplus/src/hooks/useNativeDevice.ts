import { useCallback, useState } from "react";
import {
  isReactNativeWebView,
  requestNativeBiometricAuth,
  requestNativeBiometricAvailability,
  requestNativeCapabilities,
  requestNativeCapturePhoto,
  requestNativeLocation,
  requestNativePickPhoto,
  requestNativeVitalReading,
} from "@/lib/webview/rnBridge";
import type {
  BiometricAuthOptions,
  BiometricAuthResult,
  BiometricAvailability,
  CameraCaptureOptions,
  CameraCaptureResult,
  DeviceCapabilities,
  LocationOptions,
  LocationResult,
  VitalReadingResult,
  VitalTypeCd,
} from "@/lib/webview/nativeBridge.types";

type BridgeState = {
  loading: boolean;
  error: string | null;
};

function useBridgeAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<{ ok: boolean; data?: TResult; error?: string } | TResult | null>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      if (!isReactNativeWebView()) {
        setError("UNAVAILABLE");
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await action(...args);
        if (result && typeof result === "object" && "ok" in result) {
          if (!result.ok) {
            setError(result.error ?? "native_failed");
            return null;
          }
          return (result.data as TResult) ?? null;
        }
        return (result as TResult) ?? null;
      } catch {
        setError("native_failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [action],
  );

  return { run, loading, error, isWebView: isReactNativeWebView() };
}

export function useNativeDeviceCapabilities() {
  return useBridgeAction<[], DeviceCapabilities>(async () => {
    const result = await requestNativeCapabilities();
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: result.data.capabilities as DeviceCapabilities };
  });
}

export function useNativeCamera() {
  return useBridgeAction<[CameraCaptureOptions?], CameraCaptureResult>(
    async (options) => {
      const result = await requestNativeCapturePhoto(options);
      if (!result.ok) {
        return result;
      }
      return { ok: true, data: result.data as CameraCaptureResult };
    },
  );
}

export function useNativePhotoPicker() {
  return useBridgeAction<[CameraCaptureOptions?], CameraCaptureResult>(
    async (options) => {
      const result = await requestNativePickPhoto(options);
      if (!result.ok) {
        return result;
      }
      return { ok: true, data: result.data as CameraCaptureResult };
    },
  );
}

export function useNativeLocation() {
  return useBridgeAction<[LocationOptions?], LocationResult>(async (options) => {
    const result = await requestNativeLocation(options);
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: result.data as LocationResult };
  });
}

export function useNativeVital(vitalTypeCd: VitalTypeCd) {
  return useBridgeAction<[], VitalReadingResult>(async () => {
    const result = await requestNativeVitalReading(vitalTypeCd);
    if (!result.ok) {
      return result;
    }
    return { ok: true, data: result.data as VitalReadingResult };
  });
}

export function useNativeBiometric() {
  const [availability, setAvailability] = useState<BiometricAvailability | null>(null);
  const [state, setState] = useState<BridgeState>({ loading: false, error: null });

  const checkAvailability = useCallback(async () => {
    if (!isReactNativeWebView()) {
      setState({ loading: false, error: "UNAVAILABLE" });
      return null;
    }
    setState({ loading: true, error: null });
    const result = await requestNativeBiometricAvailability();
    setState({
      loading: false,
      error: result.ok ? null : (result.error ?? "native_failed"),
    });
    if (result.ok) {
      const data = result.data as BiometricAvailability;
      setAvailability(data);
      return data;
    }
    return null;
  }, []);

  const authenticate = useCallback(async (options?: BiometricAuthOptions) => {
    if (!isReactNativeWebView()) {
      setState({ loading: false, error: "UNAVAILABLE" });
      return null;
    }
    setState({ loading: true, error: null });
    const result = await requestNativeBiometricAuth(options);
    setState({
      loading: false,
      error: result.ok ? null : (result.error ?? "native_failed"),
    });
    if (result.ok) {
      return result.data as BiometricAuthResult;
    }
    return null;
  }, []);

  return {
    availability,
    checkAvailability,
    authenticate,
    loading: state.loading,
    error: state.error,
    isWebView: isReactNativeWebView(),
  };
}
