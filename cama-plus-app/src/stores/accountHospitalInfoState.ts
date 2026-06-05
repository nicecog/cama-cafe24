import { atom } from 'recoil';

import { AccountHospitalInfo } from '@/services/apis/account/Response';

export const defaultAccount: AccountHospitalInfo = {
  hospitalName: '',
  hospitalSeq: -1,
  status: 'NOT_SERVICE',
};

const accountHospitalInfoState = atom<AccountHospitalInfo>({
  key: 'accountHospitalInfoState',
  default: defaultAccount,
});

export default accountHospitalInfoState;
