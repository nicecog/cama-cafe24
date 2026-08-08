import type { RefObject } from 'react';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
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
  analyzeFoodImage,
  authenticateBiometric,
  cancelSpeechRecognition,
  capturePhoto,
  checkSpeechRecognitionAvailable,
  clearBiometricSecret,
  getBiometricSecret,
  getCurrentLocation,
  getDeviceCapabilities,
  getDeviceId,
  getFoodVisionInfo,
  hasBiometricSecret,
  isBiometricAvailable,
  openHealthConnectSettings,
  pauseSpeech,
  pickPhotoFromLibrary,
  readVital,
  readVitalSamples,
  resumeSpeech,
  speakText,
  startSpeechRecognition,
  stopSpeech,
  stopSpeechRecognition,
  storeBiometricSecret,
} from '@/native/NativeBridgeModule';
import { toNativeBridgeError } from '@/native/bridgeErrors';
import { NativeBridgeError } from '@/native/bridgeErrors';
import { NATIVE_BRIDGE_ERRORS } from '@/constants/nativeBridge.types';
import {
  scanTabletQrCode,
  sendTabletHealthData,
} from '@/native/TabletTransfer';

let speechRecognitionSubscription: { remove: () => void } | null = null;

async function ensureMicPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: '마이크 권한',
      message: '말로 문의사항을 입력하려면 마이크 권한이 필요합니다.',
      buttonPositive: '허용',
      buttonNegative: '거부',
    },
  );
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new NativeBridgeError(NATIVE_BRIDGE_ERRORS.PERMISSION_DENIED);
  }
}

function clearSpeechRecognitionSubscription() {
  speechRecognitionSubscription?.remove();
  speechRecognitionSubscription = null;
}

async function ensureCameraPermission(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: '카메라 권한',
      message: '음식 사진으로 칼로리를 추정하려면 카메라 권한이 필요합니다.',
      buttonPositive: '허용',
      buttonNegative: '거부',
    },
  );
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new NativeBridgeError(NATIVE_BRIDGE_ERRORS.PERMISSION_DENIED);
  }
}

