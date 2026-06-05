import mainApiClient from '@/services/apis/mainApiClient';
import { CoachingInfoRequest } from '@/services/apis/coaching/request';
import { CoachingInfoReponse } from '@/services/apis/coaching/response';

/** 최근 알림 APIs **/
const coachingInfoApi = {
  fetchCoachingProgressList(dto: CoachingInfoRequest) {
    /** 건강코칭 카테고리별 진도율 **/
    return mainApiClient.post<CoachingInfoReponse[]>(
      `/api/coaching/service/getCoachingProgressList`,
      dto,
    );
  },
};

export default coachingInfoApi;
