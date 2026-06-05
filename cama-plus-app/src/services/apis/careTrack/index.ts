import mainApiClient from '@/services/apis/mainApiClient';

import {
  TrackProgressDto,
  CareTrackCheckDto,
  CareTrackInfoDto,
  CareTrackNewDto,
  TrackProgressGuestDto,
  CareTrackStepDto,
} from '@/services/apis/careTrack/request';
import {
  ContentsInfo,
  CareTrackStepInfo,
} from '@/services/apis/contents/response';
import {
  CareTrackDoneInfo,
  CareTrackAppliedInfo,
} from '@/services/apis/careTrack/response';

/** 암정보 가이드 여정 APIs **/
const careTrackApi = {
  getCareTrackServiceAppliedInfo() {
    /** 암정보 가이드 여정 신청정보 **/
    return mainApiClient.get<CareTrackAppliedInfo>(`/api/track/service`);
  },
  applyCareTrackService(dto: CareTrackNewDto) {
    /** 암정보 가이드 여정 신청 **/
    return mainApiClient.post<boolean>(`/api/track/service`, dto);
  },
  stopCareTrackService(dto: CareTrackCheckDto) {
    /** 암정보 가이드 여정 신청 **/
    return mainApiClient.post<boolean>(`/api/track/service/cancel`, dto);
  },
  checkAppliedCareTrackService() {
    /** 암정보 가이드 여정 신청확인 **/
    return mainApiClient.get<boolean>(`/api/track/service/check`);
  },
  checkDoneCareTrackService(dto: CareTrackInfoDto) {
    /** 암정보 가이드 여정 완료확인 **/
    return mainApiClient.post<CareTrackDoneInfo[]>(
      `/api/track/service/done`,
      dto,
    );
  },
  updateCareTrackServiceProgressGuest(dto: TrackProgressGuestDto) {
    /** 암정보 가이드 여정 진도율 업데이트(비회원) **/
    return mainApiClient.put<boolean>(`/api/track/service/guest/progress`, dto);
  },
  fetchCareTrackServiceList(dto: CareTrackInfoDto) {
    /** 암정보 가이드 여정 정보 **/
    return mainApiClient.post<ContentsInfo[]>(`/api/track/service/info`, dto);
  },
  updateCareTrackServiceProgressOff(dto: TrackProgressGuestDto) {
    /** 암정보 가이드 여정 진도율 업데이트(서비스 전) **/
    return mainApiClient.put<boolean>(`/api/track/service/off/progress`, dto);
  },
  updateCareTrackServiceProgress(dto: TrackProgressDto) {
    /** 암정보 가이드 여정 진도율 업데이트 **/
    return mainApiClient.put<boolean>(`/api/track/service/progress`, dto);
  },
};

export default careTrackApi;
