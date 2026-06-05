import { ScheduleType } from '@/constants/enums';

export interface ScheduleInfo {
  alarm: boolean;
  batchSeq: number;
  createdAt: string;
  days: string;
  diseaseSeq: string;
  done: boolean;
  endDate: string;
  memo: string;
  repeat: boolean;
  scEndDate: string;
  scStartDate: string;
  scheduleName: string;
  scheduleSeq:  number;
  scheduleType: ScheduleType;
  startDate: string;
  time: string;
}