async function ensureTabletPermissions(cameraOnly: boolean): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  const permissions: string[] = [PermissionsAndroid.PERMISSIONS.CAMERA];
  if (!cameraOnly) {
    if (Platform.Version >= 31) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      );
    } else {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }

  const results = await PermissionsAndroid.requestMultiple(permissions);
  const denied = Object.values(results).some(
    status => status !== PermissionsAndroid.RESULTS.GRANTED,
  );
  if (denied) {
    throw new NativeBridgeError(NATIVE_BRIDGE_ERRORS.PERMISSION_DENIED);
  }
}
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
      case 'readVitalSamples': {
        const result = await readVitalSamples(
          message.vitalTypeCd,
          message.daysBack ?? 1,
        );
        respond(webviewRef, {
          type: 'vitalSamples',
          requestId,
          ok: true,
          vitalTypeCd: result.vitalTypeCd,
          samples: result.samples,
          count: result.count,
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
      case 'storeBiometricSecret': {
        const stored = await storeBiometricSecret(message.secret);
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: true,
          mode: 'storeSecret',
          ...stored,
        });
        return;
      }
      case 'getBiometricSecret': {
        const secret = await getBiometricSecret();
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: true,
          mode: 'getSecret',
          ...secret,
        });
        return;
      }
      case 'clearBiometricSecret': {
        const cleared = await clearBiometricSecret();
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: true,
          mode: 'clearSecret',
          ...cleared,
        });
        return;
      }
      case 'hasBiometricSecret': {
        const has = await hasBiometricSecret();
        respond(webviewRef, {
          type: 'biometric',
          requestId,
          ok: true,
          mode: 'hasSecret',
          ...has,
        });
        return;
      }
      case 'getDeviceId': {
        const device = await getDeviceId();
        respond(webviewRef, {
          type: 'deviceId',
          requestId,
          ok: true,
          ...device,
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
      case 'openHealthConnectSettings': {
        await openHealthConnectSettings();
        respond(webviewRef, {
          type: 'healthConnectSettings',
          requestId,
          ok: true,
        });
        return;
      }
      case 'checkSpeechRecognitionAvailable': {
        const availability = await checkSpeechRecognitionAvailable();
        respond(webviewRef, {
          type: 'speechRecognition',
          requestId,
          ok: true,
          event: 'availability',
          available: availability.available,
          implemented: availability.implemented,
        });
        return;
      }
      case 'startSpeechRecognition': {
        await ensureMicPermission();
        clearSpeechRecognitionSubscription();
        speechRecognitionSubscription = DeviceEventEmitter.addListener(
          'CamaSpeechRecognition',
          (payload: {
            event?: string;
            transcript?: string;
            error?: string;
            message?: string;
          }) => {
            injectNativeEvent(webviewRef, {
              type: 'speechRecognition',
              requestId,
              ok: payload.event !== 'error',
              event: payload.event,
              transcript: payload.transcript,
              error: payload.error,
              message: payload.message,
            });
            if (payload.event === 'ended' || payload.event === 'error') {
              // keep listening until ended; error also ends session in native
              if (payload.event === 'ended') {
                clearSpeechRecognitionSubscription();
              }
            }
          },
        );
        try {
          await startSpeechRecognition(message.options ?? {});
          respond(webviewRef, {
            type: 'speechRecognition',
            requestId,
            ok: true,
            event: 'started',
          });
        } catch (error) {
          clearSpeechRecognitionSubscription();
          throw error;
        }
        return;
      }
      case 'stopSpeechRecognition': {
        await stopSpeechRecognition();
        respond(webviewRef, {
          type: 'speechRecognition',
          requestId,
          ok: true,
          event: 'stopping',
        });
        return;
      }
      case 'cancelSpeechRecognition': {
        await cancelSpeechRecognition();
        clearSpeechRecognitionSubscription();
        respond(webviewRef, {
          type: 'speechRecognition',
          requestId,
          ok: true,
          event: 'ended',
        });
        return;
      }
      case 'scanTabletQr': {
        await ensureTabletPermissions(true);
        const raw = await scanTabletQrCode();
        respond(webviewRef, {
          type: 'tabletQrScan',
          requestId,
          ok: true,
          raw,
        });
        return;
      }
      case 'sendTabletHealthData': {
        await ensureTabletPermissions(false);
        await sendTabletHealthData(
          message.qrPayload as Record<string, unknown>,
          message.healthData as Record<string, unknown>,
        );
        respond(webviewRef, {
          type: 'tabletHealthDataSent',
          requestId,
          ok: true,
        });
        return;
      }
      case 'analyzeFoodImage': {
        const options = message.options ?? {};
        if (options.source !== 'library') {
          await ensureCameraPermission();
        }
        const analysis = await analyzeFoodImage(options);
        respond(webviewRef, {
          type: 'foodImageAnalysis',
          requestId,
          ok: true,
          ...analysis,
        });
        return;
      }
      case 'getFoodVisionInfo': {
        const info = await getFoodVisionInfo();
        respond(webviewRef, {
          type: 'foodVisionInfo',
          requestId,
          ok: true,
          ...info,
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
      readVitalSamples: 'vitalSamples',
      checkBiometricAvailable: 'biometric',
      authenticateBiometric: 'biometric',
      storeBiometricSecret: 'biometric',
      getBiometricSecret: 'biometric',
      clearBiometricSecret: 'biometric',
      hasBiometricSecret: 'biometric',
      getDeviceId: 'deviceId',
      speakText: 'speech',
      stopSpeech: 'speech',
      pauseSpeech: 'speech',
      resumeSpeech: 'speech',
      openHealthConnectSettings: 'healthConnectSettings',
      checkSpeechRecognitionAvailable: 'speechRecognition',
      startSpeechRecognition: 'speechRecognition',
      stopSpeechRecognition: 'speechRecognition',
      cancelSpeechRecognition: 'speechRecognition',
      scanTabletQr: 'tabletQrScan',
      sendTabletHealthData: 'tabletHealthDataSent',
      analyzeFoodImage: 'foodImageAnalysis',
      getFoodVisionInfo: 'foodVisionInfo',
    };
    respondError(
      webviewRef,
      responseTypeMap[message.type] ?? 'bridgeError',
      requestId,
      error,
    );
  }
}
