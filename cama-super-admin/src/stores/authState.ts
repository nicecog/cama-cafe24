import { atom } from 'recoil';

import { AuthInfo } from '../services/apis/auth/response';

export const authState = atom<AuthInfo | null>({
  key: 'authState',
  default: null,
});
