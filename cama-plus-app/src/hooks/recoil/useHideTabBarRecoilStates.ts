import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import hideTabBarState from '@/stores/hideTabBarState';

export function useHideTabBarRecoilState() {
  return useRecoilState(hideTabBarState);
}

export function useSetHideTabBarState() {
  return useSetRecoilState(hideTabBarState);
}

export function useHideTabBarValue() {
  return useRecoilValue(hideTabBarState);
}
