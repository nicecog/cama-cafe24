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

/** Assets **/

interface PageState {}
import { useAccountValue } from '@/hooks/recoil/useAccountMeRecoilState';

const HelpPageMainScreen: React.FC<
  MainBottomTabNavigationProps<'HelpPageMainScreen'>
> = ({ navigation: { navigate }, route }) => {
  const webviewRef = useRef<WebView | null>(null);
  const account = useAccountValue();
  const webViewScripts = usePatientWebViewScripts(account?.loginId);
  const webViewSource = usePatientWebViewSource(patientWebviewUrls.help());
  const [loading, setLoading] = useState(true);
  const [topMenu, setTopMenu] = useState(false);
  const routesParams = useRoute();

  const onPressHardwareBackButton = () => {
    //console.log(' routesParams.name =>' + routesParams.name);
    if (routesParams.name === 'HelpPageMainScreen') {
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
  //console.log('WellbeingMainScreen account.loginId => ' + account.loginId);
  // console.log('adminUrl => ' + adminUrl);

  const handleOnMessage = createWebViewMessageHandler(webviewRef, {
    onNavigationStateChange: () => setTopMenu(false),
    onBottomSheet: visible => setTopMenu(visible),
  });

  return (
    <SafeAreaView
      style={{ position: 'relative', flex: 1, backgroundColor: '#FFF' }}
    >
      {/*loading && <FullScreenLoader /> */}
      {<LeftBackHeader title="도움말" />}
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

export default HelpPageMainScreen;

const styles = StyleSheet.create({});
