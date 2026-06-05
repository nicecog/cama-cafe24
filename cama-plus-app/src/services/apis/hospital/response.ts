export interface HospitalInfo {
  address: string;
  callNumber: string;
  createdAt: string;
  name: string;
  seq: number;
}

export interface HospitalDoctorInfo {
  departmentName: string;
  departmentSeq: number;
  doctorName: string;
  doctorSeq: number;
  hospitalName: string;
  hospitalSeq: number;
}

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
  treatmentPeriod: string;
}

export interface HospitalDiseaseInfo {
  diseaseName: string;
  diseaseOption: DiseaseOption[];
  diseaseSeq: number;
  diseaseTreatment: DiseaseTreatment[];
  seq: number;
}
