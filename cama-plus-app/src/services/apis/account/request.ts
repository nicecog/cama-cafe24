import { SignType } from '@/constants/enums';
import { Firebase } from '@/constants/interfaces';

export interface SignUpDto {
  email: string;
  firebase: Firebase;
  impUid: string;
  nickName: string;
  password: string;
  signType: SignType;
}

export interface ChangeLoginIdDto {
  newLoginId: string;
  credentials: string;
}
