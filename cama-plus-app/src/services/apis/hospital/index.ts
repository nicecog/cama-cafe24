import mainApiClient from '@/services/apis/mainApiClient';

import { HospitalService } from '@/constants/enums';
import { HospitalInfo, HospitalDoctorInfo, HospitalDiseaseInfo } from '@/services/apis/hospital/response';
import { ApplyingHospitalServiceDto } from '@/services/apis/hospital/request';

const hospitalApi = {
  cancelHospitalService(hSeq: number) {
    /** 병원 서비스 신청 취소 **/
    return mainApiClient.post<boolean>(`/api/hospital/${hSeq}/service/cancel`);
  },
  fetchHospitalDiseaseList(hSeq: number) {
    /** 병원 질병 리스트 **/
    return mainApiClient.get<HospitalDiseaseInfo[]>(`/api/hospital/${hSeq}/disease/list`);
  },
  fetchHospitalDoctorList(hospitalSeq: number) {
    /** 병원 의사 리스트 **/
    return mainApiClient.get<HospitalDoctorInfo[]>(`/api/hospital/${hospitalSeq}/doctor/list`);
  },
  fetchHospitalList() {
    /** 병원 리스트 **/
    return mainApiClient.get<HospitalInfo[]>(`/api/hospital/list`);
  },
  applyHospitalService(dto: ApplyingHospitalServiceDto) {
    /** 병원 서비스 신청 **/
    return mainApiClient.post<boolean>(`/api/hospital/service/apply`, dto);
  },
  checkHospitalService() {
    /** 병원 서비스 신청 확인 **/
    return mainApiClient.post<HospitalService>(`/api/hospital/service/check`);
  },
};

export default hospitalApi;
