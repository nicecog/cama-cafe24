import { HospitalService } from '../../../constants/enums';
import { DiseaseOption, DiseaseTreatment } from '../common/response';

export interface DoctorContentsDto {
  careTimeType: string;
  contents: string;
  diseaseSeq: number;
  interest: string;
  title: string;
  image: string;
}

interface diseaseInfo {
  diseaseDetailSeq: number;
  diseaseSeq: number;
}

export interface DoctorServiceStatusDto {
  diseaseList: diseaseInfo[];
  status: HospitalService;
}

export interface NewDiseaseInfo {
  diseaseOption: DiseaseOption[];
  diseaseSeq: number;
  diseaseTreatment: DiseaseTreatment[];
  name: string;
  seq: number;
}

export interface NewDoctorContentsDto {
  careTimeType: string;
  contents: string;
  disease: NewDiseaseInfo;
  diseaseSeq: number;
  image: string;
  interest: string[];
  title: string;
  viewed: boolean;
}
