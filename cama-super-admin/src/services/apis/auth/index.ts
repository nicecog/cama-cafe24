import mainApiClient from '../mainApiClient';

import { LoginDto } from './request';
import { AuthInfo } from './response';

const authApi = {
  loginAdmin(dto: LoginDto) {
    /** 로그인 **/
    return mainApiClient.post<AuthInfo>(`/api/auth/admin`, dto);
  },
  loginDoctor(dto: LoginDto) {
    /** 로그인 **/
    return mainApiClient.post<AuthInfo>(`/api/auth/doctor`, dto);
  },
};

export default authApi;
