export interface DiseaseOption {
  groupName: string;
  optionName: string;
  sort: number;
}

export interface DiseaseTreatmentSort {
  name: string;
  sort: number;
}

export interface DiseaseDto {
  diseaseSeq: number;
  hospitalSeq: number;
  options: DiseaseOption[];
  treatments: DiseaseTreatmentSort[];
}
