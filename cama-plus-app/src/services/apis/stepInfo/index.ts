import mainApiClient from '@/services/apis/mainApiClient';

import { StepInfoDto } from '@/services/apis/stepInfo/request';
import { StepInfo } from '@/services/apis/stepInfo/response';

/** 최근 알림 APIs **/
const stepInfoApi = {
  fetchCareTrackStepList(dto: StepInfoDto) {
    /** 일자별 걸음 정보 **/
    return mainApiClient.post<StepInfo[]>(`/api/track/service/stepList`, dto);
  },
  updateCareTrackStepInfo(dto: StepInfoDto) {
    /** 걸음 업데이트 **/
    return mainApiClient.put<boolean>(`/api/track/service/step`, dto);
  },
};

export default stepInfoApi;
