import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { HospitalDto } from './request';
import { HospitalInfo } from './response';

/** [Foundation]관리자 병원 APIs **/
const adminHospitalApi = {
  addAdminHospital(dto: HospitalDto) {
    /** 병원 등록 **/
    return mainApiClient.post<boolean>(`/api/admin/hospital`, dto);
  },
  getAdminHospitalDetail(seq: number) {
    /** 병원 상세 **/
    return mainApiClient.get<HospitalInfo>(`/api/admin/hospital/${seq}/view`);
  },
  updateAdminHospital(seq: number, dto: HospitalDto) {
    /** 병원 수정 **/
    return mainApiClient.put<boolean>(`/api/admin/hospital/${seq}/view`, dto);
  },
  removeAdminHospital(seq: number) {
    /** 병원 삭제 **/
    return mainApiClient.delete<boolean>(`/api/admin/hospital/${seq}/view`);
  },
  fetchAdminHospitalList(
    page: number,
    searchType: string,
    searchText: string,
  ) {
    /** 병원 리스트 **/
    return mainApiClient.get<Paginated<HospitalInfo[]>>(`/api/admin/hospital/list?page=${page}&searchType=${searchType}&searchText=${searchText}`);
  },
  fetchAdminHospitalListAll() {
    /** 병원 리스트 **/
    return mainApiClient.get<Paginated<HospitalInfo[]>>(`/api/admin/hospital/list?paging=false`);
  },
};

export default adminHospitalApi;
