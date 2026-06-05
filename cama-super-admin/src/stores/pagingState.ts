import { atom } from 'recoil';

import { Pagination } from '../services/apis/mainApiClient';

export type RouteTag =
  | 'DATA_SENSOR_LIST'       // 데이터 관리 > 센서 데이터 목록
  | 'CONTENT_TREATMENT_LIST'
  | 'CONTENT_TREATMENT_DISABLED_LIST'
  | 'SERVICE_LIST'
  | 'SYSTEM_HOSPITAL_LIST' // SYSTEM MANAGEMENT
  | 'SYSTEM_DOCTOR_LIST'
  | 'SYSTEM_HOSPITAL_DISEASE_LIST'
  | 'SYSTEM_TREATMENT_STATUS_LIST'

type PagingState = {
  [routeTag in RouteTag]: {
    prevPagination: Pagination;
    searchType: string;
    searchedValue: string;
    startDate: string;
    endDate: string;
  } | null;
}

export const pagingState = atom<PagingState>({
  key: 'pagingState',
  default: {
    ['DATA_SENSOR_LIST']: null,
    ['CONTENT_TREATMENT_LIST']: null,
    ['CONTENT_TREATMENT_DISABLED_LIST']: null,
    ['SERVICE_LIST']: null,
    ['SYSTEM_HOSPITAL_LIST']: null,
    ['SYSTEM_DOCTOR_LIST']: null,
    ['SYSTEM_HOSPITAL_DISEASE_LIST']: null,
    ['SYSTEM_TREATMENT_STATUS_LIST']: null,
  },
});
