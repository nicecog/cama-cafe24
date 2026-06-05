import { Account } from '@/constants/interfaces';

export interface LoginResp {
  account: Account;
  apiToken: string;
}
