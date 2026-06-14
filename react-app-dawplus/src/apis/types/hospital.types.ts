/**
 * Hospital (병원) 관련 타입 정의
 */

/**
 * 병원 정보
 */
export interface Hospital {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HospitalListItem {
  seq: number;
  name: string;
  corpNumber?: string;
  address?: string;
  homepage?: string;
  profName?: string;
  profMajor?: string;
  profEmail?: string;
  profPhone?: string;
  createdAt?: string;
}
