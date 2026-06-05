import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

import selectedDiseaseState from '@/stores/selectedDiseaseState';

export function useSelectedDiseaseRecoilState() {
  return useRecoilState(selectedDiseaseState);
}

export function useSetSelectedDiseaseState() {
  return useSetRecoilState(selectedDiseaseState);
}

export function useSelectedDiseaseValue() {
  return useRecoilValue(selectedDiseaseState);
}
