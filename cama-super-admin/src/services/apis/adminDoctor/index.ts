import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { DoctorDto } from './request';
import { DoctorInfo } from './response';

/** [Foundation]관리자 의사 APIs **/
const adminDoctorApi = {
  addAdminDoctor(dto: DoctorDto) {
    /** 의사 등록 **/
    return mainApiClient.post<boolean>(`/api/admin/doctor`, dto);
  },
  getAdminDoctorDetail(seq: number) {
    /** 의사 상세 **/
    return mainApiClient.get<DoctorInfo>(`/api/admin/doctor/${seq}/view`);
  },
  updateAdminDoctor(seq: number, dto: DoctorDto) {
    /** 의사 수정 **/
    return mainApiClient.put<boolean>(`/api/admin/doctor/${seq}/view`, dto);
  },
  removeAdminDoctor(seq: number) {
    /** 의사 삭제 **/
    return mainApiClient.delete<boolean>(`/api/admin/doctor/${seq}/view`);
  },
  fetchAdminDoctorList(
    page: number,
    searchType: string,
    searchText: string,
  ) {
    /** 의사 리스트 **/
    return mainApiClient.get<Paginated<DoctorInfo[]>>(`/api/admin/doctor/list?page=${page}&searchType=${searchType}&searchText=${searchText}`);
  },
};

export default adminDoctorApi;
