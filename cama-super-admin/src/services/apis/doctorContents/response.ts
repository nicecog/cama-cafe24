import { HospitalService } from '../../../constants/enums';
import { CareTimeInfo } from '../common/response';

export interface TreatmentInfo {
  seq: number;
  doctorSeq: number;
  trackServiceSeq: number | null;
  diseaseSeq: number;
  diseaseName: string;
  doctorName: string;
  departmentName: string;
  title: string;
  image: string;
  contents: string;
  interest: string; // string[] to parse
  createdAt: string;
  updatedAt: string
  progress: number | null;
  disease: string | null;
  viewCount: number;
  viewed: boolean;
}

export interface ServiceInfo {
  approveDate: string;
  createdAt: string;
  doctorName: string;
  hospitalName: string;
  name: string;
  rejectDate: string;
  serviceSeq: number;
  status: HospitalService;

}
