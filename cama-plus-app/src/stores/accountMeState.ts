import { atom, selector } from 'recoil';

import { Account } from '@/constants/interfaces';

export const defaultAccount: Account = {
  birth: '',
  createdAt: '',
  dropReason: '',
  droppedOutDate: '',
  email: '',
  gender: 'MALE',
  impUid: '',
  loginId: '',
  name: '',
  nickName: '',
  phone: '',
  profileImage: '',
  roles: ['USER'],
  seq: 0,
  signType: 'DEFAULT',
  updatedAt: '',
};

const accountMeState = atom<Account>({
  key: 'accountMeState',
  default: defaultAccount,
});

export default accountMeState;
