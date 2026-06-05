import mainApiClient from '@/services/apis/mainApiClient';

import { ChangeLoginIdDto, SignUpDto } from '@/services/apis/account/request';
import { Account } from '@/constants/interfaces';
import { AccountHospitalInfo, ChangeLoginIdResp } from '@/services/apis/account/Response';

/** 유저 APIs **/
const accountApi = {
  signUp(dto: SignUpDto) {
    /** 회원가입 **/
    return mainApiClient.post<boolean>(`/api/account`, dto);
  },
  resetFirebaseToken() {
    /** 파이어베이스 초기화 **/
    return mainApiClient.put<boolean>(`/api/account/firebase/init`);
  },
  getAccountHospital() {
    /** 내 병원 정보 **/
    return mainApiClient.get<AccountHospitalInfo>(`/api/account/hospital`);
  },
  getAccountMe() {
    /** 회원정보 **/
    return mainApiClient.get<Account>(`/api/account/me`);
  },
  checkAccountSignedUp(dto: { impUid: string }) {
    /** 아임포트로 가입 여부 확인 **/
    return mainApiClient.post<boolean>(`/api/account/sign/check`, dto);
  },
  withdrawalAccount() {
    /** 회원 탈퇴 **/
    return mainApiClient.post<boolean>(`/api/account/withdrawal`);
  },
  changeLoginId(dto: ChangeLoginIdDto) {
    /** 로그인 ID 변경 **/
    return mainApiClient.put<ChangeLoginIdResp>(`/api/account/login-id`, dto);
  },
};

export default accountApi;
