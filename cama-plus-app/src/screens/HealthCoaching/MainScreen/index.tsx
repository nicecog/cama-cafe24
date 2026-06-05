import React, { useState, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

/** Types **/
import { MainBottomTabNavigationProps } from '@/navigations/MainBottomTabNavigation';

/** Components **/
import FullScreenLoader from '@/components/Loaders/FullscrennLoader';
//import LogoHeader from '@/components/Headers/LogoHeader';
import LeftBackHeader from '@/components/Headers/LeftBackHeader';

/** Styles **/

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

/** Services **/

/** Assets **/

interface PageState {}
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

const HealthCoachingMainScreen: React.FC<
  MainBottomTabNavigationProps<'HealthCoachingMainScreen'>
> = ({ navigation, route }) => {
  const webviewRef = useRef<WebView | null>(null);
  const [loading, setLoading] = useState(true);
  const [topMenu, setTopMenu] = useState(false);
  const account = useAccountValue();
  const paramsCategoryCd = route.params.categoryCd;
  const routesParams = useRoute();
  const webViewScripts = usePatientWebViewScripts(account?.loginId);
  const coachingUri =
    paramsCategoryCd === 'M' && account?.loginId
      ? patientWebviewUrls.coachingHub(account.loginId)
      : patientWebviewUrls.help();
  const webViewSource = usePatientWebViewSource(coachingUri);

  const onPressHardwareBackButton = () => {
    //console.log(' routesParams.name =>' + routesParams.name);
    if (routesParams.name === 'HealthCoachingMainScreen') {
      return false; //BackKey 비활성(true)
    } else {
      return false;
    }
  };

  useFocusEffect(
    //화면으로 들어왔을때
    React.useCallback(() => {
      //console.log('들어옴1');
      //toggleBottomTabBar();
      BackHandler.addEventListener(
        'hardwareBackPress',
        onPressHardwareBackButton,
      );
      return () => {
        //console.log('나감1');
        //toggleBottomTabBar();
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onPressHardwareBackButton,
        );
      };
    }, []),
  );
  //console.log('paramsCategoryCd => ' + paramsCategoryCd);
  //console.log('HealthCoachingMainScreen account.loginId => ' + account.loginId);
  // console.log('adminUrl => ' + adminUrl);

  //const uri =
  //  'https://www.figma.com/proto/CvHPG4RwkmE9mZ3LjJACc1/20230908_CAMA-Plus-%EB%B3%B5%EC%82%AC%EB%B3%B8?page-id=333%3A3864&type=design&node-id=740-4317&viewport=1374%2C-922%2C0.14&t=uwrqbJRFYggHVdhJ-1&scaling=scale-down&starting-point-node-id=740%3A4317&show-proto-sidebar=1&mode=design';

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
      {topMenu && <LeftBackHeader title="건강코칭" />}
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

export default HealthCoachingMainScreen;

const styles = StyleSheet.create({});
