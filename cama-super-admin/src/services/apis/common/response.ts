export interface CareTimeInfo {
  seq: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiseaseInfo {
  name: string;
  seq: number;
}

export interface HospitalDiseaseInfo extends DiseaseInfo {
  diseaseSeq: number;
  hospitalSeq: number;
}

/** New Info **/
export interface DiseaseOptionInfo {
  optionName: string;
  seq: number;
}

export interface DiseaseOption extends DiseaseOptionInfo {
  groupName: string;
}

export interface DiseaseTreatment {
  name: string;
  seq: number;
}

export interface NewHospitalDiseaseInfo {
  diseaseName: string;
  diseaseOption: DiseaseOption[];
  diseaseSeq: number;
  diseaseTreatment: DiseaseTreatment[];
  seq: number;
}
