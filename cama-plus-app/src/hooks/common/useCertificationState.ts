import { useState } from 'react';
import { IMPData } from 'iamport-react-native/lib/typescript/utils/Validation';

import { currentStage } from '@/services/apis/mainApiClient';

export interface CallbackResult {
  success: boolean | 'true' | 'false';
  imp_success: boolean | 'true' | 'false';
  imp_uid: string;
  merchant_uid: string;
  error_msg?: string;
}

function useCertificationState() {
  const [certificating, setCertificating] = useState<boolean>(false);

  const getCertificationData = (): IMPData.CertificationData => ({
    carrier: '',
    name: '',
    phone: '',
    merchant_uid: `mid_${new Date().getTime()}`,
    company: 'Cama',
  });

  //foundation 식별코드 : imp87388402
  //휴딧 식별코드 : imp58154860
  return {
    userCode: currentStage === 'PROD' ? 'imp58154860' : 'imp58154860',
    certificating,
    setCertificating,
    getCertificationData,
  };
}

export default useCertificationState;
