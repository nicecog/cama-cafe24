import { AmPmType, ScheduleType, WeekDayType, DiseaseType } from '@/constants/enums';

export const amPmLabel = (amPmType: AmPmType) => {
  switch (amPmType) {
    case 'AM':
      return '오전';
    case 'PM':
      return '오후';
    default:
      return '';
  }
};

export const scheduleLabel = (scheduleType: ScheduleType) => {
  switch (scheduleType) {
    case 'ALL':
      return '전체';
    case 'MEDICINE':
      return '복약';
    case 'HOSPITAL':
      return '내원';
    case 'ETC':
      return '기타';
    default:
      return '';
  }
};

export const weekDayLabel = (weekDayType: WeekDayType) => {
  switch (weekDayType) {
    case 'MON':
      return '월';
    case 'TUE':
      return '화';
    case 'WED':
      return '수';
    case 'THU':
      return '목';
    case 'FRI':
      return '금';
    case 'SAT':
      return '토';
    case 'SUN':
      return '일';
    default:
      return '';
  }
};

export const diseaseLabel = (diseaseType: DiseaseType) => {
  switch (diseaseType) {
    case 'NOTHING':
      return '해당없음';
    case 'BREAST_CANCER':
      return '유방암';
    case 'LUNG_CANCER':
      return '폐암';
    case 'COLORECTAL_CANCER':
      return '대장암';
    case 'PANCREATIC_CANCER':
      return '췌장암';
    case 'THYROID_CANCER':
      return '갑상선암';
    case 'ETC':
      return '기타';
    default:
      return '';
  }
};
