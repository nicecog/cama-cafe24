import { HospitalService } from '@/constants/enums';
import { Account } from '@/constants/interfaces';

export interface AccountHospitalInfo {
  hospitalName: string;
  hospitalSeq: number;
  status: HospitalService;
}

export interface ChangeLoginIdResp {
  apiToken: string;
  account: Account;
  message: string;
}
