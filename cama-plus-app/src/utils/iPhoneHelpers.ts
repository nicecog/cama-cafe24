import { Platform } from 'react-native';
import {
  isIphoneX,
  getStatusBarHeight,
} from 'react-native-iphone-screen-helper';

export const getBottomAdditionalHeight = () => {
  const isIphone = Platform.OS === 'ios' && isIphoneX();
  return isIphone ? 34 : 0;
};

export const getIphoneStatusBarHeight = () => {
  return Platform.OS === 'ios' ? getStatusBarHeight() : 0;
};
