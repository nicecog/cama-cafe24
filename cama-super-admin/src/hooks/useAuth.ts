import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/** Types **/
import { AuthInfo } from '../services/apis/auth/response';

/** Hooks **/
import { useAuthRecoilState } from './recoil/useAuthState';

/** Storages **/
import {
  setTokenLocalStorage,
  getTokenLocalStorage,
  clearTokenLocalStorage,
} from '../storages/tokenStorage';
import doctorContentsApi from '../services/apis/doctorContents';
import adminAccountApi from '../services/apis/adminAccount';

function useAuth() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useAuthRecoilState();

  const isLoggedIn = useMemo(() => Boolean(authState), [authState]);

  const handleLogout = () => {
    setAuthState(null);
    clearTokenLocalStorage();
    navigate('/login', { replace: true });
  };

  const handleLogin = (info: AuthInfo) => {
    setAuthState(info);
    setTokenLocalStorage(info.apiToken);
  };

  const initAuth = useCallback(async (): Promise<boolean> => {
    const token = getTokenLocalStorage();

    if (token === null) {
      setAuthState(null);
      return false;
    }

    try {
      const adminInfo = await adminAccountApi.getAdminHospitalDetail();
      setAuthState({
        apiToken: token,
        admin: adminInfo,
      });
      return true;
    } catch (err) {
      console.log(err);
      setAuthState(null);
      clearTokenLocalStorage();
      return false;
    }
  }, [setAuthState]);

  return {
    authState,
    isLoggedIn,
    setAuthState,
    initAuth,
    handleLogin,
    handleLogout,
  };
}

export default useAuth;
