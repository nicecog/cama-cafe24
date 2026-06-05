import { Platform } from 'react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

import {
  pushNotificationAndroid,
  pushNotificationIos,
  CustomFCMData,
} from '@/services/notifications/pushNotification';

/** Data-only FCM in background/quit: app must show a local notification. */
export function shouldShowLocalFromData(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): boolean {
  if (remoteMessage.notification) {
    return false;
  }
  return remoteMessage.data != null;
}

export async function displayFcmDataNotification(
  data: CustomFCMData,
): Promise<void> {
  if (Platform.OS === 'android') {
    pushNotificationAndroid(data);
  } else {
    pushNotificationIos(data);
  }
}
