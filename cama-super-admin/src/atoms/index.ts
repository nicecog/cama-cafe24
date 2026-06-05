import { atom } from 'recoil';

import { AuthInfo } from 'interfaces';
import { RoutePagination } from 'interfaces/menu';

export const drawerState = atom({
  key: 'drawerState',
  default: true,
});

export const authAtom = atom<AuthInfo | null>({
  key: 'authTokenAtom',
  default: null,
});

export const paginationAtom = atom<RoutePagination>({
  key: 'pagination',
  default: {},
});
