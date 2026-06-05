import { useRecoilState, useSetRecoilState } from 'recoil';

import authState from '@/stores/authState';

export function useAuthRecoilState() {
  return useRecoilState(authState);
}

export function useSetAuthState() {
  return useSetRecoilState(authState);
}
