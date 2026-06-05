import { ScheduleType } from '@/constants/enums';

export interface ScheduleDto {
  alarm: boolean;
  days: number[],
  // diseaseSeq: number[],
  endDate: string;
  memo: string;
  repeat: boolean;
  scheduleName: string;
  scheduleType: ScheduleType;
  startDate: string;
  time: string;
}
