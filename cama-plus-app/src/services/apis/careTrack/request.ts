import {
  DiseaseOption,
  DiseaseTreatment,
} from '@/services/apis/hospital/response';

export interface CareTrackDto {
  days: number;
  diseaseSeq: number;
  diseaseStage: string;
  interest: string[];
  treatment: string;
}

export interface CareTrackCheckDto {
  diseaseSeq: number;
  hospitalSeq: number;
}

export interface CareTrackInfoDto {
  day: number;
  diseaseSeq: number;
  hospitalSeq: number;
}

export interface TrackProgressGuestDto {
  contentsSeq: number;
  progress: number;
}

export interface TrackProgressDto {
  contentsSeq: number;
  progress: number;
  trackServiceSeq: number;
}

export interface DiseaseInfo {
  diseaseOption: DiseaseOption[];
  diseaseSeq: number;
  diseaseTreatment: DiseaseTreatment[];
  name: string;
  seq: number;
}

export interface CareTrackNewDto {
  days: number;
  diseaseSeq: number;
  diseases: DiseaseInfo;
  interest: string[];
}

export interface CareTrackStepDto {
  executionDate: string;
  stepNum: number;
}
