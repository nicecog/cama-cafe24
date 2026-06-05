import mainApiClient from '@/services/apis/mainApiClient';

import { ContentsInfo } from '@/services/apis/contents/response';
import { FavoriteInfo } from '@/services/apis/contents/favoriteReq';

/** 치료정보 APIs **/
const contentsApi = {
  getContentsDetail(seq: number) {
    /** 치료정보 상세 **/
    return mainApiClient.get<ContentsInfo>(`/api/contents/${seq}/view`);
  },
  fetchContentsList() {
    /** 치료정보 리스트 **/
    return mainApiClient.get<ContentsInfo[]>(`/api/contents/list?paging=false`);
  },
  searchContentsList(searchText: string, cancerSelected: string) {
    /** 치료정보 리스트 - 검색 **/
    return mainApiClient.get<ContentsInfo[]>(
      `/api/contents/list?paging=false&searchText=${searchText}&diseaseSeq=${cancerSelected}`,
    );
  },
  fetchFavoriteList() {
    /** 나의 암정보 가이드 즐겨찾기 리스트 **/
    return mainApiClient.get<ContentsInfo[]>(`/api/contents/favoriteList`);
  },
  saveFaviriteInfo(dto: FavoriteInfo) {
    /** 암정보 가이드 여정 진도율 업데이트 **/
    return mainApiClient.put<boolean>(`/api/contents/favoriteSave`, dto);
  },
};

export default contentsApi;
