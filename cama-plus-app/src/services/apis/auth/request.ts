import { Firebase } from '@/constants/interfaces';

export interface LoginPassDto {
  firebase: Firebase;
  impUid: string;
}

export interface LoginCredentialsDto {
  principal: string;
  credentials: string;
  firebase: Firebase;
}
