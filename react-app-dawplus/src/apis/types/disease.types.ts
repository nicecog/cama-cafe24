/**
 * 질환 옵션 타입
 */
export interface DiseaseOption {
  seq: number;
  groupName: string;
  optionName: string;
}

/**
 * 질환 치료 타입
 */
export interface DiseaseTreatment {
  seq: number;
  name: string;
  treatmentPeriod: string;
}

/**
 * 질환 정보 타입
 */
export interface Disease {
  seq: number;
  diseaseSeq: number;
  diseaseName: string;
  diseaseOption: DiseaseOption[];
  diseaseTreatment: DiseaseTreatment[];
}

/**
 * 질환 목록 응답 타입
 */
export type DiseaseListResponse = Disease[];

/**
 * 사용자 선택 상태 타입
 */
export interface CancerInfoSelection {
  disease?: Disease; // Step 1: 선택된 질환
  treatment?: DiseaseTreatment; // Step 2: 선택된 치료시기
  diseaseType?: DiseaseOption; // Step 3: 선택된 암 종류
  otherOption?: DiseaseOption; // Step 4: 선택된 그 외 고려사항 (단일 선택)
  interestAreas?: string[]; // Step 5: 관심있는 영역 (다중 선택)
  contentPeriod?: number; // Step 6: 컨텐츠 기간 (14, 28, 60 등)
}

/**
 * 질환 정보 (API 요청용)
 */
export interface DiseaseInfo {
  diseaseOption: DiseaseOption[];
  diseaseSeq: number;
  diseaseTreatment: DiseaseTreatment[];
  name: string;
  seq: number;
}

/**
 * 암정보 가이드 설정 DTO
 */
export interface CareTrackNewDto {
  acSeq?: string | number;
  days: number;
  diseaseSeq: number;
  diseases: DiseaseInfo;
  interest: string[];
}
