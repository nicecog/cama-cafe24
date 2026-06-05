export type AccountRole = 'ADMIN' | 'USER';
export type AccountGender = 'MALE' | 'FEMAIL';
export type AccountSignType = 'DEFAULT' | 'NAVER' | 'KAKAO' | 'APPLE' | 'GOOGLE';

export interface Account {
  birth: string | null;
  createdAt: string;
  dropReason: string | null;
  droppedOutDate: string | null;
  email: string;
  gender: AccountGender | null;
  impUid: string;
  name: string | null;
  nickName: string;
  phone: string | null;
  profileImage: string;
  roles: AccountRole[];
  seq: number;
  signType: AccountSignType;
  updatedAt: string;
}

export interface AuthInfo {
  apiToken: string;
  account: Pick<Account, 'seq' | 'nickName' | 'profileImage'>;
}
