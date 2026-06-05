import { Pagination } from '../services/apis/mainApiClient';

export const DRAWER_WIDTH = 280;

export const FULL_SCREEN_MAX_WIDTH = 640;

export const APP_NAME = 'CAMA Plus';
export const APP_NAME_KR = 'CAMA Plus';

export const defaultPaginationValue: Pagination = {
  beginPage: 0,
  currentPage: 1,
  displayPage: 0,
  displayRow: 0,
  endNum: 0,
  endPage: 0,
  nextPage: 0,
  prevPage: 0,
  startNum: 0,
  totalCount: 0,
  totalPage: 1,
}
