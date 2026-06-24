import type { RefObject } from 'react';
import type WebView from 'react-native-webview';

import type {
  BiometricAuthOptions,
  CameraCaptureOptions,
  LocationOptions,
  NativeBridgeResponseBase,
  VitalTypeCd,
  WebToNativeRequest,
} from '@/constants/nativeBridge.types';
import { getTodayStepCountFromDevice } from '@/native/StepCounter';
import {
  authenticateBiometric,
  capturePhoto,
  getCurrentLocation,
  getDeviceCapabilities,
  isBiometricAvailable,
  pauseSpeech,
  pickPhotoFromLibrary,
  readVital,
  resumeSpeech,
  speakText,
  stopSpeech,
} from '@/native/NativeBridgeModule';
import { toNativeBridgeError } from '@/native/bridgeErrors';
import { generateFirebaseInfo } from '@/utils/infos';

function injectNativeEvent(
  webviewRef: RefObject<WebView | null>,
  detail: Record<string, unknown>,
) {
  const payload = JSON.stringify(detail).replace(/</g, '\\u003c');
  webviewRef.current?.injectJavaScript(`
    (function() {
      try {
        window.dispatchEvent(new CustomEvent('cama-native', { detail: ${payload} }));
      } catch (e) {}
    })();
    true;
  `);
}

function respond(
  webviewRef: RefObject<WebView | null>,
  detail: NativeBridgeResponseBase & Record<string, unknown>,
) {
  injectNativeEvent(webviewRef, detail);
}

function respondError(
  webviewRef: RefObject<WebView | null>,
  responseType: string,
  requestId: string,
  error: unknown,
) {
  const bridgeError = toNativeBridgeError(error);
  respond(webviewRef, {
    type: responseType,
    requestId,
    ok: false,
    error: bridgeError.code,
  });
}

export async function dispatchBridgeRequest(
  webviewRef: RefObject<WebView | null>,
  message: WebToNativeRequest,
): Promise<void> {
  const { requestId } = message;

  try {
    switch (message.type) {
      case 'getStepCount': {
        const steps = await getTodayStepCountFromDevice();
        respond(webviewRef, {
          type: 'stepCount',
          requestId,
          ok: true,
          steps,
        });
        return;
      }
      case 'getFcmToken': {
        const firebase = await generateFirebaseInfo();
        respond(webviewRef, {
          type: 'fcmToken',
          requestId,
          ok: Boolean(firebase.token),
          firebase,
        });
        return;
      }
      case 'getCapabilities': {
        const capabilities = await getDeviceCapabilities();
        respond(webviewRef, {
          type: 'capabilities',
          requestId,
          ok: true,
          capabilities,
        });
        return;
      }
      case 'capturePhoto': {
        const result = await capturePhoto(message.options ?? {});
        respond(webviewRef, {
          type: 'cameraCapture',
          requestId,
          ok: true,
          ...result,
        });
        return;
      }
      case 'pickPhoto': {
        const result = await pickPhotoFromLibrary(message.options ?? {});
        respond(webviewRef, {
          type: 'cameraCapture',
          requestId,
          ok: true,
          ...result,
        });
        return;
      }
      case 'getCurrentLocation': {
        const location = await getCurrentLocation(message.options ?? {});
        respond(webviewRef, {
          type: 'location',
          requestId,
          ok: true,
          ...location,
        });
        return;
      }
      case 'readVital': {
        const vital = await readVital(message.vitalTypeCd);
        respond(webviewRef, {
          type: 'vitalReading',
          requestId,
          ok: true,
          ...vital,
        });
        return;
      }
      case 'checkBiometricAvailable': {
        const availability = await isBiometricAvailable();
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: true,
          mode: 'availability',
          ...availability,
        });
        return;
      }
      case 'authenticateBiometric': {
        const auth = await authenticateBiometric(
          message.options ?? ({} as BiometricAuthOptions),
        );
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: auth.authenticated,
          mode: 'authenticate',
          ...auth,
        });
        return;
      }
      case 'speakText': {
        injectNativeEvent(webviewRef, {
          type: 'speech',
          requestId,
          ok: true,
          event: 'started',
        });
        try {
          await speakText(message.text, message.rate ?? 0.9);
        } catch (error) {
          respondError(webviewRef, 'speech', requestId, error);
          return;
        }
        injectNativeEvent(webviewRef, {
          type: 'speech',
          requestId,
          ok: true,
          event: 'ended',
        });
        return;
      }
      case 'stopSpeech': {
        await stopSpeech();
        injectNativeEvent(webviewRef, {
          type: 'speech',
          requestId,
          ok: true,
          event: 'ended',
        });
        return;
      }
      case 'pauseSpeech': {
        await pauseSpeech();
        injectNativeEvent(webviewRef, {
          type: 'speech',
          requestId,
          ok: true,
          event: 'paused',
        });
        return;
      }
      case 'resumeSpeech': {
        await resumeSpeech();
        injectNativeEvent(webviewRef, {
          type: 'speech',
          requestId,
          ok: true,
          event: 'resumed',
        });
        return;
      }
      default:
        return;
    }
  } catch (error) {
    const responseTypeMap: Record<string, string> = {
      getStepCount: 'stepCount',
      getFcmToken: 'fcmToken',
      getCapabilities: 'capabilities',
      capturePhoto: 'cameraCapture',
      pickPhoto: 'cameraCapture',
      getCurrentLocation: 'location',
      readVital: 'vitalReading',
      checkBiometricAvailable: 'biometric',
      authenticateBiometric: 'biometric',
      speakText: 'speech',
      stopSpeech: 'speech',
      pauseSpeech: 'speech',
      resumeSpeech: 'speech',
    };
    respondError(
      webviewRef,
      responseTypeMap[message.type] ?? 'bridgeError',
      requestId,
      error,
    );
  }
}
