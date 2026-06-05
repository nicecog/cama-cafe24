import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { DiseaseDto } from './request';
import { StandardDiseaseInfo, StandardDiseaseRowInfo } from './response';

/** [Foundation]관리자 질환 기준정보 APIs **/
const adminDiseaseApi = {
  addAdminDisease(dto: DiseaseDto) {
    /** 질환 등록 **/
    return mainApiClient.post<boolean>(`/api/admin/disease`, dto);
  },
  getAdminDiseaseDetail(seq: number) {
    /** 질환 상세 **/
    return mainApiClient.get<StandardDiseaseInfo>(`/api/admin/disease/${seq}/view`);
  },
  updateAdminDisease(seq: number, dto: DiseaseDto) {
    /** 질환 수정 **/
    return mainApiClient.put<boolean>(`/api/admin/disease/${seq}/view`, dto);
  },
  fetchAdminDoctorList(
    page: number,
    searchType: string,
    searchText: string,
  ) {
    /** 질환 리스트 **/
    return mainApiClient.get<Paginated<StandardDiseaseRowInfo[]>>(`/api/admin/disease/list?page=${page}&searchType=${searchType}&searchText=${searchText}`);
  },
};

export default adminDiseaseApi;
