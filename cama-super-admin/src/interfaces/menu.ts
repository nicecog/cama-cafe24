import { ApiResponsePagination } from 'apis/ApiClient';

export interface Breadcrumb {
  title: string;
  link?: string;
}

export type Route = 'notices' | 'qnas' | 'users' | 'members' | 'designs';

export type RoutePagination = {
  [key in Route]?: ApiResponsePagination;
};

export interface Menu extends Breadcrumb {
  link: string;
  icon?: JSX.Element;
  sub?: Menu[];
}
