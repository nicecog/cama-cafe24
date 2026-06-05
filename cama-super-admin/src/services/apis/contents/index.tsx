import mainApiClient from '../mainApiClient';

import { Paginated } from '../../../constants/interfaces';
import { ContentsInfo, ContentsListItem } from './response';

/** 치료정보 APIs **/
const contentsApi = {
  fetchContentsList(page: number, searchText: string = '') {
    const query = new URLSearchParams({
      page: String(page),
      lang: 'KO',
    });
    if (searchText) {
      query.set('searchText', searchText);
    }
    return mainApiClient.get<Paginated<ContentsListItem[]>>(
      `/api/contents/list?${query.toString()}`,
    );
  },
  getContentsDetailForWebview(seq: string) {
    /** 치료정보 내용 웹뷰용 **/
    return mainApiClient.get<ContentsInfo>(`/api/contents/${seq}/webview`);
  },
};

export default contentsApi;
