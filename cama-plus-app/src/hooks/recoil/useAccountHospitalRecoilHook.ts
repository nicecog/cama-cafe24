import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import accountHospitalInfoState from '@/stores/accountHospitalInfoState';

export function useAccountHospitalState() {
  return useRecoilState(accountHospitalInfoState);
}

export function useSetAccountHospitalState() {
  return useSetRecoilState(accountHospitalInfoState);
}

export function useAccountHospitalValue() {
  return useRecoilValue(accountHospitalInfoState);
}
