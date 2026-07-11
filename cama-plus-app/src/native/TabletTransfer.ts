import { NativeModules, Platform } from 'react-native';

import { NATIVE_BRIDGE_ERRORS } from '@/constants/nativeBridge.types';
import { NativeBridgeError, toNativeBridgeError } from '@/native/bridgeErrors';

type CamaTabletTransferNative = {
  scanTabletQr: () => Promise<string>;
  sendHealthDataToTablet: (
    qrPayloadJson: string,
    healthDataJson: string,
  ) => Promise<boolean>;
};

const TabletTransfer = NativeModules.CamaTabletTransfer as
  | CamaTabletTransferNative
  | undefined;

function ensureAndroidModule(): CamaTabletTransferNative {
  if (Platform.OS !== 'android' || !TabletTransfer) {
    throw new NativeBridgeError(NATIVE_BRIDGE_ERRORS.NOT_IMPLEMENTED);
  }
  return TabletTransfer;
}

export async function scanTabletQrCode(): Promise<string> {
  try {
    const mod = ensureAndroidModule();
    return await mod.scanTabletQr();
  } catch (error) {
    throw toNativeBridgeError(error);
  }
}

export async function sendTabletHealthData(
  qrPayload: Record<string, unknown>,
  healthData: Record<string, unknown>,
): Promise<void> {
  try {
    const mod = ensureAndroidModule();
    await mod.sendHealthDataToTablet(
      JSON.stringify(qrPayload),
      JSON.stringify(healthData),
    );
  } catch (error) {
    throw toNativeBridgeError(error);
  }
}
