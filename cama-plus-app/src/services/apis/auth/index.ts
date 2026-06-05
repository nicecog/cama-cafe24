import mainApiClient from '@/services/apis/mainApiClient';

import { LoginPassDto, LoginCredentialsDto } from '@/services/apis/auth/request';
import { LoginResp } from '@/services/apis/auth/response';

const authApi = {
  loginPass(dto: LoginPassDto) {
    /** PASS 로그인 (레거시) **/
    return mainApiClient.post<LoginResp>(`/api/auth/pass`, dto);
  },
  loginCredentials(dto: LoginCredentialsDto) {
    /** ID/PW 로그인 **/
    return mainApiClient.post<LoginResp>(`/api/auth`, dto);
  },
  loginSecure(dto: { secureCode: string }) {
    /** 관계자 로그인 **/
    return mainApiClient.post<LoginResp>(`/api/auth/secure`, dto);
  },
};

export default authApi;
