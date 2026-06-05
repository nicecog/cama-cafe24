import { ContentsInfo } from '@/services/apis/contents/response';

export interface CareTrackInfo {
  contents: ContentsInfo;
  trackCreatedAt: string;
}

export interface CareTrackDoneInfo {
  day: number;
  progress: number;
}

export interface CareTrackAppliedInfo {
  data: string;
  days: number;
  disease: string;
  diseaseName: string;
  diseaseSeq: number;
  interest: string;
  process: number;
  seq: number;
  trackCreatedAt: string;
}
