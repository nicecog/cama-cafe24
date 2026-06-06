import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { DoctorServiceStatusDto } from '../doctorContents/request';
import { ServiceInfo } from '../doctorContents/response';

/** [Foundation]관리자 서비스 APIs — Super Admin 전용 (전체 병원) **/
const adminServiceApi = {
  fetchAdminServiceList(
    page: number = 1,
    searchType: string = '',
    searchText: string = '',
    hospitalSeq?: number,
  ) {
    let url = `/api/admin/service/list?page=${page}&searchType=${searchType}&searchText=${searchText}`;
    if (hospitalSeq != null) {
      url += `&hospitalSeq=${hospitalSeq}`;
    }
    return mainApiClient.get<Paginated<ServiceInfo[]>>(url);
  },
  getAdminServiceDetail(seq: string | number) {
    return mainApiClient.get<ServiceInfo>(`/api/admin/service/${seq}/view`);
  },
  updateAdminServiceStatus(seq: string | number, dto: DoctorServiceStatusDto) {
    return mainApiClient.put<boolean>(`/api/admin/service/${seq}/view`, dto);
  },
};

export default adminServiceApi;
