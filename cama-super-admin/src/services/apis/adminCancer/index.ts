import mainApiClient from '../mainApiClient';

import { DepartmentDto } from '../adminDepartment/request';
import { CancerInfo } from './response';

/** [Foundation]관리자 질병(암) APIs **/
const adminCancerApi = {
  addAdminCancer(dto: DepartmentDto) {
    /** 암 등록 **/
    return mainApiClient.post<boolean>(`/api/admin/cancer`, dto);
  },
  getAdminCancerDetail(seq: number) {
    /** 암 상세 **/
    return mainApiClient.get<CancerInfo>(`/api/admin/cancer/${seq}/view`);
  },
  updateAdminCancer(seq: number, dto: DepartmentDto) {
    /** 암 수정 **/
    return mainApiClient.put<boolean>(`/api/admin/cancer/${seq}/view`, dto);
  },
  removeAdminCancer(seq: number) {
    /** 암 삭제 **/
    return mainApiClient.delete<boolean>(`/api/admin/cancer/${seq}/view`);
  },
  fetchAdminCancerList() {
    /** 암 리스트 **/
    return mainApiClient.get<CancerInfo[]>(`/api/admin/cancer/list?paging=false`);
  },
};

export default adminCancerApi;
