import mainApiClient from '@/services/apis/mainApiClient';

import { ScheduleDto } from '@/services/apis/scheduleManager/request';
import { ScheduleInfo } from '@/services/apis/scheduleManager/response';

/** 일정 관리 APIs **/
const scheduleManagerApi = {
  getSchedule(date: string) {
    /** 일정 조회 **/
    return mainApiClient.get<ScheduleInfo[]>(`/api/schedule?d=${date}`);
  },
  addSchedule(dto: ScheduleDto) {
    /** 일정 등록 **/
    return mainApiClient.post<boolean>(`/api/schedule`, dto);
  },
  checkDoneSchedule(batchSeq: number) {
    /** 일정 완료처리 **/
    return mainApiClient.post<boolean>(`/api/schedule/${batchSeq}/done`);
  },
  checkUnDoneSchedule(batchSeq: number) {
    /** 일정 미완료처리 **/
    return mainApiClient.post<boolean>(`/api/schedule/${batchSeq}/unDone`);
  },
  updateSchedule(seq: number, dto: ScheduleDto) {
    /** 일정 수정 **/
    return mainApiClient.put<boolean>(`/api/schedule/${seq}/view`, dto);
  },
  deleteSchedule(seq: number) {
    /** 일정 삭제 **/
    return mainApiClient.delete<boolean>(`/api/schedule/${seq}/view`);
  },
  getScheduleMonthly(date: string) {
    /** 일정 조회(월별) **/
    return mainApiClient.get<ScheduleInfo[]>(
      `/api/schedule/monthly?monthly=${date}`,
    );
  },
};

export default scheduleManagerApi;
