export interface DiseaseInfoOptions {
  createdAt: string;
  groupName: string;
  hpDiseaseSeq: number;
  optionName: string;
  seq: number;
  sort: number;
  updatedAt: string;
}

export interface DiseaseInfoTreatment {
  createdAt: string;
  hpDiseaseSeq: number;
  name: string;
  seq: number;
  sort: number;
  updatedAt: string;
}

export interface StandardDiseaseInfo {
  diseaseName: string;
  diseaseSeq: number;
  hospitalName: string;
  hospitalSeq: number;
  options: DiseaseInfoOptions[];
  treatments: DiseaseInfoTreatment[];
}

export interface StandardDiseaseRowInfo {
  contentsCount: number;
  diseaseName: string;
  diseaseSeq: number;
  hospitalName: string;
  hospitalSeq: number;
  seq: number;
  treatmentCount: number;
  updatedAt: string;
}
