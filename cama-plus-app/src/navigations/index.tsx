import React, { Fragment, useEffect, useState } from 'react';
import { Platform, StatusBar, PermissionsAndroid } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

/** Navigations **/
import AuthNavigation, {
  AuthNavigationParams,
} from '@/navigations/AuthNavigation';
import StepNavigation, {
  StepNavigationParams,
} from '@/navigations/StepNavigation';
import MainNavigation, {
  MainNavigationParams,
} from '@/navigations/MainNavigation';

/** Components **/
import FullScreenLoader from '@/components/Loaders/FullscrennLoader';
import CustomSplashScreen from '@/components/CustomSplashScreen';

/** Storages **/
import {
  getTokenEncryptedStorage,
  removeTokenEncryptedStorage,
} from '@/storages/tokenStorage';

/** Hooks **/
import { useAuthRecoilState } from '@/hooks/recoil/useAuthRecoilHooks';
import { useSetAccountState } from '@/hooks/recoil/useAccountMeRecoilState';

/** Services **/
import hospitalApi from '@/services/apis/hospital';
import accountApi from '@/services/apis/account';
import { displayFcmDataNotification } from '@/services/notifications/fcmDisplay';
import { CustomFCMData } from '@/services/notifications/pushNotification';

/** Values **/
import { defaultAccount } from '@/stores/accountMeState';

export type AppNavigationParams = {
  AuthNavigation: NavigatorScreenParams<AuthNavigationParams>;
  StepNavigation: NavigatorScreenParams<StepNavigationParams>;
  MainNavigation: NavigatorScreenParams<MainNavigationParams>;
};

export interface CustomRemoteMessage
  extends Omit<FirebaseMessagingTypes.RemoteMessage, 'data'> {
  data?: CustomFCMData;
}

const Stack = createNativeStackNavigator<AppNavigationParams>();

const AppNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useAuthRecoilState();
  const setAccountState = useSetAccountState();

  const onLogout = () => {
    accountApi
      .resetFirebaseToken()
      .then(() => {
        removeTokenEncryptedStorage()
          .then(() => {
            setAuthState('loggedOut');
            setAccountState(defaultAccount);
          })
          .catch(err => console.log({ err }));
      })
      .catch(err => console.log({ err }));
  };

  const initSettings = async () => {
    // setAuthState('loggedOut');
    BootSplash.hide({ fade: false });
    try {
      const token = await getTokenEncryptedStorage();
      /** NOTE: - undefined for iOS **/
      if (token === null || token === undefined) {
        setAuthState('loggedOut');
        return;
      }

      // removeTokenEncryptedStorage()
      //   .then(() => {
      //     setAuthState('loggedOut');
      //     setAccountState(defaultAccount);
      //   })
      //   .catch(err => console.log({ err }));
      // return;

      const account = await accountApi.getAccountMe();
      const serviceType = await hospitalApi.checkHospitalService();

      setAccountState(account);
      if (serviceType !== 'NOT_SERVICE') {
        setAuthState('loggedIn');
      } else {
        setAuthState('selectInfo');
      }
    } catch (err) {
      console.log({ err });
      setAuthState('loggedOut');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const requestUserPermission = () => {
    messaging()
      .requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      })
      .catch(err => console.log(err));
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('알림 권한이 허용되었습니다.');
        } else {
          console.log('알림 권한이 거부되었습니다.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    console.log('Platform.OS >> ', Platform.OS);
    requestUserPermission();
    if (Platform.OS === 'android') {
      console.log('Platform.Version >> ', Platform.Version);
      requestNotificationPermission();
    }

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('### Foreground Message!! ###');
      const token = await getTokenEncryptedStorage();
      const { data } = remoteMessage as CustomRemoteMessage;

      console.log('token => ' + token);
      console.log(JSON.stringify(data));

      if (data === undefined) {
        return;
      }
      if (token === null || token === undefined) {
        return;
      }

      console.log('Foreground local notification from data');
      await displayFcmDataNotification(data as CustomFCMData);
    });

    const unsubscribeOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('Notification opened app:', remoteMessage?.data);
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data) {
          console.log('Opened from quit state:', remoteMessage.data);
        }
      })
      .catch(err => console.log(err));

    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, []);

  useEffect(() => {
    initSettings();
  }, []);

  return (
    <Fragment>
      {Platform.OS === 'ios' && <StatusBar barStyle={'dark-content'} />}
      {/*(authState === 'loading' || loading) && <CustomSplashScreen /> */}
      {authState !== 'loading' && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {authState === 'loggedOut' && (
              <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
            )}
            {authState === 'selectInfo' && (
              <Stack.Screen name="StepNavigation" component={StepNavigation} />
            )}
            {authState === 'loggedIn' && (
              <Stack.Screen name="MainNavigation" component={MainNavigation} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </Fragment>
  );
};

export default AppNavigation;
