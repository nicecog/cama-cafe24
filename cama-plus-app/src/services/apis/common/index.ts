import mainApiClient from '@/services/apis/mainApiClient';

import { CommonDiseaseInfo } from '@/services/apis/common/response';

/** 공통 데이터 APIs **/
const commonDiseaseApi = {
  fetchCommonDiseaseList() {
    /** 질병 리스트 **/
    return mainApiClient.get<CommonDiseaseInfo[]>(`/api/common/disease/list`);
  },
};

export default commonDiseaseApi;
