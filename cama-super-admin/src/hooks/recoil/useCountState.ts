import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import { countState } from '../../stores/countState';

export function useCountRecoilState() {
  return useRecoilState(countState);
}

export function useSetCountState() {
  return useSetRecoilState(countState);
}

export function useCountRecoilValue() {
  return useRecoilValue(countState);
}
