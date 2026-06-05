import { atom } from 'recoil';
import { AccountDiseaseInfo } from '@/services/apis/AccountDisease/response';

const selectedDiseaseState = atom<AccountDiseaseInfo[]>({
  key: 'selectedDiseaseState',
  default: [],
});

export default selectedDiseaseState;
