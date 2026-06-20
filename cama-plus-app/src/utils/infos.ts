import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import type { Firebase } from '@/constants/interfaces';

async function resolveFcmToken(): Promise<string | undefined> {
  try {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        return undefined;
      }
    }
    return await messaging().getToken();
  } catch (error) {
    console.log('FCM token error', error);
    return undefined;
  }
}

export const generateFirebaseInfo = async (): Promise<Firebase> => {
  const fcmToken = (await resolveFcmToken()) ?? '';
  const deviceName = await DeviceInfo.getDeviceName();

  return {
    device: deviceName,
    platform: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
    token: fcmToken,
  };
};
