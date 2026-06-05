import { atom } from 'recoil';

const hideTabBarState = atom<boolean>({
  key: 'tabBarState',
  default: false,
});

export default hideTabBarState;
