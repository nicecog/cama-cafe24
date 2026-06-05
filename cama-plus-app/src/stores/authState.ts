import { atom } from 'recoil';

type AuthType = 'loggedOut' | 'loggedIn' | 'loading' | 'selectInfo';

const authState = atom<AuthType>({
  key: 'authState',
  default: 'loading',
});

export default authState;
