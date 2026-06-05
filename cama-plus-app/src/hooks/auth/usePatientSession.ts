import { useCallback } from 'react';

import { useSetAccountState } from '@/hooks/recoil/useAccountMeRecoilState';
import { useSetAuthState } from '@/hooks/recoil/useAuthRecoilHooks';
import authApi from '@/services/apis/auth';
import hospitalApi from '@/services/apis/hospital';
import { setTokenEncryptedStorage } from '@/storages/tokenStorage';
import { generateFirebaseInfo } from '@/utils/infos';
import { showAlertMessage } from '@/utils/alertMessage';
import { resolveLoginErrorMessage } from '@/utils/loginErrorMessage';

export function usePatientSession() {
  const setAuthState = useSetAuthState();
  const setAccountState = useSetAccountState();

  const completePatientLogin = useCallback(
    async (loginId: string, password: string) => {
      const firebase = await generateFirebaseInfo();
      const resp = await authApi.loginCredentials({
        principal: loginId.trim(),
        credentials: password,
        firebase,
      });

      const { account, apiToken } = resp;
      await setTokenEncryptedStorage(apiToken);
      setAccountState(account);

      const serviceType = await hospitalApi.checkHospitalService();
      if (serviceType === 'NOT_SERVICE') {
        setAuthState('selectInfo');
      } else {
        setAuthState('loggedIn');
      }
    },
    [setAccountState, setAuthState],
  );

  const handleLoginError = useCallback((err: unknown) => {
    showAlertMessage({
      title: '로그인 실패',
      message: resolveLoginErrorMessage(err),
    });
  }, []);

  return { completePatientLogin, handleLoginError };
}
