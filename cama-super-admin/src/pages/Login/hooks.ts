import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

/** Types **/
import { LoginDto } from '../../services/apis/auth/request';

/** Hooks **/
import useAuth from 'hooks/useAuth';

/** Services **/
import authApi from '../../services/apis/auth';

interface LoginPayload {
  principal: string; // id
  credentials: string; // password
}

const schema = yup.object().shape({
  principal: yup.string().required('필수 입력 항목입니다.'),
  credentials: yup.string().required('필수 입력 항목입니다.'),
});

function useController() {
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { isLoggedIn, handleLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const handleModalClose = () => {
    setErrorMsg('');
    setModalOpen(false);
  };

  const onSubmit = (data: LoginPayload) => {
    // requestLogin(data);
    const { credentials, principal } = data;
    const dto: LoginDto = {
      credentials,
      principal: principal.trim(),
    }

    authApi
      .loginAdmin(dto)
      .then(res => {
        handleLogin(res);
        navigate('/system-management/hospital/list');
      })
      .catch(err => {
        // if (axios.isAxiosError(err)) {
        //   setModalOpen(true);
        //   setErrorMsg(err.message);
        // }
        setModalOpen(true);
        setErrorMsg(err);
      })
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/system-management/hospital/list', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return {
    onSubmit,
    handleSubmit,
    register,
    errors,
    // isLoading,
    modalOpen,
    errorMsg,
    handleModalClose,
  };
}

export default useController;
