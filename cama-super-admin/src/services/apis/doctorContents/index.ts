import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { TreatmentInfo, ServiceInfo } from './response';
import { DoctorContentsDto, DoctorServiceStatusDto, NewDoctorContentsDto } from './request';
import { Doctor } from '../../../constants/interfaces';

/** 의사 APIs **/
const doctorContentsApi = {
  fetchDoctorContentsList(
    page: number,
    searchType: string,
    searchText: string,
  ) {
    /** 치료정보 리스트 **/
    return mainApiClient.get<Paginated<TreatmentInfo[]>>(`/api/doctor/contents?page=${page}&searchType=${searchType}&searchText=${searchText}`);
  },
  fetchDoctorContentsDisabledList(
    page: number,
    searchType: string,
    searchText: string,
  ) {
    /** 치료정보 리스트 **/
    return mainApiClient.get<Paginated<TreatmentInfo[]>>(`/api/doctor/disable/contents?page=${page}&searchType=${searchType}&searchText=${searchText}`);
  },
  addDoctorContents(dto: NewDoctorContentsDto) {
    /** 치료정보 등록 **/
    return mainApiClient.post<boolean>(`/api/doctor/contents`, dto);
  },
  getDoctorContentsDetail(seq: string) {
    /** 치료정보 상세 **/
    return mainApiClient.get<TreatmentInfo>(`/api/doctor/contents/${seq}/view`);
  },
  updateDoctorContents(seq: string, dto: NewDoctorContentsDto) {
    /** 치료정보 수정 **/
    return mainApiClient.put<boolean>(`/api/doctor/contents/${seq}/view`, dto);
  },
  getDoctorInfoCount() {
    /** 의사페이지 숫자 정보 **/
    return mainApiClient.get<{ doneContents: number; ingContents: number }>(`/api/doctor/count/info`);
  },
  getDoctorMe() {
    /** 의사 정보 **/
    return mainApiClient.get<Doctor>(`/api/doctor/me`);
  },
  fetchDoctorServiceList() {
    /** 서비스 리스트 **/
    return mainApiClient.get<Paginated<ServiceInfo[]>>(`/api/doctor/service`);
  },
  getDoctorServiceDetail(seq: string) {
    /** 서비스 상세 **/
    return mainApiClient.get<ServiceInfo>(`/api/doctor/service/${seq}/view`);
  },
  updateDoctorServiceStatus(seq: string, dto: DoctorServiceStatusDto) {
    /** 서비스 승인 및 거절 **/
    return mainApiClient.put<boolean>(`/api/doctor/service/${seq}/view`, dto);
  },
};

export default doctorContentsApi;
