import mainApiClient from '../mainApiClient';

import { AdminInfo } from '../../../constants/interfaces';

/** [Foundation]관리자 병원 APIs **/
const adminAccountApi = {
  getAdminHospitalDetail() {
    /** 병원 상세 **/
    return mainApiClient.get<AdminInfo>(`/api/admin/account/me`);
  },
};

export default adminAccountApi;
