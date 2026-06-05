import type { NavigationProp, ParamListBase } from '@react-navigation/native';

/** 건강코칭 WebView → RN 메인 홈 탭 (하단 바 복구) */
export function navigateToNativeHomeTab(
  navigation: NavigationProp<ParamListBase>,
) {
  navigation.navigate('MainBottomTabNavigation', {
    screen: 'HomeMainScreen',
  });
}
