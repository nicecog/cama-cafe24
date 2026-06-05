/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

import {
  shouldShowLocalFromData,
  displayFcmDataNotification,
} from '@/services/notifications/fcmDisplay';
import { getTokenEncryptedStorage } from '@/storages/tokenStorage';

/** Background, Quit 상태: data-only 메시지는 로컬 알림 표시 (notification 페이로드는 OS가 표시) */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Handling Message in the Background!', remoteMessage);
  if (!shouldShowLocalFromData(remoteMessage)) {
    return;
  }

  const { data } = remoteMessage;
  if (data === undefined) {
    return;
  }

  if (Platform.OS === 'android') {
    const token = await getTokenEncryptedStorage();
    if (token === null || token === undefined) {
      return;
    }
    console.log('Background pushNotification-Android()');
    await displayFcmDataNotification(data);
  } else {
    console.log('Background pushNotification-iOS()');
    await displayFcmDataNotification(data);
  }
});

AppRegistry.registerComponent(appName, () => App);
