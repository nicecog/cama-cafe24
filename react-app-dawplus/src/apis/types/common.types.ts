/**
 * 페이지네이션 정보
 */
export interface Pagination {
  startNum: number;
  endNum: number;
  totalCount: number;
  currentPage: number;
  totalPage: number;
  displayPage: number;
  displayRow: number;
  beginPage: number;
  endPage: number;
  prevPage: number;
  nextPage: number;
}

/**
 * 기본 API 응답 타입 (제네릭)
 * 실제 서버 응답 구조: { success, error, response, pagination? }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  error: {
    message: string;
    status: number;
  } | null;
  response: T;
  pagination?: Pagination;
}

/**
 * 페이지네이션이 있는 응답 타입
 */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  error: {
    message: string;
    status: number;
  } | null;
  response: T[];
  pagination: Pagination;
}

/**
 * API 에러 응답 타입
 */
export interface ApiError {
  success: false;
  error: {
    message: string;
    status: number;
  };
  response: null;
}

/**
 * 페이지네이션 요청 파라미터
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * 검색 파라미터
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}
