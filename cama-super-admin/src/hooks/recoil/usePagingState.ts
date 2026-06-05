import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import { pagingState } from '../../stores/pagingState';

export function usePagingRecoilState() {
  return useRecoilState(pagingState);
}
