import mainApiClient from '../mainApiClient';

import { DepartmentDto } from './request';
import { DepartmentInfo } from './response';

/** [Foundation]관리자 전공 APIs **/
const adminDepartmentApi = {
  addAdminDepartment(dto: DepartmentDto) {
    /** 전공 등록 **/
    return mainApiClient.post<boolean>(`/api/admin/department`, dto);
  },
  getAdminDepartmentDetail(seq: number) {
    /** 전공 상세 **/
    return mainApiClient.get<DepartmentInfo>(`/api/admin/department/${seq}/view`);
  },
  updateAdminDepartment(seq: number, dto: DepartmentDto) {
    /** 전공 수정 **/
    return mainApiClient.put<boolean>(`/api/admin/department/${seq}/view`, dto);
  },
  removeAdminDepartment(seq: number) {
    /** 전공 삭제 **/
    return mainApiClient.delete<boolean>(`/api/admin/department/${seq}/view`);
  },
  fetchAdminDepartmentList() {
    /** 전공 리스트 **/
    return mainApiClient.get<DepartmentInfo[]>(`/api/admin/department/list?paging=false`);
  },
};

export default adminDepartmentApi;
