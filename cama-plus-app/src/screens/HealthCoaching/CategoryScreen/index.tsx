import React, { useState, useRef, useMemo } from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

/** Types **/
import { MainNavigationScreenProps } from '@/navigations/MainNavigation';

/** Components **/
import FullScreenLoader from '@/components/Loaders/FullscrennLoader';
import LogoHeader from '@/components/Headers/LogoHeader';

/** Hooks **/
import { useFocusEffect } from '@react-navigation/native';
import { patientWebviewUrls } from '@/config/webviewUrls';
import {
  patientWebViewPerformanceProps,
  usePatientWebViewScripts,
  usePatientWebViewSource,
} from '@/hooks/usePatientWebViewSource';
import { createWebViewMessageHandler } from '@/utils/webviewBridge';
import { navigateToNativeHomeTab } from '@/utils/nativeHomeNavigation';

/** Assets **/
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

const HealthCoachingCategoryScreen: React.FC<
  MainNavigationScreenProps<'HealthCoachingCategoryScreen'>
> = ({
  navigation,
  route: {
    params: { categoryCd },
  },
}) => {
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [topMenu, setTopMenu] = useState(false);
  const account = useAccountValue();
  const routesParams = useRoute();
  const webViewScripts = usePatientWebViewScripts(account?.loginId);

  const coachingUri = useMemo(() => {
    if (!account?.loginId) {
      return patientWebviewUrls.help();
    }
    return patientWebviewUrls.coachingCategory(categoryCd, account.loginId);
  }, [account?.loginId, categoryCd]);

  const webViewSource = usePatientWebViewSource(coachingUri);

  const onPressHardwareBackButton = () => {
    if (routesParams.name === 'HealthCoachingCategoryScreen') {
      return false;
    }
    return false;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener(
        'hardwareBackPress',
        onPressHardwareBackButton,
      );
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onPressHardwareBackButton,
        );
      };
    }, []),
  );

  const handleOnMessage = createWebViewMessageHandler(webviewRef, {
    onNavigationStateChange: () => setTopMenu(false),
    onBottomSheet: visible => setTopMenu(visible),
    onGoNativeHome: () => navigateToNativeHomeTab(navigation),
  });

  return (
    <SafeAreaView
      style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}
    >
      {loading && <FullScreenLoader />}
      {topMenu && <LogoHeader />}
      <View style={{ position: 'relative', flex: 1 }}>
        <WebView
          ref={webviewRef}
          source={webViewSource}
          onMessage={handleOnMessage}
          onLoadEnd={() => setLoading(false)}
          {...patientWebViewPerformanceProps}
          {...webViewScripts}
        />
      </View>
    </SafeAreaView>
  );
};

export default HealthCoachingCategoryScreen;

const styles = StyleSheet.create({});
