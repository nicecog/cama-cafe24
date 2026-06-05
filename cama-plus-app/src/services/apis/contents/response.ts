export interface CareTimeInfo {
  createdAt: string;
  name: string;
  seq: number;
  updatedAt: string;
}

export interface ContentsInfo {
  careTimeList: CareTimeInfo[];
  contents: string;
  createdAt: string;
  departmentName: string; //
  diseaseName: string;
  diseaseSeq: number;
  doctorName: string;
  doctorSeq: number;
  image: string;
  interest: string;
  progress: number | null; //
  seq: number;
  title: string;
  trackServiceSeq: number; //
  viewed: boolean;
  removed: boolean;
  favoriteYn: string;
}

export interface CareTrackStepInfo {
  executionDate: string;
  accountSeq: number;
  accountName: string;
  stepNum: number;
}
