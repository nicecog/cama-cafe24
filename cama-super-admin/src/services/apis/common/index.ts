import mainApiClient from '../mainApiClient';

import { CareTimeInfo, DiseaseInfo, HospitalDiseaseInfo, NewHospitalDiseaseInfo } from './response';

const commonApi = {
  uploadImage(formData: FormData) {
    /** 메인 이미지 업로드 **/
    return mainApiClient.post<string[]>('/api/common/images/upload', formData);
  },
  uploadBase64Image(dto: { base64: string }) {
    /** Base64 이미지 업로드 **/
    return mainApiClient.post<string>(
      '/api/common/images/base64/upload',
      dto,
    );
  },
  fetchCancerStepList() {
    /** 암치료 시기 - Removed **/
    return mainApiClient.post<CareTimeInfo[]>('/api/common/care/time/type');
  },
  fetchHospitalDiseaseList(hospitalSeq: number) {
    /** 질병 상세 리스트(병원별) - - Removed **/
    return mainApiClient.get<HospitalDiseaseInfo[]>(`/api/common/disease/${hospitalSeq}/detail/list`);
  },
  fetchDiseaseList() {
    /** 질병 리스트 **/
    return mainApiClient.get<DiseaseInfo[]>(`/api/common/disease/list`);
  },
  fetchNewHospitalDiseaseList(hSeq: number) {
    /** 병원 질병 리스트 **/
    return mainApiClient.get<NewHospitalDiseaseInfo[]>(`/api/common/hospital/${hSeq}/disease/list`);
  },
}

export default commonApi
