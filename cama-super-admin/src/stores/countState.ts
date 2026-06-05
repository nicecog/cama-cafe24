import { atom } from 'recoil';

export interface CountState {
  doneContents: number;
  ingContents: number;
}

const defaultNavState: CountState = {
  doneContents: 0,
  ingContents: 0,
}

export const countState = atom<CountState>({
  key: 'countState',
  default: defaultNavState,
});
