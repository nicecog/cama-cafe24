import mainApiClient from '@/services/apis/mainApiClient';

import { AccountDiseaseInfo, AccountDiseaseAllInfo } from '@/services/apis/AccountDisease/response';

/** 유저 질병 APIs **/
const accountDiseaseApi = {
  fetchAccountDiseaseList(hSeq: number) {
    /** 질병 리스트 **/
    return mainApiClient.get<AccountDiseaseInfo[]>(`/api/account/disease?hSeq=${hSeq}`);
  },
  fetchAccountDiseaseAllList(hSeq: number) {
    /** 질병 리스트 all **/
    return mainApiClient.get<AccountDiseaseAllInfo[]>(`/api/account/disease/all?hSeq=${hSeq}`);
  },
};

export default accountDiseaseApi;
