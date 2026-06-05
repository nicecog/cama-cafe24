export interface AccountDiseaseInfo {
  days: number;
  diseaseName: string;
  diseaseSeq: number;
  trackCreatedAt: string | null;
  trackSeq: number;
}

export interface AccountDiseaseAllInfo extends AccountDiseaseInfo {
  doctorName: string;
  doctorSeq: number;
  progress: number;
  departmentName: string;
  diseaseDetails: string[];
}
