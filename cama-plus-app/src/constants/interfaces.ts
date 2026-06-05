import { PlatformType, GenderType, SignType, RoleType } from '@/constants/enums';

export interface Firebase {
  device: string;
  platform: PlatformType;
  token: string;
}

export interface Account {
  birth: string;
  createdAt: string;
  dropReason: string;
  droppedOutDate: string;
  email: string;
  gender: GenderType;
  impUid: string;
  loginId: string;
  name: string;
  nickName: string;
  phone: string;
  profileImage: string;
  roles: RoleType[];
  seq: number;
  signType: SignType;
  updatedAt: string;
}
