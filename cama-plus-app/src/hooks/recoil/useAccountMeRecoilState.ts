import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import accountMeState from '@/stores/accountMeState';

export function useAccountState() {
  return useRecoilState(accountMeState);
}

export function useSetAccountState() {
  return useSetRecoilState(accountMeState);
}

export function useAccountValue() {
  return useRecoilValue(accountMeState);
}
