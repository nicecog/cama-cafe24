import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import { authState } from '../../stores/authState';

export function useAuthRecoilState() {
  return useRecoilState(authState);
}

export function useSetAuthState() {
  return useSetRecoilState(authState);
}

export function useAuthRecoilValue() {
  return useRecoilValue(authState);
}
