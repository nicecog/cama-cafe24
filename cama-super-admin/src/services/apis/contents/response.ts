export interface CareTimeInfo {
  createdAt: string;
  name: string;
  seq: number;
  updatedAt: string;
}

export interface ContentsInfo {
  contents: string;
  interest: string;
  disease: string | null;
}

export interface ContentsListItem {
  seq: number;
  doctorSeq: number;
  diseaseSeq: number;
  diseaseName: string;
  doctorName: string;
  departmentName: string;
  title: string;
  image: string;
  viewCount: number;
  viewed: boolean;
  createdAt: string;
  updatedAt: string;
}
